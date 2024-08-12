import { winstonLogger } from '@quan0401/ecommerce-shared';
import { createClient, RedisClientType } from 'redis';
import { Logger } from 'winston';
import { config } from '~/config';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL as string, 'orderRedisConnection', 'debug');

export const client: RedisClientType = createClient({ url: config.REDIS_HOST! });

export const redisConnect = async (): Promise<void> => {
  try {
    await client.connect();
    log.info(`OrderService Redis Connection: ${await client.ping()}`);
    cacheError();
  } catch (error) {}
};

const cacheError = () => {
  client.on('error', (error: unknown) => {
    log.error(error);
  });
};
