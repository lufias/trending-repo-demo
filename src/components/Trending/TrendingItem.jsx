import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function TrendingItem({ repo, lastRepoElementRef }) {
  return (
    <div 
      ref={lastRepoElementRef}
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
  );
}

export default TrendingItem; 