import { Router } from 'express';
import { GetBuyer } from '~/controllers/user/buyer/get';
import { authMiddleware } from '~/services/auth-middleware';

class BuyerRoutes {
  private router: Router;
  constructor() {
    this.router = Router();
  }
  public routes(): Router {
    this.router.get('/buyer/get/:email', authMiddleware.checkAuthentication, GetBuyer.prototype.email);
    this.router.get('/buyer/email', authMiddleware.checkAuthentication, GetBuyer.prototype.currentEmail);
    this.router.get('/buyer/username', authMiddleware.checkAuthentication, GetBuyer.prototype.currentUsername);
    this.router.get('/buyer/:username', authMiddleware.checkAuthentication, GetBuyer.prototype.username);
    return this.router;
  }
}
export const buyerRoutes: BuyerRoutes = new BuyerRoutes();
