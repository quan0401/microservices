import { verify } from 'jsonwebtoken';
import { IAuthPayload, NotAuthorizedError } from '@quan0401/ecommerce-shared';
import { NextFunction, Request, Response } from 'express';
import { config } from '~/config';

class AuthMiddleware {
  public verifyUser(req: Request, res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. Please login again.', 'GatewayService verifyUser()');
    }
    try {
      const payload: IAuthPayload = verify(req.session!.jwt, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is not available. Please login again.', 'GatewayService verifyUser() catch error');
    }
    next();
  }
  public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
    if (!req?.currentUser) {
      throw new NotAuthorizedError('Authentication is required to access this route', 'GatewayService verifyUser()');
    }
    next();
  }
}
export const authMiddleware: AuthMiddleware = new AuthMiddleware();
