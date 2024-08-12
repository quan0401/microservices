import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { authService } from '~/services/api/auth.service';
import { GatewayCache } from '~/redis/gateway.cache';
import { socketIO } from '~/server';

const gatewayCache: GatewayCache = new GatewayCache();

export class CurrentUser {
  public async currentUser(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getCurrentUser();
    res.status(StatusCodes.OK).json({ message: response.data.message, user: response.data.user });
  }
  public async resendEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.resendEmail({ userId: req.currentUser!.id, email: req.currentUser!.email });
    res.status(StatusCodes.OK).json({ message: response.data.message, user: response.data.user });
  }
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getRefreshToken(req.params.email);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      user: response.data.user,
      token: response.data.token
    });
  }
  public async getLoggedInUsers(req: Request, res: Response): Promise<void> {
    const response: string[] = await gatewayCache.getLoggedInUsersFromCache('loggedInUsers');
    socketIO.emit('online', response);
    res.status(StatusCodes.OK).json({ message: 'User is online.' });
  }
  public async removeLoggedInUser(req: Request, res: Response): Promise<void> {
    const response: string[] = await gatewayCache.removeLoggedInUserFromCache('loggedInUsers', req.params.email);
    socketIO.emit('online', response);
    res.status(StatusCodes.OK).json({ message: 'User is offline.' });
  }
}
