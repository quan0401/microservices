import { verifyGatewayRequest } from '@quan0401/ecommerce-shared';
import { Application } from 'express';
import { healthRoutes } from '~/routes/health.routes';
import { orderRoutes } from '~/routes/order.routes';

const BASE_PATH = '/api/v1/order';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, orderRoutes());
};

export { appRoutes };
