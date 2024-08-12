import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

export const health = async (req: Request, res: Response): Promise<void> => {
  res.status(StatusCodes.OK).json({
    message: 'Gig serivce is healthy and ok'
  });
};
