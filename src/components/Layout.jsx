import { Link, useLocation, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { routes } from '../config/routes.jsx';

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
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t sticky bottom-0 z-10">
          <div className="flex justify-around">
            {routes.map((route) => (
              <Link 
                key={route.path}
                to={route.path} 
                className={`flex flex-col items-center p-4 flex-1 ${
                  location.pathname === route.path ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                {route.icon && (
                  <FontAwesomeIcon 
                    icon={route.icon} 
                    className="text-xl" 
                  />
                )}
                <span className="text-sm mt-1">{route.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Layout; 