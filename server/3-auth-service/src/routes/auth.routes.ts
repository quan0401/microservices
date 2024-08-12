import { Router } from 'express';
import { changePassword, forgotPassword, resetPassword } from '~/controllers/password';
import { signin } from '~/controllers/signin';
import { create } from '~/controllers/signup';
import { verifyEmail } from '~/controllers/verify-email';

const router = Router();

export function authRoutes(): Router {
  router.post('/signup', create);
  router.post('/signin', signin);
  router.put('/verify-email', verifyEmail);
  router.put('/forgot-password', forgotPassword);
  router.put('/reset-password/:token', resetPassword);
  router.put('/change-password', changePassword);
  return router;
}
