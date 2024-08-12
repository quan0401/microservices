import { Router } from 'express';
import { gigs, singleGigById } from '~/controllers/search';

const router: Router = Router();
export function searchRoutes(): Router {
  // /auth/search/gig/0/10/forward?query=beauty&delivery_time=3&minPrice5&maxPrice20
  router.get('/search/gig/:from/:size/:type', gigs);
  router.get('/search/gig/:gigId', singleGigById);
  return router;
}
