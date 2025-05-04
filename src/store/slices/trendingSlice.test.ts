import { describe, it, expect, vi } from 'vitest';
import trendingReducer, {
  resetRepos,
  clearError,
  fetchTrendingRepos,
  selectAllRepos,
  selectReposStatus,
  selectReposError,
  selectCurrentPage,
  selectLastAttemptedPage,
  selectRateLimitResetTime,
  selectHasMoreRepos,
  Repository,
  TrendingState
} from './trendingSlice';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('trendingSlice', () => {
  const initialState: TrendingState = {
    allRepos: [],
    currentPage: 1,
    lastAttemptedPage: 1,
    status: 'idle',
    error: null,
    rateLimitResetTime: null
  };

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(trendingReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle resetRepos', () => {
      const state: TrendingState = {
        ...initialState,
        allRepos: [{
          id: 1,
          name: 'test',
          full_name: 'test/test',
          description: 'Test repo',
          stargazers_count: 0,
          language: 'JavaScript',
          html_url: 'https://github.com/test/test',
          owner: {
            avatar_url: 'https://avatar.com',
            login: 'test'
          }
        }],
        currentPage: 2,
        lastAttemptedPage: 2,
        status: 'succeeded',
        error: 'Some error'
      };
      expect(trendingReducer(state, resetRepos())).toEqual(initialState);
    });

    it('should handle clearError', () => {
      const state: TrendingState = {
        ...initialState,
        status: 'failed',
        error: 'Some error',
        rateLimitResetTime: 1234567890
      };
      expect(trendingReducer(state, clearError())).toEqual({
        ...initialState,
        status: 'idle'
      });
    });
  });

  describe('async thunk', () => {
    const mockRepos: Repository[] = [
      {
        id: 1,
        name: 'repo1',
        full_name: 'user/repo1',
        description: 'Test repo 1',
        stargazers_count: 100,
        language: 'JavaScript',
        html_url: 'https://github.com/user/repo1',
        owner: {
          avatar_url: 'https://avatar1.com',
          login: 'user1'
        }
      }
    ];

    it('should handle successful fetch', async () => {
      (axios.get as any).mockResolvedValueOnce({ data: { items: mockRepos } });
      
      const dispatch = vi.fn();
      const getState = () => ({ 
        trending: initialState,
        settings: {
          trendingItem: {
            showAvatar: true,
            showTags: true,
            showDescription: true,
            showStars: true,
          },
          previousDays: 7
        }
      });
      
      await fetchTrendingRepos(1)(dispatch, getState, undefined);
      
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchTrendingRepos.fulfilled.type,
          payload: { items: mockRepos, page: 1 }
        })
      );
    });

    it('should handle rate limit error', async () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 403,
          headers: {
            'x-ratelimit-reset': '1234567890'
          }
        }
      };
      (axios.isAxiosError as any).mockReturnValueOnce(true);
      (axios.get as any).mockRejectedValueOnce(error);
      
      const dispatch = vi.fn();
      const getState = () => ({ 
        trending: initialState,
        settings: {
          trendingItem: {
            showAvatar: true,
            showTags: true,
            showDescription: true,
            showStars: true,
          },
          previousDays: 7
        }
      });
      
      await fetchTrendingRepos(1)(dispatch, getState, undefined);
      
      // First call should be pending
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: fetchTrendingRepos.pending.type,
        meta: expect.objectContaining({
          arg: 1,
          requestStatus: 'pending'
        })
      });

      // Second call should be rejected with rate limit error
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: fetchTrendingRepos.rejected.type,
        error: { message: 'Rejected' },
        meta: expect.objectContaining({
          arg: 1,
          requestStatus: 'rejected',
          rejectedWithValue: true
        }),
        payload: {
          message: 'GitHub API rate limit exceeded',
          resetTime: 1234567890000,
          page: 1
        }
      });
    });
  });

  describe('selectors', () => {
    const mockRepos: Repository[] = [
      {
        id: 1,
        name: 'repo1',
        full_name: 'user/repo1',
        description: 'Test repo 1',
        stargazers_count: 100,
        language: 'JavaScript',
        html_url: 'https://github.com/user/repo1',
        owner: {
          avatar_url: 'https://avatar1.com',
          login: 'user1'
        }
      }
    ];

    const state = {
      trending: {
        allRepos: mockRepos,
        currentPage: 2,
        lastAttemptedPage: 2,
        status: 'succeeded' as const,
        error: null,
        rateLimitResetTime: null
      }
    };

    it('should select all repos', () => {
      expect(selectAllRepos(state)).toEqual(mockRepos);
    });

    it('should select status', () => {
      expect(selectReposStatus(state)).toBe('succeeded');
    });

    it('should select error', () => {
      expect(selectReposError(state)).toBeNull();
    });

    it('should select current page', () => {
      expect(selectCurrentPage(state)).toBe(2);
    });

    it('should select last attempted page', () => {
      expect(selectLastAttemptedPage(state)).toBe(2);
    });

    it('should select rate limit reset time', () => {
      expect(selectRateLimitResetTime(state)).toBeNull();
    });

    it('should select has more repos', () => {
      expect(selectHasMoreRepos(state)).toBe(true);
    });
  });
}); 