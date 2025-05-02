import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching trending repositories
export const fetchTrendingRepos = createAsyncThunk(
  'trending/fetchTrendingRepos',
  async (page = 1, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=created:>2024-07-15&sort=stars&order=desc&page=${page}`
      );

      // Get existing repos from state
      const existingRepos = getState().trending.allRepos;
      const existingIds = new Set(existingRepos.map(repo => repo.id));

      // Filter out duplicates from new items
      const newItems = response.data.items.filter(item => !existingIds.has(item.id));

      return {
        items: newItems,
        page: page
      };
    } catch (error) {
      if (error.response?.status === 403) {
        const resetTime = error.response.headers['x-ratelimit-reset'] * 1000;
        return rejectWithValue({
          message: 'GitHub API rate limit exceeded',
          resetTime,
          page
        });
      }
      return rejectWithValue({
        message: error.message,
        page
      });
    }
  }
);

const initialState = {
  allRepos: [], // Store all fetched repos
  currentPage: 1,
  lastAttemptedPage: 1,
  status: 'idle',
  error: null,
  rateLimitResetTime: null
};

const trendingSlice = createSlice({
  name: 'trending',
  initialState,
  reducers: {
    resetRepos: (state) => {
      state.allRepos = [];
      state.currentPage = 1;
      state.lastAttemptedPage = 1;
      state.status = 'idle';
      state.error = null;
      state.rateLimitResetTime = null;
    },
    clearError: (state) => {
      state.status = 'idle';
      state.error = null;
      state.rateLimitResetTime = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingRepos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTrendingRepos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allRepos = [...state.allRepos, ...action.payload.items];
        state.currentPage = action.payload.page + 1;
        state.lastAttemptedPage = action.payload.page;
        state.error = null;
        state.rateLimitResetTime = null;
      })
      .addCase(fetchTrendingRepos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.lastAttemptedPage = action.payload.page;
        if (action.payload.resetTime) {
          state.rateLimitResetTime = action.payload.resetTime;
        }
      });
  }
});

export const { resetRepos, clearError } = trendingSlice.actions;

// Export selectors
export const selectAllRepos = (state) => state.trending.allRepos;
export const selectReposStatus = (state) => state.trending.status;
export const selectReposError = (state) => state.trending.error;
export const selectCurrentPage = (state) => state.trending.currentPage;
export const selectLastAttemptedPage = (state) => state.trending.lastAttemptedPage;
export const selectRateLimitResetTime = (state) => state.trending.rateLimitResetTime;
export const selectHasMoreRepos = (state) => state.trending.allRepos.length > 0;

export default trendingSlice.reducer; 