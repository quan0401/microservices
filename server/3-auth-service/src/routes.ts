import { StatusCodes } from 'http-status-codes';
import { Application } from 'express';
import { authRoutes } from '~/routes/auth.routes';
import { verifyGatewayRequest } from '@quan0401/ecommerce-shared';
import { currentUserRoutes } from '~/routes/user.routes';
import { searchRoutes } from '~/routes/search.routes';
import { seedRoutes } from '~/routes/seed.routes';

const BASE_PATH = '/api/v1/auth';

export function appRoutes(app: Application): void {
  app.get('/auth-health', (req, res) => {
    res.status(StatusCodes.OK).send('Auth service is healthy and OK.');
  });
  app.use(BASE_PATH, verifyGatewayRequest, searchRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, seedRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
}
