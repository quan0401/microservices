import { Router } from 'express';
import { getByCurrentUsername, getByCurrentEmail, getByUsername, getByEmail } from '~/controllers/buyer/get';

const router: Router = Router();

export const buyerRoutes = (): Router => {
  router.get('/get/:email', getByEmail);
  router.get('/email', getByCurrentEmail);
  router.get('/username', getByCurrentUsername);
  router.get('/:username', getByUsername);
  return router;
};
