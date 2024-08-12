import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { buyerService } from '~/services/api/buyer.service';

export class GetBuyer {
  public async currentEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getCurrentBuyerByEmail();
    res.status(StatusCodes.OK).json({
      message: response.data.message,
      buyer: response.data.buyer
    });
  }

  public async currentUsername(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getCurrentBuyerByUsername();
    res.status(StatusCodes.OK).json({ message: response.data.message, buyers: response.data.buyers });
  }

  public async username(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getBuyerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: response.data.message, buyers: response.data.buyers });
  }

  public async email(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await buyerService.getBuyerByEmail(req.params.email);
    res.status(StatusCodes.OK).json({ message: response.data.message, buyer: response.data.buyer });
  }
}
