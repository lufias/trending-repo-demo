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

import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  // Refs for managing component lifecycle and state
  const observer = useRef(); // IntersectionObserver instance
  const loadingTimeout = useRef(); // Timeout for loading more items
  const initialFetchDone = useRef(false); // Flag for initial data fetch

  // Local state management
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  /**
   * Handles retry logic when rate limit expires
   * Clears error state and attempts to fetch data again
   */
  const handleRetry = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchTrendingRepos(lastAttemptedPage));
  }, [dispatch, lastAttemptedPage]);

  /**
   * Rate Limit Timer Effect
   * 
   * Manages the countdown timer for rate limit expiration
   * - Updates timeLeft state every second
   * - Auto-retries when timer reaches 0
   * - Cleans up interval on unmount
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
   * 
   * Fetches first page of trending repositories on component mount
   * Uses a ref to ensure it only runs once
   */
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      dispatch(fetchTrendingRepos(1));
    }
  }, [dispatch]);

  /**
   * Infinite Scroll Implementation
   * 
   * Uses IntersectionObserver to detect when user reaches bottom of list
   * - Creates observer instance
   * - Handles loading more items with delay
   * - Manages loading states
   * - Cleans up observer on unmount
   */
  const lastRepoElementRef = useCallback(node => {
    if (status === 'loading' || isLoadingMore || status === 'failed') return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current);
        }
        setIsLoadingMore(true);
        loadingTimeout.current = setTimeout(() => {
          dispatch(fetchTrendingRepos(currentPage));
          setIsLoadingMore(false);
        }, 500);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [status, hasMore, dispatch, isLoadingMore, currentPage]);

  /**
   * Cleanup Effect
   * 
   * Cleans up timeouts and observer on component unmount
   * Prevents memory leaks and unnecessary operations
   */
  useEffect(() => {
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

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
      <div className={`p-4 space-y-4 pb-20 ${error ? 'pointer-events-none' : ''}`}>
        {/* Repository List */}
        {repos.map((repo, index) => (
          <TrendingItem
            key={repo.id}
            repo={repo}
            lastRepoElementRef={index === repos.length - 1 ? lastRepoElementRef : null}
          />
        ))}
        
        {/* Loading More Indicator */}
        {isLoadingMore && (
          <div className="p-4 text-center text-gray-500 mb-20">Loading more repositories...</div>
        )}
      </div>
    </div>
  );
}

export default Trending; 