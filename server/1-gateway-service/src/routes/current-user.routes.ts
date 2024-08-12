import { Router } from 'express';
import { CurrentUser } from '~/controllers/auth/current-user';
import { authMiddleware } from '~/services/auth-middleware';

class CurrentUserRoutes {
  private router: Router;
  constructor() {
    this.router = Router();
  }
  public routes(): Router {
    this.router.get('/auth/refresh-token/:email', authMiddleware.checkAuthentication, CurrentUser.prototype.refreshToken);
    this.router.get('/auth/logged-in-user', authMiddleware.checkAuthentication, CurrentUser.prototype.getLoggedInUsers);
    this.router.get('/auth/currentUser', authMiddleware.checkAuthentication, CurrentUser.prototype.currentUser);
    this.router.post('/auth/resend-email', authMiddleware.checkAuthentication, CurrentUser.prototype.resendEmail);
    this.router.delete('/auth/logged-in-user/:email', authMiddleware.checkAuthentication, CurrentUser.prototype.removeLoggedInUser);
    return this.router;
  }
}
export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
