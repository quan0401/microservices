import { Router } from 'express';
import { seeds } from '~/controllers/seeds';
const seedRouter: Router = Router();

export function seedRoutes(): Router {
  seedRouter.put('/seed/:count', seeds);
  return seedRouter;
}
