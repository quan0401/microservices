import { StatusCodes } from 'http-status-codes';
import { ISellerDocument } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { getRandomSellers, getSellerByEmail, getSellerById, getSellerByUsername } from '~/services/seller.service';
import { SellerModel } from '~/models/seller.schema';

export const id = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerById(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

export const email = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerByEmail(req.params.email);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

export const username = async (req: Request, res: Response): Promise<void> => {
  const sellers: ISellerDocument[] = await getSellerByUsername(req.params.username);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', sellers });
};

export const random = async (req: Request, res: Response): Promise<void> => {
  const sellers: ISellerDocument[] = await getRandomSellers(parseInt(req.params.size, 10));
  const mySellers = await SellerModel.find({});
  const ids = [];
  // for (const seller of mySellers) {
  //   ids.push(seller._id.toString());
  // }
  // console.log('ids:::::', ids);
  // console.log('ids:::::', ids.length);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', sellers });
};

// '665fe3f6d850042ac689c541',
// '665fe3f6d850042ac689c553',
// '665fe3f6d850042ac689c562',
// '665fe3f6d850042ac689c573',
// '665fe3f6d850042ac689c581',
// '665fe3f6d850042ac689c591',
// '665fe3f6d850042ac689c5a3',
// '665fe3f6d850042ac689c5b2',
// '665fe3f6d850042ac689c5c2',
// '665fe3f6d850042ac689c5d0',
// '665fe3fad850042ac689c5e0',
// '665fe3fad850042ac689c5ef'
// '665fe3f6d850042ac689c541',
// '665fe3f6d850042ac689c553',
// '665fe3f6d850042ac689c562',
// '665fe3f6d850042ac689c573',
// '665fe3f6d850042ac689c581',
// '665fe3f6d850042ac689c591',
// '665fe3f6d850042ac689c5a3',
// '665fe3f6d850042ac689c5b2',
// '665fe3f6d850042ac689c5c2',
// '665fe3f6d850042ac689c5d0',
// '665fe3fad850042ac689c5e0',
// '665fe3fad850042ac689c5ef'
// '665fe3f6d850042ac689c541',
// '665fe3f6d850042ac689c553',
// '665fe3f6d850042ac689c562',
// '665fe3f6d850042ac689c573',
// '665fe3f6d850042ac689c581',
// '665fe3f6d850042ac689c591',
