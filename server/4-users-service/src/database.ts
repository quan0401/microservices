import { winstonLogger } from '@quan0401/ecommerce-shared';
import { config } from '~/config';
import { Logger } from 'winston';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'userDatabaseServer', 'debug');

export const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(config.DATABASE_URL!);
    log.info('User service successfully connected to database mongodb.');
  } catch (error) {
    log.log('error', 'UserService databaseConnection error', error);
  }
};
