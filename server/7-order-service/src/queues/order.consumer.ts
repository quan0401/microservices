import { config } from '~/config';
import { winstonLogger } from '@quan0401/ecommerce-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '~/queues/connection';
import { updateOrderReview } from '~/services/order.service';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigServiceConsumer', 'debug');

export const consumeReviewFanoutMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const exchangeName = 'ecommerce-review';
    const queueName = 'order-review-queue';
    await channel.assertExchange(exchangeName, 'fanout');
    const queue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queue.queue, exchangeName, '');
    channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
      console.log('msg::::', msg && msg.content.toString());
      await updateOrderReview(JSON.parse(msg!.content.toString()));
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'OrderService consumer consumeReviewFanoutMessages() method error:', error);
  }
};
