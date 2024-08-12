import { config } from '~/config';
import { winstonLogger } from '@quan0401/ecommerce-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '~/queues/connection';
import { seedData, updateGigReview } from '~/services/gig.service';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigServiceConsumer', 'debug');

const consumeGigDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'ecommerce-update-gig';
    const routingKey = 'update-gig';
    const queueName = 'gig-update-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const ecommerceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(ecommerceQueue.queue, exchangeName, routingKey);
    channel.consume(ecommerceQueue.queue, async (msg: ConsumeMessage | null) => {
      const { gigReview } = JSON.parse(msg!.content.toString());
      await updateGigReview(JSON.parse(gigReview));
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'GigService GigConsumer consumeGigDirectMessage() method error:', error);
  }
};

const consumeSeedDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'ecommerce-seed-gig';
    const routingKey = 'receive-sellers';
    const queueName = 'seed-gig-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const ecommerceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(ecommerceQueue.queue, exchangeName, routingKey);
    channel.consume(ecommerceQueue.queue, async (msg: ConsumeMessage | null) => {
      const { sellers, count } = JSON.parse(msg!.content.toString());
      await seedData(sellers, count);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'GigService GigConsumer consumeGigDirectMessage() method error:', error);
  }
};

export { consumeGigDirectMessage, consumeSeedDirectMessages };
