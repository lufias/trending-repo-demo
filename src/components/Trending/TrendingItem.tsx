import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectTrendingItemSettings } from '../../store/slices/settingsSlice';
import { FC } from 'react';

interface Repository {
  owner: {
    avatar_url: string;
    login: string;
  };
  html_url: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  topics?: string[];
}

interface TrendingItemProps {
  repo: Repository;
  lastRepoElementRef?: ((node: HTMLDivElement | null) => void) | null;
}

const TrendingItem: FC<TrendingItemProps> = ({ repo, lastRepoElementRef = null }) => {
  const settings = useSelector(selectTrendingItemSettings);
  
  // Color palette for tag backgrounds
  const tagColors = [
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-yellow-100 text-yellow-600',
    'bg-pink-100 text-pink-600',
    'bg-purple-100 text-purple-600',
    'bg-red-100 text-red-600',
  ];

  return (
    <div 
      ref={lastRepoElementRef}
      className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
    >
      <h3 className="text-xl font-bold text-gray-800 text-left">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          {repo.full_name}
        </a>
      </h3>
      {settings.showDescription && (
        <p className="text-gray-800 mt-2 text-left text-base font-normal">
          {repo.description || 'No description available'}
        </p>
      )}
      <div className="flex items-center justify-between mt-4">
        {settings.showAvatar && (
          <div className="flex items-center">
            <img 
              src={repo.owner.avatar_url} 
              alt={repo.owner.login}
              className="w-8 h-8 rounded bg-gray-200 mr-2"
            />
            <span className="text-gray-800 font-medium text-base">{repo.owner.login}</span>
          </div>
        )}
        {settings.showStars && (
          <div className="flex items-center font-bold text-lg">
            <FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-500" />
            <span className="text-gray-700">{repo.stargazers_count.toLocaleString()}</span>
          </div>
        )}
      </div>
      {settings.showTags && repo.topics && repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {repo.topics.slice(0, 3).map((topic, idx) => (
            <span 
              key={topic} 
              className={`px-2 py-1 rounded-full text-sm font-medium ${tagColors[idx % tagColors.length]}`}
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrendingItem; 