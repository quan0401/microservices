import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { authService } from '~/services/api/auth.service';

export class Seeds {
  public async seeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.seed(parseInt(req.params.count));
    res.status(StatusCodes.CREATED).json({
      message: response.data.message
    });
  }
}
