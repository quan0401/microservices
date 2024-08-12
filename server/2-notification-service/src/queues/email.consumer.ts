import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { createConnection } from '~/queues/connection';
import { IEmailLocals, winstonLogger } from '@quan0401/ecommerce-shared';
import { config } from '~/config';
import { Logger } from 'winston';
import { sendEmail } from '~/queues/mail.transport';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'emailConsumer', 'debug');

export async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) channel = (await createConnection()) as Channel;
    const exchangeName = 'ecommerce-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';

    await channel.assertExchange(exchangeName, 'direct');
    // When the queue restarts we want message to persist
    const ecommerceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(ecommerceQueue.queue, exchangeName, routingKey);

    channel.consume(ecommerceQueue.queue, async (msg: ConsumeMessage | null) => {
      const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: config.CLIENT_URL!,
        appIcon: 'https://i.ibb.co/L57LdBh/307677943-1760954530904411-5112151190211783392-n.jpg',
        username,
        verifyLink,
        resetLink
      };
      // send email
      await sendEmail(template, receiverEmail, locals);
      // acknowledge
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'notificationservice EmailConsumer consumeAuthEmailMessages() method erorr:', error);
  }
}

export async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) channel = (await createConnection()) as Channel;
    const exchangeName = 'ecommerce-order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';

    await channel.assertExchange(exchangeName, 'direct');
    // When the queue restarts we want message to persist
    const ecommerceQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(ecommerceQueue.queue, exchangeName, routingKey);
    channel.consume(ecommerceQueue.queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        buyerEmail,
        sellerEmail,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      } = JSON.parse(msg!.content.toString());

      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        buyerEmail,
        sellerEmail,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      };
      if (template === 'orderPlaced') {
        await sendEmail('orderPlaced', receiverEmail, locals);
        await sendEmail('orderReceipt', receiverEmail, locals);
      } else await sendEmail(template, receiverEmail, locals);

      // acknowledge
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'notificationservice EmailConsumer consumeOrderEmailMessages() method erorr:', error);
  }
}
