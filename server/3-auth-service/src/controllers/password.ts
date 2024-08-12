import { StatusCodes } from 'http-status-codes';
import { BadRequestError, IAuthDocument, IEmailMessageDetails } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { getAuthUserByPasswordToken, getAuthUserWithEmail, updatePassword, updatePasswordToken } from '~/services/auth.service';
import crypto from 'crypto';
import { config } from '~/config';
import { publishDirectMessage } from '~/queues/auth.producer';
import { authChannel } from '~/server';
import { changePasswordSchema, passwordSchema } from '~/schemes/password.scheme';
import { AuthModel } from '~/models/auth.schema';

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const { email } = req.body;
  const existingUser: IAuthDocument | undefined = await getAuthUserWithEmail(email);
  if (!existingUser) {
    throw new BadRequestError('User with email does not exist', 'password forgotPassword()');
  }
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const date: Date = new Date();
  date.setHours(date.getHours() + 1);
  await updatePasswordToken(existingUser.id!, randomCharacters, date);
  const resetLink = `${config.CLIENT_URL}/reset_password?token=${randomCharacters}`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: existingUser.email!,
    resetLink,
    username: existingUser.username,
    template: 'forgotPassword'
  };
  await publishDirectMessage(
    authChannel,
    'ecommerce-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Forgot password message sent to notification service.'
  );
  res.status(StatusCodes.OK).json({ message: 'Password reset email sent.' });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(passwordSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'password -> resetPassword()');
  }
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    throw new BadRequestError('Passwords do not match', 'password -> resetPassword()');
  }
  const user: IAuthDocument | undefined = await getAuthUserByPasswordToken(token);
  if (!user) {
    throw new BadRequestError('Reset password token has expired', 'password -> resetPassword()');
  }
  const hashedPassword: string = await AuthModel.prototype.hashPassword(password);
  await updatePassword(user.id!, hashedPassword);
  const messageDetails: IEmailMessageDetails = {
    username: user.username,
    template: 'resetPasswordSuccess'
  };
  await publishDirectMessage(
    authChannel,
    'ecommerce-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Reset password success message sent to notification service.'
  );
  res.status(StatusCodes.OK).json({ message: 'Password successfully updated.' });
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(changePasswordSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'password -> changePassword');
  }
  const { currentPassword, newPassword } = req.body;
  const user: IAuthDocument = (await getAuthUserWithEmail(req.currentUser!.email)) as IAuthDocument;
  if (!(await AuthModel.prototype.comparePassword(currentPassword, user.password!))) {
    throw new BadRequestError('Invalid password.', 'password -> changePassword');
  }
  const hashedPassword: string = await AuthModel.prototype.hashPassword(newPassword);
  await updatePassword(req.currentUser!.id, hashedPassword);
  const messageDetails: IEmailMessageDetails = {
    username: user.username,
    template: 'resetPasswordSuccess'
  };
  await publishDirectMessage(
    authChannel,
    'ecommerce-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Password change success message sent to notification service.'
  );
  res.status(StatusCodes.OK).json({ message: 'Password successfully updated.' });
}
