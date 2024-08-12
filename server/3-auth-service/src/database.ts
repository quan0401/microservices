import { winstonLogger } from '@quan0401/ecommerce-shared';
import { Sequelize } from 'sequelize';
import { Logger } from 'winston';
import { config } from '~/config';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'authServiceDatabase', 'debug');

export const sequelize = new Sequelize(config.MYSQL_DB!, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true
  }
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    log.info('Mysql database connected successfully.');
  } catch (error) {
    log.error('Auth Service - Unable to connect to database');
    log.log('error', 'AuthService databaseConnection() error', error);
  }
}
