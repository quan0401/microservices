import { Router } from 'express';
import { createSeller } from '~/controllers/seller/create';
import { email, id, random, username } from '~/controllers/seller/get';
import { seedSellers } from '~/controllers/seller/seed';
import { seller } from '~/controllers/seller/update';

const router: Router = Router();

export const sellerRoutes = (): Router => {
  router.get('/id/:sellerId', id);
  router.get('/email/:email', email);
  router.get('/username/:username', username);
  router.get('/random/:size', random);
  router.post('/create', createSeller);
  router.put('/:sellerId', seller);
  router.put('/seed/:count', seedSellers);

  return router;
};
