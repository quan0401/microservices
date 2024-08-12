import { IBuyerDocument, ISellerDocument, winstonLogger } from '@quan0401/ecommerce-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { config } from '~/config';
import { createConnection } from './connections';
import { createBuyer, updateBuyerPurchasesGigsProp } from '~/services/buyer.service';
import {
  getRandomSellers,
  updateSellerCancelledJobsProp,
  updateSellerCompletedJobsProps,
  updateSellerOngoingJobsProp,
  updateSellerReview,
  updateTotalGigsCount
} from '~/services/seller.service';
import { publishDirectMessage } from './user.producer';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'userServiceConsumer', 'debug');

export const consumeBuyerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'ecommerce-buyer-update';
    const routingKey = 'user-buyer';
    const queueName = 'user-buyer-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const ecommerceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(ecommerceQueue.queue, exchangeName, routingKey);
    channel.consume(ecommerceQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'auth') {
        const { username, email, profilePicture, country, createdAt } = JSON.parse(msg!.content.toString());
        const buyer: IBuyerDocument = {
          username,
          email,
          profilePicture,
          country,
          purchasedGigs: [],
          createdAt
        };
        await createBuyer(buyer);
      } else {
        const { buyerId, purchasedGigs } = JSON.parse(msg!.content.toString());
        await updateBuyerPurchasesGigsProp(buyerId, purchasedGigs, type);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UserService UserConsumer consumeBuyerDirectMessage()');
  }
};

export const consumeSellerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'ecommerce-seller-update';
    const routingKey = 'user-seller';
    const queueName = 'user-seller-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const ecommerceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(ecommerceQueue.queue, exchangeName, routingKey);
    channel.consume(ecommerceQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type, sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery, gigSellerId, count } = JSON.parse(
        msg!.content.toString()
      );
      if (type === 'create-order') {
        await updateSellerOngoingJobsProp(sellerId, ongoingJobs);
      } else if (type === 'approve-order') {
        await updateSellerCompletedJobsProps({
          sellerId,
          ongoingJobs,
          completedJobs,
          totalEarnings,
          recentDelivery
        });
      } else if (type === 'update-gig-count') {
        await updateTotalGigsCount(gigSellerId, count);
      } else if (type === 'cancel-order') {
        await updateSellerCancelledJobsProp(sellerId);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UserService UserConsumer consumeSellerDirectMessage()');
  }
};

export const consumeReviewFanoutMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'ecommerce-review';
    const queueName = 'seller-review-queue';
    await channel.assertExchange(exchangeName, 'fanout');
    const ecommerceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(ecommerceQueue.queue, exchangeName, '');
    channel.consume(ecommerceQueue.queue, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'buyer-review') {
        await updateSellerReview(JSON.parse(msg!.content.toString()));
        await publishDirectMessage(
          channel,
          'ecommerce-update-gig',
          'update-gig',
          JSON.stringify({ type: 'updateGig', gigReview: msg!.content.toString() }),
          'Message sent to gig service.'
        );
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UsersService UserConsumer consumeReviewFanoutMessages() method error:', error);
  }
};

export const consumeSeedGigDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'ecommerce-gig';
    const routingKey = 'get-sellers';
    const queueName = 'user-gig-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const ecommerceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(ecommerceQueue.queue, exchangeName, routingKey);
    channel.consume(queueName, async (msg: ConsumeMessage | null) => {
      const { type } = JSON.parse(msg!.content.toString());
      if (type === 'getSellers') {
        const { count } = JSON.parse(msg!.content.toString());
        const sellers: ISellerDocument[] = await getRandomSellers(parseInt(count, 10));
        await publishDirectMessage(
          channel,
          'ecommerce-seed-gig',
          'receive-sellers',
          JSON.stringify({ type: 'receiveSellers', sellers, count }),
          'Message sent to gig service'
        );
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'UserService UserConsumer consumeSellerDirectMessage()');
  }
};
