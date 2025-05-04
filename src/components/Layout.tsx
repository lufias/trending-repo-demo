import { Link, useLocation, Routes, Route } from 'react-router-dom';
import { Suspense, FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { routes } from '../config/routes.jsx';

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  icon?: IconDefinition;
  label: string;
}

const Layout: FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Wrapper for max-width constraint */}
      <div className="mx-auto min-w-[320px] max-w-[480px] flex flex-col min-h-screen relative bg-white px-2 sm:px-0">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="p-4">
            <h1 className="text-lg sm:text-2xl font-bold text-center">Trending Repos</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          }>
            <Routes>
              {routes.map((route: RouteConfig) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t sticky bottom-0 z-10">
          <div className="flex justify-around">
            {routes.map((route: RouteConfig) => (
              <Link 
                key={route.path}
                to={route.path} 
                className={`flex flex-col items-center p-3 sm:p-4 flex-1 ${
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