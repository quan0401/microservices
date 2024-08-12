import { Context, createContext } from 'react';
import { IGigContext } from '../interfaces/gig.interface';
import { emptyGigData, emptySellerData } from '~shared/utils/static-data';

export const GigContext: Context<IGigContext> = createContext({
  gig: emptyGigData,
  seller: emptySellerData
});
