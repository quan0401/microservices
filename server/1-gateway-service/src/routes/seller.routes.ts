import { Create } from '~/controllers/user/seller/create';
import { Get } from '~/controllers/user/seller/get';
import { SellerSeed } from '~/controllers/user/seller/seed';
import { Update } from '~/controllers/user/seller/update';
import { authMiddleware } from '~/services/auth-middleware';
import express, { Router } from 'express';

class SellerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/seller/id/:sellerId', authMiddleware.checkAuthentication, Get.prototype.id);
    this.router.get('/seller/email/:email', authMiddleware.checkAuthentication, Get.prototype.email);
    this.router.get('/seller/username/:username', authMiddleware.checkAuthentication, Get.prototype.username);
    this.router.get('/seller/random/:size', authMiddleware.checkAuthentication, Get.prototype.random);
    this.router.post('/seller/create', authMiddleware.checkAuthentication, Create.prototype.seller);
    this.router.put('/seller/:sellerId', authMiddleware.checkAuthentication, Update.prototype.seller);
    this.router.put('/seller/seed/:count', authMiddleware.checkAuthentication, SellerSeed.prototype.seller);

    return this.router;
  }
}

export const sellerRoutes: SellerRoutes = new SellerRoutes();
