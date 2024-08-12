import { config } from '~/config';
import express, { Express } from 'express';
import { databaseConnection } from '~/database';
import { start } from '~/server';

const initilize = (): void => {
  config.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initilize();
