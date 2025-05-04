import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  trendingItem: {
    showAvatar: boolean;
    showTags: boolean;
    showDescription: boolean;
    showStars: boolean;
  };
}

const initialState: SettingsState = {
  trendingItem: {
    showAvatar: true,
    showTags: true,
    showDescription: true,
    showStars: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTrendingItemSetting: (state, action: PayloadAction<keyof SettingsState['trendingItem']>) => {
      state.trendingItem[action.payload] = !state.trendingItem[action.payload];
    },
  },
});

export const { toggleTrendingItemSetting } = settingsSlice.actions;

export const selectTrendingItemSettings = (state: { settings: SettingsState }) => state.settings.trendingItem;

export default settingsSlice.reducer; 