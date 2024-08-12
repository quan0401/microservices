import express, { Express } from 'express';
import { GatewayServer } from '~/server';
import { redisConnection } from '~/redis/redis.connection';

class App {
  public initialize(): void {
    const app: Express = express();
    const server: GatewayServer = new GatewayServer(app);
    server.start();
    redisConnection.redisConnect();
  }
}
const app: App = new App();
app.initialize();
