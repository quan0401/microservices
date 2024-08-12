import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { generateFromEmail } from 'unique-username-generator';
import { BadRequestError, firstLetterUppercase, IAuthDocument, lowerCase } from '@quan0401/ecommerce-shared';
import { createAuthUser, getAuthUserWithEmail } from '~/services/auth.service';
import { v4 as uuidV4 } from 'uuid';
import crypto from 'crypto';
import { sample } from 'lodash';

export async function seeds(req: Request, res: Response): Promise<void> {
  for (let i = 0; i < parseInt(req.params.count); i++) {
    const randomEmail = faker.internet.email();
    // add three random digits
    const username = generateFromEmail(randomEmail, 0);
    const password = 'quan0401';
    const country = faker.location.country();
    const profilePicture = faker.image.avatar();
    const browserName = 'Chrome';
    const deviceType = 'Desktop';
    const checkIfUserExist: IAuthDocument | undefined = await getAuthUserWithEmail(randomEmail);
    if (checkIfUserExist) throw new BadRequestError('Invalid credentials. Email or Username', 'Signup create() method');
    const profilePublicId = uuidV4();
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    const authData: IAuthDocument = {
      username: firstLetterUppercase(username),
      email: lowerCase(randomEmail),
      profilePublicId,
      password,
      country,
      profilePicture,
      emailVerificationToken: randomCharacters,
      emailVerified: sample([0, 1]),
      browserName,
      deviceType
    } as IAuthDocument;
    const result: IAuthDocument = (await createAuthUser(authData)) as IAuthDocument;
  }
  res.status(StatusCodes.OK).json({ message: 'Seed users created successfully.' });
}
