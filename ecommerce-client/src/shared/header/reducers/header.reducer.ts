import { IReduxHeader } from '../interfaces/header.interface';
import { createSlice, Slice } from '@reduxjs/toolkit';

const initialValue = 'index';

const headerSlice: Slice = createSlice({
  name: 'header',
  initialState: initialValue,
  reducers: {
    updateHeader: (state: string, action: IReduxHeader): string => {
      state = action.payload;
      return state;
    }
  }
});

export const { updateHeader } = headerSlice.actions;
export default headerSlice.reducer;
