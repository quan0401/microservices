import { Router } from 'express';
import { Health } from '~/controllers/health';

class HealthRoutes {
  private router: Router;
  constructor() {
    this.router = Router();
  }
  public routes(): Router {
    this.router.get('/gateway-health', Health.prototype.health);
    return this.router;
  }
}
export const healthRoutes: HealthRoutes = new HealthRoutes();
