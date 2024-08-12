import { Router } from 'express';
import { Password } from '~/controllers/auth/password';
import { Signin } from '~/controllers/auth/signin';
import { Signout } from '~/controllers/auth/signout';
import { SignUp } from '~/controllers/auth/signup';
import { VerifyEmail } from '~/controllers/auth/verify-email';

class AuthRoutes {
  private router: Router;
  constructor() {
    this.router = Router();
  }
  public routes(): Router {
    this.router.post('/auth/signup', SignUp.prototype.create);
    this.router.post('/auth/signin', Signin.prototype.signin);
    this.router.post('/auth/signout', Signout.prototype.update);
    this.router.put('/auth/verify-email', VerifyEmail.prototype.verifyEmail);
    this.router.put('/auth/forgot-password', Password.prototype.forgotPassword);
    this.router.put('/auth/reset-password/:token', Password.prototype.resetPassword);
    this.router.put('/auth/change-password', Password.prototype.changePassword);
    return this.router;
  }
}
export const authRoutes: AuthRoutes = new AuthRoutes();
