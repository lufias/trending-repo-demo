import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
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

function ErrorModal({ error, timeLeft, onRetry }) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Whoa, Slow Down! 🚦
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Looks like we're getting a bit too excited! GitHub needs a quick breather before showing more awesome repositories.
                      {timeLeft > 0 && (
                        <span className="block mt-2 font-medium">
                          We can continue exploring in {timeLeft} seconds
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={onRetry}
                disabled={timeLeft > 0}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                  timeLeft > 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {timeLeft > 0 ? 'Taking a breather...' : 'Let\'s continue!'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Trending() {
  const dispatch = useDispatch();
  const repos = useSelector(selectAllRepos);
  const status = useSelector(selectReposStatus);
  const error = useSelector(selectReposError);
  const hasMore = useSelector(selectHasMoreRepos);
  const currentPage = useSelector(selectCurrentPage);
  const lastAttemptedPage = useSelector(selectLastAttemptedPage);
  const rateLimitResetTime = useSelector(selectRateLimitResetTime);
  const observer = useRef();
  const loadingTimeout = useRef();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const handleRetry = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchTrendingRepos(lastAttemptedPage));
  }, [dispatch, lastAttemptedPage]);

  // Update countdown timer
  useEffect(() => {
    if (!rateLimitResetTime) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const timeRemaining = Math.max(0, Math.ceil((rateLimitResetTime - now) / 1000));
      setTimeLeft(timeRemaining);

      // Auto retry when timer reaches 0
      if (timeRemaining === 0) {
        handleRetry();
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [rateLimitResetTime, handleRetry]);

  // Initial fetch
  useEffect(() => {
    if (!repos.length) {
      dispatch(fetchTrendingRepos(1));
    }
  }, [dispatch, repos.length]);

  // Infinite scroll implementation
  const lastRepoElementRef = useCallback(node => {
    if (status === 'loading' || isLoadingMore || status === 'failed') return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // Clear any existing timeout
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current);
        }
        setIsLoadingMore(true);
        // Add a small delay before loading more items
        loadingTimeout.current = setTimeout(() => {
          dispatch(fetchTrendingRepos(currentPage));
          setIsLoadingMore(false);
        }, 500);
      }
    });
    if (node) observer.current.observe(node);
  }, [status, hasMore, dispatch, isLoadingMore, currentPage]);

  // Cleanup timeout and observer on unmount
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

  if (status === 'loading' && repos.length === 0) {
    return <div className="p-4">Loading trending repositories...</div>;
  }

  return (
    <div className="relative">
      {error && (
        <ErrorModal 
          error={error}
          timeLeft={timeLeft}
          onRetry={handleRetry}
        />
      )}

      <div className={`p-4 space-y-4 pb-20 ${error ? 'pointer-events-none' : ''}`}>
        {repos.map((repo, index) => (
          <div 
            key={repo.id} 
            ref={index === repos.length - 1 ? lastRepoElementRef : null}
            className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
          >
            <div className="flex items-start gap-4">
              <img 
                src={repo.owner.avatar_url} 
                alt={repo.owner.login}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.full_name}
                      </a>
                    </h3>
                    <p className="text-gray-600 mt-1">{repo.description || 'No description available'}</p>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    <span>{repo.stargazers_count.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {repo.topics?.slice(0, 3).map(topic => (
                    <span 
                      key={topic} 
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoadingMore && (
          <div className="p-4 text-center text-gray-500 mb-20">Loading more repositories...</div>
        )}
      </div>
    </div>
  );
}

export default Trending; 