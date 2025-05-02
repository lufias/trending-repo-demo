import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching trending repositories
export const fetchTrendingRepos = createAsyncThunk(
  'trending/fetchTrendingRepos',
  async (page = 1) => {
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=created:>2024-07-15&sort=stars&order=desc&page=${page}`
    );
    return {
      items: response.data.items,
      page: page
    };
  }
);

const initialState = {
  allRepos: [], // Store all fetched repos
  currentPage: 1,
  status: 'idle',
  error: null
};

const trendingSlice = createSlice({
  name: 'trending',
  initialState,
  reducers: {
    resetRepos: (state) => {
      state.allRepos = [];
      state.currentPage = 1;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingRepos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrendingRepos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allRepos = [...state.allRepos, ...action.payload.items];
        state.currentPage = action.payload.page + 1;
      })
      .addCase(fetchTrendingRepos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { resetRepos } = trendingSlice.actions;

// Export selectors
export const selectAllRepos = (state) => state.trending.allRepos;
export const selectReposStatus = (state) => state.trending.status;
export const selectReposError = (state) => state.trending.error;
export const selectCurrentPage = (state) => state.trending.currentPage;
export const selectHasMoreRepos = (state) => state.trending.allRepos.length > 0;

export default trendingSlice.reducer; 