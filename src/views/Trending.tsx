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

import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { AppDispatch } from '../store';
import { 
  fetchTrendingRepos, 
  selectAllRepos, 
  selectReposStatus, 
  selectReposError,
  selectHasMoreRepos,
  selectCurrentPage,
  selectLastAttemptedPage,
  selectRateLimitResetTime,
  clearError,
  Repository
} from '../store/slices/trendingSlice.ts';
import RateLimitErrorModal from '../components/Trending/RateLimitErrorModal';
import TrendingItem from '../components/Trending/TrendingItem';
import Toast from '../components/Toast';

function Trending() {
  // Redux state management
  const dispatch = useDispatch<AppDispatch>();
  const repos: Repository[] = useSelector(selectAllRepos);
  const status: 'idle' | 'loading' | 'succeeded' | 'failed' = useSelector(selectReposStatus);
  const error: string | null = useSelector(selectReposError);
  const hasMore: boolean = useSelector(selectHasMoreRepos);
  const currentPage: number = useSelector(selectCurrentPage);
  const lastAttemptedPage: number = useSelector(selectLastAttemptedPage);
  const rateLimitResetTime: number | null = useSelector(selectRateLimitResetTime);

  // Local state management
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  /**
   * Handles retry logic when rate limit expires
   */
  const handleRetry = useCallback((): void => {
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

    const updateTimer = (): void => {
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
   * Only fetch if we haven't loaded any data yet
   */
  useEffect(() => {
    if (!initialLoadDone && repos.length === 0) {
      dispatch(fetchTrendingRepos(1));
      setInitialLoadDone(true);
    }
  }, [dispatch, repos.length, initialLoadDone]);

  /**
   * Load More Effect
   * Fetches more repositories when user reaches bottom of the list
   */
  useEffect(() => {
    if (status === 'idle' && hasMore && currentPage > 1) {
      dispatch(fetchTrendingRepos(currentPage));
    }
  }, [status, hasMore, dispatch, currentPage]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (!virtuosoRef.current || error) return;

    const scrollAmount = 300; // pixels to scroll per key press

    switch (e.key) {
      case 'ArrowUp':
        virtuosoRef.current.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
        break;
      case 'ArrowDown':
        virtuosoRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
        break;
      default:
        return;
    }
  }, [error]);

  /**
   * Add keyboard event listener
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Show loading state for initial fetch
  if (status === 'loading' && repos.length === 0) {
    return <div className="p-4">Loading trending repositories...</div>;
  }

  return (
    <div className="relative">
      {/* Rate Limit Error Modal */}
      {error && (
        <RateLimitErrorModal 
          timeLeft={timeLeft}
          onRetry={handleRetry}
        />
      )}

      {/* Loading Toast */}
      <Toast 
        message="Loading more repositories..." 
        show={status === 'loading' && repos.length > 0}
        position="bottom"
        offset={24}
        variant="default"
      />

      {/* Main Content Area */}
      <div className={`p-4 virtuoso-scroll-hide ${error ? 'pointer-events-none' : ''}`} style={{ height: `calc(100vh - 100px)` }}>
        <Virtuoso
          ref={virtuosoRef}
          data={repos}
          itemContent={(_index: number, repo: Repository) => <TrendingItem repo={repo} />}
          endReached={() => {
            if (hasMore && status !== 'loading') {
              dispatch(fetchTrendingRepos(currentPage));
            }
          }}
          overscan={200}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
}

export default Trending; 