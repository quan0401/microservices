import * as connection from '~/queues/connection';

import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '~/queues/email.consumer';
import amqp from 'amqplib';

jest.mock('amqplib');
jest.mock('@quan0401/ecommerce-shared');
jest.mock('~/queues/connection');

describe('email.consumer.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages', () => {
    it('Should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
        ack: jest.fn()
      };
      const exchangeName = 'ecommerce-email-notification';
      const routingKey = 'auth-email';
      const queueName = 'auth-email-queue';

      jest.spyOn(channel, 'assertExchange');
      const spy: jest.SpyInstance = jest.spyOn(channel, 'assertQueue').mockResolvedValue({
        queue: queueName,
        messageCount: 0,
        consumerCount: 0
      });
      jest.spyOn(channel, 'bindQueue');
      // Call main func
      await consumeAuthEmailMessages(channel as unknown as Channel);
      expect(channel.assertExchange).toHaveBeenCalledWith(exchangeName, 'direct');
      expect(channel.assertQueue).toHaveBeenCalledWith(queueName, { durable: true, autoDelete: false });
      expect(channel.bindQueue).toHaveBeenCalledWith(queueName, exchangeName, routingKey);
      expect(channel.consume).toHaveBeenCalledTimes(1);
    });
  });

  describe('consumeOrderEmailMessages', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn()
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'order-email-queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await consumeOrderEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('ecommerce-order-notification', 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('order-email-queue', 'ecommerce-order-notification', 'order-email');
    });
  });
});
