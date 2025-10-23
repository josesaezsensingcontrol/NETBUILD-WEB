import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import authReducer from '../features/auth/authSlice';
import buildingsReducer from '../features/buildings/buildingsSlice';
import neighborhoodsReducer from '../features/neighborhoods/neighborhoodsSlice';
import { signalRMiddleware } from '../features/signalr/signalRMiddleware';

const rootReducer = combineReducers({
  auth: authReducer,
  buildings: buildingsReducer,
  neighborhoods: neighborhoodsReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware).concat(signalRMiddleware.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
