import { verifyGatewayRequest } from '@quan0401/ecommerce-shared';
import { Application } from 'express';
import { healthRoutes } from '~/routes/health.routes';
import { reviewRoutes } from './routes/review.routes';

const BASE_PATH = '/api/v1/review';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, reviewRoutes());
};

export { appRoutes };
