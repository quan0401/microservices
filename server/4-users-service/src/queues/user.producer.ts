import { winstonLogger } from '@quan0401/ecommerce-shared';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { config } from '~/config';
import { createConnection } from '~/queues/connections';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'userServiceProducer', 'debug');

export const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'UserService publishDirectMessage method', error);
  }
};
