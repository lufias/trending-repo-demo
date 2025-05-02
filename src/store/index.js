import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import trendingReducer from './slices/trendingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    trending: trendingReducer,
  },
}); 