import { StatusCodes } from 'http-status-codes';
import { BadRequestError, IAuthDocument, IEmailMessageDetails, lowerCase } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { getAuthUserById, getAuthUserWithEmail, updateVerifyEmailField } from '~/services/auth.service';
import { omit } from 'lodash';
import { config } from '~/config';
import crypto from 'crypto';
import { publishDirectMessage } from '~/queues/auth.producer';
import { authChannel } from '~/server';

export async function currentUser(req: Request, res: Response): Promise<void> {
  let user = null;
  const existingUser: IAuthDocument | undefined = await getAuthUserById(req.currentUser!.id);
  if (Object.keys(existingUser!).length) {
    user = existingUser;
  }
  res.status(StatusCodes.OK).json({ message: 'Authenticated user', user });
}

export async function resendEmail(req: Request, res: Response): Promise<void> {
  const { email, userId } = req.body;
  const checkIfUserExist: IAuthDocument | undefined = await getAuthUserWithEmail(email);
  if (!checkIfUserExist) {
    throw new BadRequestError('Email is invalid.', 'current-user -> resendEmail() error');
  }
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;
  await updateVerifyEmailField(parseInt(userId), 0, randomCharacters);
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: lowerCase(email),
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };
  await publishDirectMessage(
    authChannel,
    'ecommerce-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Verify email message has been sent to notification service.'
  );
  const updatedUser: IAuthDocument = (await getAuthUserById(parseInt(userId))) as IAuthDocument;
  const userData = omit(updatedUser, [
    'password',
    'passwordResetExpires',
    'passwordResetToken',
    'otp',
    'otpExpiration',
    'emailVerificationToken'
  ]);
  res.status(StatusCodes.OK).json({ message: 'Email verification sent', user: userData });
}
