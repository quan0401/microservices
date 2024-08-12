import { Router } from 'express';
import { currentUser, resendEmail } from '~/controllers/current-user';
import { refreshToken } from '~/controllers/refresh-token';

const router = Router();

export function currentUserRoutes(): Router {
  router.get('/refresh-token/:email', refreshToken);
  router.get('/currentuser', currentUser);
  router.post('/resend-email', resendEmail);

  return router;
}
