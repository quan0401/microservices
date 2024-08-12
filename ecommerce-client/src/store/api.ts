import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getDataFromSessionStorage } from '~shared/utils/utils.service';

const BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINT;

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_ENDPOINT}/api/gateway/v1`,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  },
  credentials: 'include'
});

const baseQueryReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error?.status === 401) {
    const loggedInEmail: string = getDataFromSessionStorage('loggedInUser');
    await baseQuery(`/auth/refresh-token/${loggedInEmail}`, api, extraOptions);
  }
  return result;
};

export const api = createApi({
  reducerPath: 'clientApi',
  baseQuery: baseQueryReAuth,
  tagTypes: ['Auth', 'CurrentUser', 'Buyer', 'Seller', 'Chat', 'Checkout', 'Gigs', 'Search', 'Review', 'Order', 'Notification'],
  endpoints: () => ({})
});
