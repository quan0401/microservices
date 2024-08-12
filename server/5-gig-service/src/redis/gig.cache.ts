import { Logger } from 'winston';
import { client } from './connection';
import { winstonLogger } from '@quan0401/ecommerce-shared';
import { config } from '~/config';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'gigCache', 'debug');
export const getUserSelectedGigCategory = async (key: string): Promise<string> => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    const response: string = (await client.GET(key)) as string;
    return response;
  } catch (error) {
    log.log('error', 'GigService GigCache getUserSelectedGigCategory() method error:', error);
    return '';
  }
};
