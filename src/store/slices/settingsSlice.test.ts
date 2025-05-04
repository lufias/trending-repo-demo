import { describe, it, expect } from 'vitest';
import settingsReducer, { toggleTrendingItemSetting } from './settingsSlice';

describe('settingsSlice', () => {
  it('should have correct initial state', () => {
    const initialState = settingsReducer(undefined, { type: 'unknown' });
    expect(initialState).toEqual({
      trendingItem: {
        showAvatar: true,
        showTags: true,
        showDescription: true,
        showStars: true,
      },
    });
  });

  it('should toggle showAvatar setting', () => {
    const initialState = settingsReducer(undefined, { type: 'unknown' });
    const newState = settingsReducer(initialState, toggleTrendingItemSetting('showAvatar'));
    expect(newState.trendingItem.showAvatar).toBe(false);
  });

  it('should toggle showTags setting', () => {
    const initialState = settingsReducer(undefined, { type: 'unknown' });
    const newState = settingsReducer(initialState, toggleTrendingItemSetting('showTags'));
    expect(newState.trendingItem.showTags).toBe(false);
  });

  it('should toggle showDescription setting', () => {
    const initialState = settingsReducer(undefined, { type: 'unknown' });
    const newState = settingsReducer(initialState, toggleTrendingItemSetting('showDescription'));
    expect(newState.trendingItem.showDescription).toBe(false);
  });

  it('should toggle showStars setting', () => {
    const initialState = settingsReducer(undefined, { type: 'unknown' });
    const newState = settingsReducer(initialState, toggleTrendingItemSetting('showStars'));
    expect(newState.trendingItem.showStars).toBe(false);
  });

  it('should toggle settings back to true', () => {
    const initialState = {
      trendingItem: {
        showAvatar: false,
        showTags: false,
        showDescription: false,
        showStars: false,
      },
    };
    
    const newState = settingsReducer(initialState, toggleTrendingItemSetting('showAvatar'));
    expect(newState.trendingItem.showAvatar).toBe(true);
  });
}); 