import { StatusCodes } from 'http-status-codes';
import { BadRequestError, IAuthDocument } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { getAuthUserByAuthToken, getAuthUserById, updateVerifyEmailField } from '~/services/auth.service';

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const { token } = req.body;
  const existingUser: IAuthDocument | undefined = await getAuthUserByAuthToken(token);
  if (!existingUser) {
    throw new BadRequestError('Verification token is either invalid or is already used.', 'VerifyEmail update() method error');
  }
  await updateVerifyEmailField(existingUser.id!, 1);
  const updatedUser = await getAuthUserById(existingUser.id!);
  res.status(StatusCodes.OK).json({ message: 'Email verified successfully', user: updatedUser });
}
