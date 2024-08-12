import { Router } from 'express';
import { health } from '~/controllers/health';

const router: Router = Router();
export const healthRoutes = (): Router => {
  router.get('/user-health', health);
  return router;
};
