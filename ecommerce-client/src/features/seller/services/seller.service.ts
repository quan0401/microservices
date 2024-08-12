import { IResponse } from '~shared/shared.interface';
import { api } from '~/store/api';

import { ISellerDocument } from '../interfaces/seller.interface';

export const sellerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSellerByUsername: build.query<IResponse, string>({
      query: (username: string) => `seller/username/${username}`,
      providesTags: ['Seller']
    }),
    getSellerByEmail: build.query<IResponse, string>({
      query: (email: string) => `seller/email/${email}`,
      providesTags: ['Seller']
    }),
    getSellerById: build.query<IResponse, string>({
      query: (sellerId: string) => `seller/id/${sellerId}`,
      providesTags: ['Seller']
    }),
    getRandomSellers: build.query<IResponse, string>({
      query: (size: string) => `seller/random/${size}`,
      providesTags: ['Seller']
    }),
    createSeller: build.mutation<IResponse, ISellerDocument>({
      query(body: ISellerDocument) {
        return {
          url: 'seller/create',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Seller']
    }),
    updateSeller: build.mutation<IResponse, { sellerId: string; seller: ISellerDocument }>({
      query(body) {
        return {
          url: `seller/${body.sellerId}`,
          method: 'PUT',
          body: body.seller
        };
      },
      invalidatesTags: ['Seller']
    })
  })
});

export const {
  useGetSellerByUsernameQuery,
  useGetSellerByEmailQuery,
  useGetRandomSellersQuery,
  useGetSellerByIdQuery,
  useCreateSellerMutation,
  useUpdateSellerMutation
} = sellerApi;
