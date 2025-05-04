import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import trendingReducer from './slices/trendingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    trending: trendingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 