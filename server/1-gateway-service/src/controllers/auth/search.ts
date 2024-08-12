import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { authService } from '~/services/api/auth.service';

export class Search {
  public async gigById(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getGig(req.params.gigId);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      gig: response.data.gig
    });
  }

  public async gigs(req: Request, res: Response): Promise<void> {
    const { from, size, type } = req.params;

    const queries = Object.entries(req.query).reduce((prev: string, currentValue, idx) => {
      const [key, value] = currentValue;
      return prev + `${idx === 0 ? '' : '&'}${key}=${value}`;
    }, '');
    const response: AxiosResponse = await authService.getGigs(from, size, type, queries);
    res.status(StatusCodes.OK).json({
      message: 'Search gigs results',
      total: response.data.total,
      gigs: response.data.gigs
    });
  }
}
