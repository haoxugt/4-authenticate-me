import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';

// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation';
import SpotsList from './components/SpotsList';
import SpotFormPage from './components/SpotFormPage';

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
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
