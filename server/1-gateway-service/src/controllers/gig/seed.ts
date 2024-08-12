import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { gigService } from '~/services/api/gig.service';

export class GigSeed {
  public async gig(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.seed(req.params.count);
    res.status(StatusCodes.OK).json({
      message: response.data.message
    });
  }
}
