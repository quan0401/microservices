import { Router } from 'express';
import { gigCreate } from '~/controllers/create';
import { deleteGig } from '~/controllers/delete';
import {
  byGigId,
  getAllFromIndex,
  gigsByCategory,
  moreGigsLikeThis,
  sellerGigs,
  sellerInactiveGigs,
  topRatedGigsByCategory
} from '~/controllers/get';
import { gigs } from '~/controllers/search';
import { gig } from '~/controllers/seed';
import { gigUpdate, gigUpdateActive } from '~/controllers/update';

const router: Router = Router();

export const gigRoutes = (): Router => {
  router.get('/seller/pause/:sellerId', sellerInactiveGigs);
  router.get('/search/:from/:size/:type', gigs);
  router.get('/category/:email', gigsByCategory);
  router.get('/top/:email', topRatedGigsByCategory);
  router.get('/seller/:sellerId', sellerGigs);
  router.get('/similar/:gigId', moreGigsLikeThis);
  router.get('/all/:index', getAllFromIndex);
  router.get('/:gigId', byGigId);
  router.post('/create', gigCreate);
  router.put('/:gigId', gigUpdate);
  router.put('/active/:gigId', gigUpdateActive);
  router.put('/seed/:count', gig);
  router.delete('/:gigId/:sellerId', deleteGig);

  return router;
};
