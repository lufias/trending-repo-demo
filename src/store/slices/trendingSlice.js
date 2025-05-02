import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching trending repositories
export const fetchTrendingRepos = createAsyncThunk(
  'trending/fetchTrendingRepos',
  async () => {
    const response = await axios.get('https://api.github.com/search/repositories?q=created:>2024-07-15&sort=stars&order=desc');
    return response.data.items;
  }
);

const initialState = {
  allRepos: [], // Store all fetched repos
  displayedRepos: [], // Currently displayed repos
  currentPage: 1,
  status: 'idle',
  error: null
};

const trendingSlice = createSlice({
  name: 'trending',
  initialState,
  reducers: {
    loadMoreRepos: (state) => {
      const nextPage = state.currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * 10;
      state.displayedRepos = state.allRepos.slice(startIndex, endIndex);
      state.currentPage = nextPage;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingRepos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrendingRepos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allRepos = action.payload;
        state.displayedRepos = action.payload.slice(0, 10);
        state.currentPage = 1;
      })
      .addCase(fetchTrendingRepos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { loadMoreRepos } = trendingSlice.actions;

// Export selectors
export const selectDisplayedRepos = (state) => state.trending.displayedRepos;
export const selectAllRepos = (state) => state.trending.allRepos;
export const selectReposStatus = (state) => state.trending.status;
export const selectReposError = (state) => state.trending.error;
export const selectHasMoreRepos = (state) => 
  state.trending.displayedRepos.length < state.trending.allRepos.length;

export default trendingSlice.reducer; 