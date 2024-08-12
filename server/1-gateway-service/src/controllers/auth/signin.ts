import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { authService } from '~/services/api/auth.service';

export class Signin {
  public async signin(req: Request, res: Response): Promise<void> {
    const response = await authService.signIn(req.body);
    req.session = { jwt: response.data.token };
    res.status(StatusCodes.CREATED).json({
      message: response.data.message,
      user: response.data.user
    });
  }
}
