import { Link, useLocation, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCog } from '@fortawesome/free-solid-svg-icons';
import Trending from '../views/Trending';
import Settings from '../views/Settings';

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Wrapper for max-width constraint */}
      <div className="mx-auto min-w-[320px] max-w-[480px] flex flex-col min-h-screen relative bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-center">Trending Repos</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Trending />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t sticky bottom-0 z-10">
          <div className="flex justify-around">
            <Link 
              to="/" 
              className={`flex flex-col items-center p-4 flex-1 ${
                location.pathname === '/' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <FontAwesomeIcon icon={faStar} className="text-xl" />
              <span className="text-sm mt-1">Trending</span>
            </Link>
            <Link 
              to="/settings" 
              className={`flex flex-col items-center p-4 flex-1 ${
                location.pathname === '/settings' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <FontAwesomeIcon icon={faCog} className="text-xl" />
              <span className="text-sm mt-1">Settings</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Layout; 