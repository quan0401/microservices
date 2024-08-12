import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export class Health {
  public health(req: Request, res: Response): void {
    res.status(StatusCodes.OK).json('API Gateway service is health and OK roi nha.');
  }
}
