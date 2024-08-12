import { createSlice, Slice } from '@reduxjs/toolkit';

import { IAuthUser, IReduxAddAuthUser } from '~features/auth/interfaces/auth.interface';
import { initialAuthUserValues } from '~shared/utils/static-data';

const initiValue: IAuthUser = initialAuthUserValues;

const authSlice: Slice = createSlice({
  name: 'auth',
  initialState: initiValue,
  reducers: {
    addAuthUser: (state: IAuthUser, action: IReduxAddAuthUser): IAuthUser => {
      const { authInfo } = action.payload;
      state = { ...authInfo } as unknown as IAuthUser;
      return state;
    },
    clearAuthUser: (): IAuthUser => {
      return initiValue;
    }
  }
});

export const { addAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
