import { configureStore } from '@reduxjs/toolkit';
import trendingReducer from './slices/trendingSlice.ts';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    trending: trendingReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 