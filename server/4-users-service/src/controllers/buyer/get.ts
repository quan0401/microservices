import { StatusCodes } from 'http-status-codes';
import { IBuyerDocument } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { getBuyerByEmail, getBuyerByUsername } from '~/services/buyer.service';

export const getByCurrentEmail = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByEmail(req.currentUser!.email);
  res.status(StatusCodes.OK).json({
    message: 'Buyer profile',
    buyer
  });
};

export const getByCurrentUsername = async (req: Request, res: Response): Promise<void> => {
  const buyers: IBuyerDocument[] = await getBuyerByUsername(req.currentUser!.username);
  res.status(StatusCodes.OK).json({
    message: 'Buyer profile',
    buyers
  });
};

export const getByUsername = async (req: Request, res: Response): Promise<void> => {
  const buyers: IBuyerDocument[] = await getBuyerByUsername(req.params.username);
  res.status(StatusCodes.OK).json({
    message: 'Buyer profile',
    buyers
  });
};

export const getByEmail = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByEmail(`${req.params.email}`);
  res.status(StatusCodes.OK).json({
    message: 'Buyer profile',
    buyer
  });
};
