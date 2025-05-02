import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function Trending() {
  const repos = [
    {
      id: 1,
      name: 'tensorflow',
      description: 'Computation using data flow graphs for scalable machine learning',
      stars: '5.1k'
    },
    // Add more repos as needed
  ];

  return (
    <div className="p-4 space-y-4">
      {repos.map(repo => (
        <div 
          key={repo.id} 
          className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
        >
          <h2 className="text-lg font-semibold text-gray-900">{repo.name}</h2>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">{repo.description}</p>
          <div className="flex items-center mt-4">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <span className="ml-2 text-sm text-gray-700">{repo.name}</span>
            <div className="ml-auto flex items-center">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
              <span className="ml-1 text-sm text-gray-600">{repo.stars}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Trending; 