import { winstonLogger } from '@quan0401/ecommerce-shared';
import { createClient, RedisClientType } from 'redis';
import { Logger } from 'winston';
import { config } from '~/config';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL as string, 'gatewayRedisConnection', 'debug');

class RedisConnection {
  client: RedisClientType;
  constructor() {
    this.client = createClient({ url: config.REDIS_HOST! });
  }
  public async redisConnect(): Promise<void> {
    try {
      await this.client.connect();
      log.info(`GatewayService Redis Connection: ${await this.client.ping()}`);
      this.cacheError();
    } catch (error) {
      log.log('error', 'GatewayService redisConnection() method error: ', error);
    }
  }
  private async cacheError() {
    this.client.on('error', (error: unknown) => {
      log.error(error);
    });
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
