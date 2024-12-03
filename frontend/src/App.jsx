import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import * as sessionActions from './store/session';
import { useDispatch } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import Spots from "./components/Spots"
import SpotDetails from "./components/SpotDetails"

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
