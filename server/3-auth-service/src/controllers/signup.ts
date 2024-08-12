import { StatusCodes } from 'http-status-codes';
import { UploadApiResponse } from 'cloudinary';
import { BadRequestError, firstLetterUppercase, IAuthDocument, IEmailMessageDetails, lowerCase, uploads } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { signupSchema } from '~/schemes/signup.scheme';
import { createAuthUser, getAuthUserWithEmail, signToken } from '~/services/auth.service';
import { v4 as uuidV4 } from 'uuid';
import crypto from 'crypto';
import { config } from '~/config';
import { authChannel } from '~/server';
import { publishDirectMessage } from '~/queues/auth.producer';

export async function create(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(signupSchema.validate(req.body));
  if (error?.details) throw new BadRequestError(error.details[0].message, 'SignUp create() error');
  const { username, email, password, country, profilePicture, browserName, deviceType } = req.body;
  const checkIfUserExist: IAuthDocument | undefined = await getAuthUserWithEmail(email);
  if (checkIfUserExist) throw new BadRequestError('Invalid credentials. Email or Username already exists', 'Signup create() method');
  const profilePublicId = uuidV4();
  const uploadResult: UploadApiResponse = (await uploads(
    profilePicture,
    config.CLOUD_FOLDER!,
    `${profilePublicId}`,
    true,
    true
  )) as UploadApiResponse;
  if (!uploadResult.public_id) throw new BadRequestError('File upload error', 'SignUp create() method error');
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const authData: IAuthDocument = {
    username: firstLetterUppercase(username),
    email: lowerCase(email),
    profilePublicId,
    password,
    country,
    profilePicture: uploadResult?.secure_url,
    emailVerificationToken: randomCharacters,
    browserName,
    deviceType
  } as IAuthDocument;
  const result: IAuthDocument = (await createAuthUser(authData)) as IAuthDocument;
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: result.email,
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
  const userJWT: string = signToken(result.id!, result.email!, result.username!);
  res.status(StatusCodes.CREATED).json({
    message: 'User created successfully',
    user: result,
    token: userJWT
  });
}
