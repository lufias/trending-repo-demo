import Trending from '../views/Trending';
import Settings from '../views/Settings';
import { 
  faStar, 
  faCog
} from '@fortawesome/free-solid-svg-icons';

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