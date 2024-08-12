import { Context, createContext } from 'react';
import { IAuthUser } from '~features/auth/interfaces/auth.interface';

import { IOrderContext, IOrderDocument, IOrderInvoice } from '~features/order/interfaces/order.interface';

export const OrderContext: Context<IOrderContext> = createContext({
  order: {} as IOrderDocument,
  authUser: {} as IAuthUser,
  orderInvoice: {} as IOrderInvoice
}) as Context<IOrderContext>;
