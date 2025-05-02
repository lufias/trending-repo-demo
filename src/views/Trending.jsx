import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { fetchTrendingRepos, selectAllRepos, selectReposStatus, selectReposError } from '../store/slices/trendingSlice';

function Trending() {
  const dispatch = useDispatch();
  const repos = useSelector(selectAllRepos);
  const status = useSelector(selectReposStatus);
  const error = useSelector(selectReposError);

  useEffect(() => {
    dispatch(fetchTrendingRepos());
  }, [dispatch]);

  if (status === 'loading') {
    return <div className="p-4">Loading trending repositories...</div>;
  }

  if (status === 'failed') {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {repos.map(repo => (
        <div 
          key={repo.id} 
          className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
        >
          <h2 className="text-lg font-semibold text-gray-900">{repo.name}</h2>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">{repo.description || 'No description available'}</p>
          <div className="flex items-center mt-4">
            <img 
              src={repo.owner.avatar_url} 
              alt={repo.owner.login}
              className="w-6 h-6 rounded-full"
            />
            <span className="ml-2 text-sm text-gray-700">{repo.owner.login}</span>
            <div className="ml-auto flex items-center">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
              <span className="ml-1 text-sm text-gray-600">{repo.stargazers_count.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Trending; 