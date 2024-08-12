import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { gigService } from '~/services/api/gig.service';
import { AxiosResponse } from 'axios';

export class Search {
  public async gigs(req: Request, res: Response): Promise<void> {
    const { from, size, type } = req.params;

    const queries = Object.entries(req.query).reduce((prev: string, currentValue, idx) => {
      const [key, value] = currentValue;
      return prev + `${idx === 0 ? '' : '&'}${key}=${value}`;
    }, '');
    const response: AxiosResponse = await gigService.searchGigs(queries, from, size, type);

    res.status(StatusCodes.OK).json({
      message: 'Search gigs results',
      total: response.data.total,
      gigs: response.data.gigs,
      sort: response.data.sort
    });
  }
}
