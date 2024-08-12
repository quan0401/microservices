import { review } from '~/controllers/create';
import { reviewsByGigId, reviewsBySellerId } from '~/controllers/get';
import express, { Router } from 'express';

const router: Router = express.Router();

const reviewRoutes = (): Router => {
  router.get('/gig/:gigId', reviewsByGigId);
  router.get('/seller/:sellerId', reviewsBySellerId);
  router.post('/', review);

  return router;
};

export { reviewRoutes };
