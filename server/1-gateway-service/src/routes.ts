import { Application } from 'express';
import { healthRoutes } from '~/routes/heath.routes';
import { authRoutes } from '~/routes/auth.routes';
import { currentUserRoutes } from '~/routes/current-user.routes';
import { authMiddleware } from '~/services/auth-middleware';
import { searchRoutes } from '~/routes/search.routes';
import { seedRoutes } from '~/routes/seed.routes';
import { buyerRoutes } from '~/routes/buyer.routes';
import { sellerRoutes } from '~/routes/seller.routes';
import { gigRoutes } from '~/routes/gig.routes';
import { messageRoutes } from './routes/message.routes';
import { orderRoutes } from './routes/order.routes';
import { reviewRoutes } from './routes/review.routes';

const BASE_PATH = '/api/gateway/v1';

export function appRoutes(app: Application) {
  app.use('', healthRoutes.routes());
  app.use(BASE_PATH, searchRoutes.routes());
  app.use(BASE_PATH, seedRoutes.routes());
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, buyerRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, sellerRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, gigRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, messageRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, orderRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, reviewRoutes.routes());
}
