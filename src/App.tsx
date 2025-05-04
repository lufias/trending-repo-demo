import { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import './App.scss';

const App: FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;