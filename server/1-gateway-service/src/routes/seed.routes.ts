import { Router } from 'express';
import { Seeds } from '~/controllers/auth/seeds';

class SeedRoutes {
  private router: Router;
  constructor() {
    this.router = Router();
  }
  public routes(): Router {
    this.router.put('/auth/seed/:count', Seeds.prototype.seeds);
    return this.router;
  }
}
export const seedRoutes: SeedRoutes = new SeedRoutes();
