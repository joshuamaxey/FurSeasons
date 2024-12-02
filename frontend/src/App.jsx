import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import * as sessionActions from './store/session';
import { useDispatch } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import SplashPage from "./components/SplashPage";

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
        element: <SplashPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
