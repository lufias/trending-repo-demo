import { configureStore } from '@reduxjs/toolkit';
import trendingReducer from './slices/trendingSlice.ts';

export const store = configureStore({
  reducer: {
    trending: trendingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 