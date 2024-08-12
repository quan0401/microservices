import { winstonLogger } from '@quan0401/ecommerce-shared';
import amqplib, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';
import { config } from '~/config';
const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'chatServiceQueueConnection', 'debug');

export async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await amqplib.connect(config.RABBITMQ_ENDPOINT!);
    const channel: Channel = await connection.createChannel();
    log.info('Chater server connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.error('Connection to amqplib failed. Try again...');
    log.log('error', 'chatServiceQueueConnection createConnection() error.', error);
  }
  return undefined;
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await connection.close();
    await channel.close();
  });
}
