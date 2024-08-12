import { sequelize } from '~/database';
import { DataTypes, Optional, ModelDefined, CreateOptions, Model } from 'sequelize';
import { IAuthDocument } from '@quan0401/ecommerce-shared';
import { compare, hash } from 'bcryptjs';

const SALT_ROUND = 10;
interface AuthModelInstanceMethods extends Model {
  prototype: {
    comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
    hashPassword: (password: string) => Promise<string>;
  };
}
type AuthCreationAttributes = Optional<IAuthDocument, 'id' | 'createdAt' | 'password' | 'passwordResetToken' | 'passwordResetExpires'>;

export const AuthModel: ModelDefined<IAuthDocument, AuthCreationAttributes> & AuthModelInstanceMethods = sequelize.define(
  'auths',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePublicId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    browserName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deviceType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING
    },
    otpExpiration: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['username']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['emailVerificationToken']
      }
    ]
  }
) as ModelDefined<IAuthDocument, AuthCreationAttributes> & AuthModelInstanceMethods;

AuthModel.addHook('beforeCreate', async (auth: Model, options: CreateOptions) => {
  const hashedPassword = await hash(auth.dataValues.password, SALT_ROUND);
  auth.dataValues.password = hashedPassword;
});

AuthModel.prototype.comparePassword = async function (password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
};

AuthModel.prototype.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};
// force: true will delete every thing inside the data when connects
// AuthModel.sync({ force: true });
AuthModel.sync({});
