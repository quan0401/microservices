import 'express-async-errors';
import { winstonLogger } from '@quan0401/ecommerce-shared';
import { config } from '~/config';
import http from 'http';
import { Application } from 'express';
import { Logger } from 'winston';
import { healthRoutes } from '~/routes';
import { checkConnection } from '~/elasticsearch';
import { createConnection } from '~/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '~/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationserver', 'debug');

export async function start(app: Application): Promise<void> {
  startServer(app);
  // http://localhost:4001/api/v1/gateway/notification-routes
  app.use('', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);

  // await consumeAuthEmailMessages(emailChannel);
  // await emailChannel.assertExchange('ecommerce-email-notification', 'direct');
  // const verifyLink = `${config.CLIENT_URL}/confirm_email?v_token=12k34jjjlwkfjklsd`;
  // const messgaeDetails: IEmailMessageDetails = {
  //   receiverEmail: config.SENDER_EMAIL,
  //   template: 'verifyEmail',
  //   verifyLink
  // };
  // const message = JSON.stringify(messgaeDetails);
  // // const message = JSON.stringify({ name: 'ecommerce', service: 'auth notification service' });
  // emailChannel.publish('ecommerce-email-notification', 'auth-email', Buffer.from(message));

  // order
}

async function startElasticSearch(): Promise<void> {
  checkConnection();
}
async function startServer(app: Application): Promise<void> {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'notificationserver startServer() method:', error);
  }
}
