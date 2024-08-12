import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { EnhancedStore } from '@reduxjs/toolkit/dist/configureStore';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Reducer } from 'redux';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from '~features/auth/reducers/auth.reducer';
import logoutReducer from '~features/auth/reducers/logout.reducer';

import { api } from './api';
import headerReducer from '~shared/header/reducers/header.reducer';
import buyerReducer from '~features/buyer/reducers/buyer.reducer';
import sellerReducer from '~features/seller/reducers/seller.reducer';
import categoryReducer from '~shared/header/reducers/category.reducer';
import notificationReducer from '~shared/header/reducers/notification.reducer';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['clientApi', '_persist']
};
export const combineReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  authUser: authReducer,
  logout: logoutReducer,
  header: headerReducer,
  showCategoryContainer: categoryReducer,
  buyer: buyerReducer,
  seller: sellerReducer,
  notification: notificationReducer
});

export const rootReducers: Reducer<RootState> = (state, action) => {
  // reset state to default when user logs out
  if (action.type === 'logout/logout') {
    state = {} as RootState;
  }
  return combineReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store: EnhancedStore = configureStore({
  devTools: true,
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
      // fix RTK query error
    }).concat(api.middleware)
});
// Listener
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch<any>;

export const useAppDispatch: () => AppDispatch = useDispatch<any>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
