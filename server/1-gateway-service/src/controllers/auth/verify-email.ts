import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { authService } from '~/services/api/auth.service';

export class VerifyEmail {
  public async verifyEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.verifyEmail(req.body?.token);
    res.status(StatusCodes.OK).json({ message: response.data.message, user: response.data.user });
  }
}
