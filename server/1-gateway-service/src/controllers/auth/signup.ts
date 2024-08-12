import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';
import { authService } from '~/services/api/auth.service';
import { Request, Response } from 'express';

export class SignUp {
  public async create(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.singUp(req.body);
    req.session = { jwt: response.data.token };
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      user: response.data.user
    });
  }
}
