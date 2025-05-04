import { lazy } from 'react';
import { 
  faStar, 
  faCog
} from '@fortawesome/free-solid-svg-icons';

// Lazy load components
const Trending = lazy(() => import('../views/Trending'));
const Settings = lazy(() => import('../views/Settings'));

export const routes = [
  {
    path: '/',
    element: <Trending />,
    label: 'Trending',
    icon: faStar
  },
  {
    path: '/settings',
    element: <Settings />,
    label: 'Settings',
    icon: faCog
  }
]; 