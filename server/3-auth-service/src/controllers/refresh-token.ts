import { StatusCodes } from 'http-status-codes';
import { IAuthDocument } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { getAuthUserWithEmail, signToken } from '~/services/auth.service';
import { omit } from 'lodash';

export async function refreshToken(req: Request, res: Response): Promise<void> {
  let existingUser: IAuthDocument | undefined = await getAuthUserWithEmail(req.params.email);
  const userJWT: string = signToken(existingUser?.id!, existingUser?.email!, existingUser?.username!);
  existingUser = omit(existingUser, [
    'password',
    'passwordResetExpires',
    'passwordResetToken',
    'otp',
    'otpExpiration',
    'emailVerificationToken'
  ]);
  res.status(StatusCodes.OK).json({
    message: 'Refresh token',
    user: existingUser,
    token: userJWT
  });
}
