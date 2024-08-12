import { createSlice, Slice } from '@reduxjs/toolkit';
import { IBuyerDocument, IReduxBuyer } from '../interfaces/buyer.interface';
import { emptyBuyerData } from '~shared/utils/static-data';

const initialValue: IBuyerDocument = emptyBuyerData;

const buyerSlice: Slice = createSlice({
  name: 'buyer',
  initialState: initialValue,
  reducers: {
    addBuyer: (state: IBuyerDocument, action: IReduxBuyer): IBuyerDocument => {
      state = { ...action.payload };
      return state;
    },
    emptyBuyer: (): IBuyerDocument => {
      return emptyBuyerData;
    }
  }
});

export const { addBuyer, emptyBuyer } = buyerSlice.actions;
export default buyerSlice.reducer;
