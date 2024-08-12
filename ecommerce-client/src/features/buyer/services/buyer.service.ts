import { IResponse } from '~/shared/shared.interface';
import { api } from '~/store/api';

export const buyerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCurrentBuyerByUsername: build.query<IResponse, void>({
      query: () => 'buyer/username',
      providesTags: ['Buyer']
    }),
    getBuyerByUsername: build.query<IResponse, string>({
      query: (username: string) => `buyer/${username}`,
      providesTags: ['Buyer']
    }),
    getBuyerByEmail: build.query<IResponse, string>({
      query: (email: string) => `buyer/get/${email}`,
      providesTags: ['Buyer']
    }),
    getCurrentBuyerByEmail: build.query<IResponse, void>({
      query: () => 'buyer/email',
      providesTags: ['Buyer']
    })
  })
});

export const { useGetCurrentBuyerByUsernameQuery, useGetBuyerByUsernameQuery, useGetCurrentBuyerByEmailQuery, useGetBuyerByEmailQuery } =
  buyerApi;
