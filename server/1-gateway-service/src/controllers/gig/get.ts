import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { gigService } from '~/services/api/gig.service';

export class Get {
  public async gigById(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getGigById(req.params.gigId);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      gig: response.data.gig
    });
  }

  public async getSellerGigs(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getSellerGigs(req.params.sellerId);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      gigs: response.data.gigs
    });
  }

  public async getSellerPausedGigs(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getSellerPausedGigs(req.params.sellerId);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      gigs: response.data.gigs
    });
  }

  public async getGigsByCategory(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getGigsByCategory(req.params.email);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      gigs: response.data.gigs,
      total: response.data.total
    });
  }
  public async getMoreGigsLikeThis(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getMoreGigsLikeThis(req.params.gigId);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      gigs: response.data.gigs,
      total: response.data.total
    });
  }
  public async getTopRatedGigsByCategory(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getTopRatedGigsByCategory(req.params.email);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      gigs: response.data.gigs,
      total: response.data.total
    });
  }

  public async getAllFromIndex(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.getAllRecordsOfIndex(req.params.index);
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      gigs: response.data.gigs,
      total: response.data.total
    });
  }
}
