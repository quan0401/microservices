import { config } from '~/config';
import express, { Express } from 'express';
import { databaseConnection } from '~/database';
import { start } from '~/server';
import { redisConnect } from './redis/connection';
// import { redisConnect } from './redis/connection';
const initilize = (): void => {
  config.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
  redisConnect();
};

initilize();
