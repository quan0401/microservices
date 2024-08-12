import { IAuthDocument, winstonLogger, IAuthBuyerMessageDetails, firstLetterUppercase, lowerCase } from '@quan0401/ecommerce-shared';
import { sign } from 'jsonwebtoken';
import { omit } from 'lodash';
import { Op } from 'sequelize';
import { Model } from 'sequelize';
import { Logger } from 'winston';
import { config } from '~/config';
import { AuthModel } from '~/models/auth.schema';
import { publishDirectMessage } from '~/queues/auth.producer';
import { authChannel } from '~/server';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'autherService auth.service', 'debug');

export async function createAuthUser(data: IAuthDocument): Promise<IAuthDocument | undefined> {
  try {
    const createdAuth: Model = await AuthModel.create(data);
    const messageDetails: IAuthBuyerMessageDetails = {
      username: firstLetterUppercase(createdAuth?.dataValues.username),
      profilePicture: createdAuth?.dataValues.profilePicture,
      email: lowerCase(createdAuth?.dataValues.email),
      country: createdAuth?.dataValues.country,
      createdAt: createdAuth?.dataValues.createdAt,
      type: 'auth'
    };
    await publishDirectMessage(
      authChannel,
      'ecommerce-buyer-update',
      'user-buyer',
      JSON.stringify(messageDetails),
      'Buyer details sent to buyer service.'
    );
    const userData: IAuthDocument = omit(createdAuth.dataValues, ['password']) as IAuthDocument;
    return userData;
  } catch (error) {
    log.error(error);
  }
}

export async function getAuthUserWithEmail(email: string): Promise<IAuthDocument | undefined> {
  try {
    const result: Model<IAuthDocument> = (await AuthModel.findOne({
      where: {
        email: lowerCase(email)
      }
    })) as Model<IAuthDocument>;

    return result?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getAuthUserById(id: number): Promise<IAuthDocument | undefined> {
  try {
    const user: Model<IAuthDocument> = (await AuthModel.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ['password']
      }
    })) as Model<IAuthDocument>;
    return user?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getAuthUserByAuthToken(emailVerificationToken: string): Promise<IAuthDocument | undefined> {
  try {
    const result: Model<IAuthDocument> = (await AuthModel.findOne({
      where: {
        emailVerificationToken
      },
      attributes: {
        exclude: ['password']
      }
    })) as Model<IAuthDocument>;
    return result?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function getAuthUserByPasswordToken(passwordResetToken: string): Promise<IAuthDocument | undefined> {
  try {
    const result: Model<IAuthDocument> = (await AuthModel.findOne({
      where: {
        // passwordResetToken
        [Op.and]: [
          { passwordResetToken },
          {
            passwordResetExpires: { [Op.gt]: new Date() }
          }
        ]
      },
      attributes: {
        exclude: ['password']
      }
    })) as Model<IAuthDocument>;
    return result?.dataValues;
  } catch (error) {
    log.error(error);
  }
}

export async function updateVerifyEmailField(authId: number, emailVerified: number, emailVerificationToken?: string): Promise<void> {
  try {
    await AuthModel.update(
      !emailVerificationToken
        ? {
            emailVerified
          }
        : {
            emailVerified,
            emailVerificationToken
          },
      {
        where: {
          id: authId
        }
      }
    );
  } catch (error) {
    log.error(error);
  }
}

export async function updatePasswordToken(authId: number, passwordResetToken: string, passwordResetExpires: Date): Promise<void> {
  try {
    await AuthModel.update(
      {
        passwordResetToken,
        passwordResetExpires
      },
      {
        where: {
          id: authId
        }
      }
    );
  } catch (error) {
    log.error(error);
  }
}

export async function updatePassword(authId: number, password: string): Promise<void> {
  try {
    const result = await AuthModel.update(
      {
        password,
        passwordResetToken: '',
        passwordResetExpires: new Date()
      },
      { where: { id: authId } }
    );
  } catch (error) {
    log.error(error);
  }
}

export async function updateUserOTP(
  authId: number,
  otp: string,
  otpExpiration: Date,
  browserName: string,
  deviceType: string
): Promise<void> {
  try {
    await AuthModel.update(
      {
        otp,
        otpExpiration,
        ...(browserName.length > 0 && { browserName }),
        ...(deviceType.length > 0 && { deviceType })
      },
      {
        where: { id: authId }
      }
    );
  } catch (error) {
    log.error(error);
  }
}

export function signToken(id: number, email: string, username: string): string {
  return sign(
    {
      id,
      email,
      username
    },
    config.JWT_TOKEN!
  );
}
