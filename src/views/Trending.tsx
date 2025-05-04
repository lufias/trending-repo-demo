/**
 * Trending Component
 * 
 * This component displays a list of trending GitHub repositories with infinite scroll functionality.
 * It handles rate limiting, error states, and loading states while fetching data from the GitHub API.
 * 
 * Key Features:
 * 1. Rate Limit Management
 *    - Tracks GitHub API rate limit status
 *    - Shows countdown timer when rate limited
 *    - Auto-retries when rate limit expires
 * 
 * 2. Infinite Scroll
 *    - Uses IntersectionObserver to detect when user reaches bottom
 *    - Loads more repositories automatically
 *    - Handles loading states and timeouts
 * 
 * 3. Data Management
 *    - Initial data fetch on component mount
 *    - Manages loading states (initial load and loading more)
 *    - Handles error states and retry logic
 * 
 * 4. UI Components
 *    - RateLimitErrorModal: Shows rate limit error with countdown
 *    - TrendingItem: Individual repository display
 *    - Loading indicators for initial load and loading more
 */

import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Virtuoso } from 'react-virtuoso';
import { 
  fetchTrendingRepos, 
  selectAllRepos, 
  selectReposStatus, 
  selectReposError,
  selectHasMoreRepos,
  selectCurrentPage,
  selectLastAttemptedPage,
  selectRateLimitResetTime,
  clearError
} from '../store/slices/trendingSlice';
import RateLimitErrorModal from '../components/Trending/RateLimitErrorModal';
import TrendingItem from '../components/Trending/TrendingItem';

function Trending() {
  // Redux state management
  const dispatch = useDispatch();
  const repos = useSelector(selectAllRepos);
  const status = useSelector(selectReposStatus);
  const error = useSelector(selectReposError);
  const hasMore = useSelector(selectHasMoreRepos);
  const currentPage = useSelector(selectCurrentPage);
  const lastAttemptedPage = useSelector(selectLastAttemptedPage);
  const rateLimitResetTime = useSelector(selectRateLimitResetTime);

  // Local state management
  const [timeLeft, setTimeLeft] = useState(null);

  /**
   * Handles retry logic when rate limit expires
   */
  const handleRetry = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchTrendingRepos(lastAttemptedPage));
  }, [dispatch, lastAttemptedPage]);

  /**
   * Rate Limit Timer Effect
   */
  useEffect(() => {
    if (!rateLimitResetTime) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const timeRemaining = Math.max(0, Math.ceil((rateLimitResetTime - now) / 1000));
      setTimeLeft(timeRemaining);

      if (timeRemaining === 0) {
        handleRetry();
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [rateLimitResetTime, handleRetry]);

  /**
   * Initial Data Fetch Effect
   */
  useEffect(() => {
    dispatch(fetchTrendingRepos(1));
  }, [dispatch]);

  /**
   * Load More Effect
   * Fetches more repositories when user reaches bottom of the list
   */
  useEffect(() => {
    if (status === 'idle' && hasMore) {
      dispatch(fetchTrendingRepos(currentPage));
    }
  }, [status, hasMore, dispatch, currentPage]);

  // Show loading state for initial fetch
  if (status === 'loading' && repos.length === 0) {
    return <div className="p-4">Loading trending repositories...</div>;
  }

  return (
    <div className="relative">
      {/* Rate Limit Error Modal */}
      {error && (
        <RateLimitErrorModal 
          error={error}
          timeLeft={timeLeft}
          onRetry={handleRetry}
        />
      )}

      {/* Main Content Area */}
      <div className={`p-4 virtuoso-scroll-hide ${error ? 'pointer-events-none' : ''}`} style={{ height: `calc(100vh - 100px)` }}>
        <Virtuoso
          data={repos}
          itemContent={(index, repo) => <TrendingItem repo={repo} />}
          endReached={() => {
            if (hasMore && status !== 'loading') {
              dispatch(fetchTrendingRepos(currentPage));
            }
          }}
          overscan={200}
          style={{ height: '100%', width: '100%' }}
        />
        {/* Loading More Indicator */}
        {status === 'loading' && repos.length > 0 && (
          <div className="p-4 text-center text-gray-500">Loading more repositories...</div>
        )}
      </div>
    </div>
  );
}

export default Trending; 