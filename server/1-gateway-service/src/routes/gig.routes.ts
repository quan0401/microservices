import { Create } from '~/controllers/gig/create';
import { Delete } from '~/controllers/gig/delete';
import { Get } from '~/controllers/gig/get';
import { Search } from '~/controllers/gig/search';
import { GigSeed } from '~/controllers/gig/seed';
import { Update } from '~/controllers/gig/update';
import { authMiddleware } from '~/services/auth-middleware';
import express, { Router } from 'express';

class GigRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/gig/seller/pause/:sellerId', authMiddleware.checkAuthentication, Get.prototype.getSellerPausedGigs);
    this.router.get('/gig/seller/:sellerId', authMiddleware.checkAuthentication, Get.prototype.getSellerGigs);
    this.router.get('/gig/search/:from/:size/:type', authMiddleware.checkAuthentication, Search.prototype.gigs);
    this.router.get('/gig/category/:email', authMiddleware.checkAuthentication, Get.prototype.getGigsByCategory);
    this.router.get('/gig/top/:email', authMiddleware.checkAuthentication, Get.prototype.getTopRatedGigsByCategory);
    this.router.get('/gig/similar/:gigId', authMiddleware.checkAuthentication, Get.prototype.getMoreGigsLikeThis);
    this.router.get('/gig/all/:index', authMiddleware.checkAuthentication, Get.prototype.getAllFromIndex);
    this.router.get('/gig/:gigId', authMiddleware.checkAuthentication, Get.prototype.gigById);
    this.router.post('/gig/create', authMiddleware.checkAuthentication, Create.prototype.gig);
    this.router.put('/gig/active/:gigId', authMiddleware.checkAuthentication, Update.prototype.gigActive);
    this.router.put('/gig/seed/:count', authMiddleware.checkAuthentication, GigSeed.prototype.gig);
    this.router.put('/gig/:gigId', authMiddleware.checkAuthentication, Update.prototype.gig);
    this.router.delete('/gig/:gigId/:sellerId', authMiddleware.checkAuthentication, Delete.prototype.gig);
    return this.router;
  }
}

export const gigRoutes: GigRoutes = new GigRoutes();
