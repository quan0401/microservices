import { StatusCodes } from 'http-status-codes';
import { BadRequestError, IAuthDocument } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { AuthModel } from '~/models/auth.schema';
import { loginSchema } from '~/schemes/signin.scheme';
import { getAuthUserWithEmail, signToken, updateUserOTP } from '~/services/auth.service';
import { randomInt } from 'crypto';
import { publishDirectMessage } from '~/queues/auth.producer';
import { authChannel } from '~/server';
import { omit } from 'lodash';

export async function signin(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(loginSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'SignIn signin() method error');
  }
  const { email, password, browserName, deviceType } = req.body;
  const existingUser: IAuthDocument | undefined = await getAuthUserWithEmail(email);
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials', 'SignIn read() method error');
  }
  const passwordMatch: boolean = await AuthModel.prototype.comparePassword(password, `${existingUser.password}`);
  if (!passwordMatch) {
    throw new BadRequestError('Invalid credentials', 'SignIn read() method error');
  }
  let userJWT = '';
  let userData: IAuthDocument | null = null;
  let message = 'User login successfully';
  let userBrowserName = '';
  let userDeviceType = '';
  // if (
  //   lowerCase(browserName) !== lowerCase(`${existingUser.browserName}`) ||
  //   lowerCase(deviceType) !== lowerCase(`${existingUser.deviceType}`)
  // ) {
  //   // 100000 - 999999
  //   const optCode = randomInt(10 ** 5, 10 ** 6 - 1);
  //   // send email with otp
  //   const messageDetails: IEmailMessageDetails = {
  //     receiverEmail: existingUser.email,
  //     username: existingUser.username,
  //     otp: `${optCode}`,
  //     template: 'otpEmail'
  //   };
  //   await publishDirectMessage(
  //     authChannel,
  //     'ecommerce-email-nofitication',
  //     'auth-email',
  //     JSON.stringify(messageDetails),
  //     'OTP email message sent to notification service.'
  //   );
  //   message = 'OTP code sent';
  //   userBrowserName = `${existingUser.browserName}`;
  //   userDeviceType = `${existingUser.deviceType}`;
  //   const date: Date = new Date();
  //   date.setMinutes(date.getMinutes() + 10);
  //   await updateUserOTP(existingUser.id!, `${optCode}`, date, '', '');
  // } else {
  userJWT = signToken(existingUser.id!, existingUser.email!, existingUser.username!);
  userData = omit(existingUser, [
    'password',
    'passwordResetExpires',
    'passwordResetToken',
    'otp',
    'otpExpiration',
    'emailVerificationToken'
  ]);
  // }
  res.status(StatusCodes.OK).json({ message, user: userData, token: userJWT, browserName: userBrowserName, deviceType: userDeviceType });
}
