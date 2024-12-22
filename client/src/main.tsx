import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import global styles
import './assets/index.css'

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import TicketMaster from './pages/TicketMaster';
import Spotify from './pages/SpotifyPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1>OH NOES</h1>,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp/>,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/spotify',
        element: <Spotify />,
      },
      {
        path: '/ticket',
        element: <TicketMaster />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
