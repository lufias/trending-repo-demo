import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.ts';
import trendingReducer from './slices/trendingSlice.ts';

export const store = configureStore({
  reducer: {
    user: userReducer,
    trending: trendingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 