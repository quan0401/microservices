import { IResponse } from '~shared/shared.interface';
import { api } from '~/store/api';

export const settingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    changePassword: build.mutation<IResponse, { currentPassword: string; newPassword: string }>({
      query({ currentPassword, newPassword }) {
        return {
          url: '/auth/change-password',
          method: 'PUT',
          body: { currentPassword, newPassword }
        };
      },
      invalidatesTags: ['Auth']
    })
  })
});

export const { useChangePasswordMutation } = settingsApi;
