import express, { Application } from 'express';
import { start } from '~/server';
import { databaseConnection } from './database';
import { config } from '~/config';

function initialize(): void {
  const app: Application = express();
  config.cloudinaryConfig();
  databaseConnection();
  start(app);
}
initialize();
