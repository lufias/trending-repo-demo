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
  selectCurrentPage
} from '../store/slices/trendingSlice';

function Trending() {
  const dispatch = useDispatch();
  const repos = useSelector(selectAllRepos);
  const status = useSelector(selectReposStatus);
  const error = useSelector(selectReposError);
  const hasMore = useSelector(selectHasMoreRepos);
  const currentPage = useSelector(selectCurrentPage);
  const observer = useRef();
  const loadingTimeout = useRef();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchTrendingRepos(1));
  }, [dispatch]);

  // Infinite scroll implementation
  const lastRepoElementRef = useCallback(node => {
    if (status === 'loading' || isLoadingMore) return;
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

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => dispatch(fetchTrendingRepos(1))}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
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
  );
}

export default Trending; 