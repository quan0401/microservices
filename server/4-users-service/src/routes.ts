import { verifyGatewayRequest } from '@quan0401/ecommerce-shared';
import { Application } from 'express';
import { healthRoutes } from '~/routes/health.routes';
import { buyerRoutes } from '~/routes/buyer.routes';
import { sellerRoutes } from '~/routes/seller.routes';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BUYER_BASE_PATH, verifyGatewayRequest, buyerRoutes());
  app.use(SELLER_BASE_PATH, verifyGatewayRequest, sellerRoutes());
};
