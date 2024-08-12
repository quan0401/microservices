import { verifyGatewayRequest } from '@quan0401/ecommerce-shared';
import { Application } from 'express';
import { healthRoutes } from '~/routes/health.routes';
import { messageRoutes } from '~/routes/message.routes';

const BASE_PATH = '/api/v1/message';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, messageRoutes());
};

export { appRoutes };
