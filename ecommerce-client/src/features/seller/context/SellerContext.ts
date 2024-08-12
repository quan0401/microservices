import { ISellerContext } from '../interfaces/seller.interface';
import { Context, createContext } from 'react';
import { emptySellerData } from '~shared/utils/static-data';

export const SellerContext: Context<ISellerContext> = createContext({
  showEditIcons: false,
  sellerProfile: emptySellerData
}) as Context<ISellerContext>;
