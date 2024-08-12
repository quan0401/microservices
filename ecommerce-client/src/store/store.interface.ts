import { INotification } from 'src/shared/header/interfaces/header.interface';

import { IAuthUser } from '~/features/auth/interfaces/auth.interface';
import { IBuyerDocument } from '~features/buyer/interfaces/buyer.interface';
import { ISellerDocument } from '~features/seller/interfaces/seller.interface';
export interface IReduxState {
  authUser: IAuthUser;
  header: string;
  logout: boolean;
  buyer: IBuyerDocument;
  seller: ISellerDocument;
  showCategoryContainer: boolean;
  notification: INotification;
}
