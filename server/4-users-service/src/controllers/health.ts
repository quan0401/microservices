import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const health = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('Users service is healthy and OK.');
};
