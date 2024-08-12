import { Router } from 'express';
import { Search } from '~/controllers/auth/search';

class SearchRoutes {
  private router: Router;
  constructor() {
    this.router = Router();
  }
  public routes(): Router {
    this.router.get('/auth/search/gig/:from/:size/:type', Search.prototype.gigs);
    this.router.get('/auth/search/gig/:gigId', Search.prototype.gigById);
    return this.router;
  }
}
export const searchRoutes: SearchRoutes = new SearchRoutes();
