import { lazy, LazyExoticComponent, FC } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { 
  faStar, 
  faCog
} from '@fortawesome/free-solid-svg-icons';

interface RouteConfig {
  path: string;
  element: LazyExoticComponent<FC>;
  label: string;
  icon: IconDefinition;
}

// Lazy load components
const Trending = lazy(() => import('../views/Trending.tsx'));
const Settings = lazy(() => import('../views/Settings.tsx'));

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: Trending,
    label: 'Trending',
    icon: faStar
  },
  {
    path: '/settings',
    element: Settings,
    label: 'Settings',
    icon: faCog
  }
]; 