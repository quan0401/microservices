import { winstonLogger } from '@quan0401/ecommerce-shared';
import { Logger } from 'winston';
import { config } from './config';
import { Pool } from 'pg';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'reviewDatabaseServer', 'debug');

export const pool: Pool = new Pool({
  user: `${config.DATABASE_USER}`,
  password: `${config.DATABASE_PASSWORD}`,
  host: `${config.DATABASE_HOST}`,
  port: 5432,
  database: `${config.DATABASE_NAME}`
});

pool.on('error', (error: Error) => {
  log.log('error', 'pg client error', error);
  process.exit(-1);
});

const createTableText = `
  CREATE TABLE IF NOT EXISTS public.reviews (
    "id" SERIAL UNIQUE,
    "gigId" text NOT NULL,
    "reviewerId" text NOT NULL,
    "orderId" text NOT NULL,
    "sellerId" text NOT NULL,
    "review" text NOT NULL,
    "reviewerImage" text NOT NULL,
    "reviewerUsername" text NOT NULL,
    "reviewerEmail" text NOT NULL,
    "country" text NOT NULL,
    "reviewType" text NOT NULL,
    "rating" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
  );

  CREATE INDEX IF NOT EXISTS "gigId_idx" ON public.reviews ("gigId");

  CREATE INDEX IF NOT EXISTS "sellerId_idx" ON public.reviews ("sellerId");
`;

export const databaseConnection = async (): Promise<void> => {
  try {
    await pool.connect();
    log.info('Review service successfully connected to postgresql database.');
    await pool.query(createTableText);
  } catch (error) {
    log.error('ReviewService - Unable to connect to database.');
    log.log('error', 'Reviewservice () method error', error);
  }
};
