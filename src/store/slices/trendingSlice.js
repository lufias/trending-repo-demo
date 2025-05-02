import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching trending repositories
export const fetchTrendingRepos = createAsyncThunk(
  'trending/fetchTrendingRepos',
  async () => {
    const response = await axios.get('https://api.github.com/search/repositories?q=created:>2024-07-15&sort=stars&order=desc');
    // Only return the first 10 repositories
    return response.data.items.slice(0, 10);
  }
);

const initialState = {
  repos: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const trendingSlice = createSlice({
  name: 'trending',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingRepos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrendingRepos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.repos = action.payload;
      })
      .addCase(fetchTrendingRepos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Export selectors
export const selectAllRepos = (state) => state.trending.repos;
export const selectReposStatus = (state) => state.trending.status;
export const selectReposError = (state) => state.trending.error;

export default trendingSlice.reducer; 