import { verifyGatewayRequest } from '@quan0401/ecommerce-shared';
import { Application } from 'express';
import { gigRoutes } from '~/routes/gig.routes';
import { healthRoutes } from '~/routes/health.routes';

const BASE_PATH = '/api/v1/gig';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, gigRoutes());
};

export { appRoutes };
