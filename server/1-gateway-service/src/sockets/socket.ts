import { IMessageDocument, IOrderDocument, IOrderNotifcation, winstonLogger } from '@quan0401/ecommerce-shared';
import { Server, Socket } from 'socket.io';
import { io, Socket as SocketClient } from 'socket.io-client';
import { Logger } from 'winston';
import { config } from '~/config';
import { GatewayCache } from '~/redis/gateway.cache';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gatewaySocket', 'debug');
let chatSocketClient: SocketClient;
let orderSocketClient: SocketClient;

export class SocketIOAppHandler {
  private io: Server;
  private gatewayCache: GatewayCache;
  constructor(io: Server) {
    this.io = io;
    this.gatewayCache = new GatewayCache();
    this.chatSocketServiceIOConnections();
    this.orderSocketServiceIOConnections();
  }
  public listen(): void {
    // the reason it's here too, in case of restarting the service
    this.chatSocketServiceIOConnections();

    this.io.on('connection', async (socket: Socket) => {
      socket.on('getLoggedInUsers', async () => {
        const response: string[] = await this.gatewayCache.getLoggedInUsersFromCache('loggedInUsers');
        this.io.emit('online', response);
      });

      socket.on('loggedInUsers', async (email: string) => {
        const response: string[] = await this.gatewayCache.saveLoggedInUserToCache('loggedInUsers', email);
        this.io.emit('online', response);
      });

      socket.on('removeLoggedInUser', async (email: string) => {
        const response: string[] = await this.gatewayCache.removeLoggedInUserFromCache('loggedInUsers', email);
        this.io.emit('online', response);
      });

      socket.on('category', async (category: string, email: string) => {
        await this.gatewayCache.saveUserSelectedCategory(`selectedCategories:${email}`, category);
      });
    });
  }

  private chatSocketServiceIOConnections(): void {
    chatSocketClient = io(`${config.MESSAGE_BASE_URL}`, {
      // use websocket if not available use polling
      transports: ['websocket', 'polling'],
      secure: true
    });

    chatSocketClient.on('connect', () => {
      log.info('ChatService service socket connected');
    });

    chatSocketClient.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      log.log('error', 'ChatService Socket disconnect reason:', reason);
      chatSocketClient.connect();
    });

    chatSocketClient.on('connect_error', (error: Error) => {
      log.log('error', 'ChatService Socket connect_error:', error);
      chatSocketClient.connect();
    });

    // custom events
    chatSocketClient.on('message received', (data: IMessageDocument) => {
      // emit as socket server to the frontend
      this.io.emit('message received', data);
    });

    chatSocketClient.on('message updated', (data: IMessageDocument) => {
      // emit as socket server to the frontend
      this.io.emit('message updated', data);
    });
  }

  private orderSocketServiceIOConnections(): void {
    orderSocketClient = io(`${config.ORDER_BASE_URL}`, {
      // use websocket if not available use polling
      transports: ['websocket', 'polling'],
      secure: true
    });

    orderSocketClient.on('connect', () => {
      log.info('OrderService service socket connected');
    });

    orderSocketClient.on('disconnect', (reason: SocketClient.DisconnectReason) => {
      log.log('error', 'OrderService Socket disconnect reason:', reason);
      orderSocketClient.connect();
    });

    orderSocketClient.on('connect_error', (error: Error) => {
      log.log('error', 'OrderService Socket connect_error:', error);
      orderSocketClient.connect();
    });

    // Custom event
    orderSocketClient.on('order notification', (order: IOrderDocument, notification: IOrderNotifcation) => {
      this.io.emit('order notification', order, notification);
    });
  }
}
