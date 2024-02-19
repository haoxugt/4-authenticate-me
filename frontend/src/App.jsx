import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';

// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation';
import SpotsList from './components/SpotsList';
import SpotFormPage from './components/SpotFormPage';
import SpotShowPage from './components/Spots/SpotShowPage';
import SpotsManagePage from './components/Spots/SpotsManagePage/SpotsManagePage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <div className='page-container'>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsList />
      },
      {
        path: '/spots/new',
        element: <SpotFormPage formType="Create a Spot"/>
      },
      {
        path: '/spots/:spotId',
        element: <SpotShowPage />
      },
      {
        path: '/spots/current',
        element: <SpotsManagePage />
      },
      {
        path: '*',
        element: <h2>Page Not Found</h2>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
