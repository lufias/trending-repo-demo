import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  owner: {
    avatar_url: string;
    login: string;
  };
}

interface TrendingState {
  allRepos: Repository[];
  currentPage: number;
  lastAttemptedPage: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  rateLimitResetTime: number | null;
}

interface FetchResponse {
  items: Repository[];
  page: number;
}

// Async thunk for fetching trending repositories
export const fetchTrendingRepos = createAsyncThunk<
  FetchResponse,
  number,
  { state: { trending: TrendingState }; rejectValue: { message: string; resetTime?: number; page: number } }
>(
  'trending/fetchTrendingRepos',
  async (page = 1, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get<{ items: Repository[] }>(
        `https://api.github.com/search/repositories?q=created:>2024-07-15&sort=stars&order=desc&page=${page}`
      );

      const state = getState();
      const existingRepos = state.trending.allRepos;
      const existingIds = new Set(existingRepos.map(repo => repo.id));
      const newItems = response.data.items.filter(item => !existingIds.has(item.id));

      return { items: newItems, page };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        const resetTime = Number(error.response.headers['x-ratelimit-reset']) * 1000;
        return rejectWithValue({ message: 'GitHub API rate limit exceeded', resetTime, page });
      }
      return rejectWithValue({ 
        message: error instanceof Error ? error.message : 'An error occurred',
        page 
      });
    }
  }
);

const initialState: TrendingState = {
  allRepos: [],
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
      state.error = null;
      state.status = 'idle';
      state.rateLimitResetTime = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingRepos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrendingRepos.fulfilled, (state, action: PayloadAction<FetchResponse>) => {
        state.status = 'succeeded';
        state.allRepos = [...state.allRepos, ...action.payload.items];
        state.currentPage = action.payload.page + 1;
        state.lastAttemptedPage = action.payload.page;
        state.error = null;
      })
      .addCase(fetchTrendingRepos.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload) {
          state.error = action.payload.message;
          state.lastAttemptedPage = action.payload.page;
          state.rateLimitResetTime = action.payload.resetTime || null;
        }
      });
  }
});

export const { resetRepos, clearError } = trendingSlice.actions;

// Selectors
export const selectAllRepos = (state: { trending: TrendingState }) => state.trending.allRepos;
export const selectReposStatus = (state: { trending: TrendingState }) => state.trending.status;
export const selectReposError = (state: { trending: TrendingState }) => state.trending.error;
export const selectCurrentPage = (state: { trending: TrendingState }) => state.trending.currentPage;
export const selectLastAttemptedPage = (state: { trending: TrendingState }) => state.trending.lastAttemptedPage;
export const selectRateLimitResetTime = (state: { trending: TrendingState }) => state.trending.rateLimitResetTime;
export const selectHasMoreRepos = (state: { trending: TrendingState }) => state.trending.allRepos.length > 0;

export default trendingSlice.reducer; 