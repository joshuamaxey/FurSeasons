import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import * as sessionActions from './store/session';
import { useDispatch } from "react-redux";
import Navigation from "./components/Navigation/Navigation";
import Spots from "./components/Spots";
import SpotDetails from "./components/SpotDetails/SpotDetails";
import CreateSpotForm from "./components/CreateSpotForm";
import ManageSpots from "./components/ManageSpots";
import UpdateSpot from "./components/ManageSpots/UpdateSpot";
import ManageReviews from "./components/ManageReviews/ManageReviews";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false); // Here we define the isLoaded slice of state.

  useEffect(() => {
    // Inside our useEffect, we try to restore the user session. This loads our session data either with a logged-in user, or with no active user. Once we have restored the session data, we set isLoaded = true.
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      {/* We pass isLoaded into Navigation as a prop */}
      <Navigation isLoaded={isLoaded} />
      {/* Once isLoaded is true (after the user session has been restored), we render the Outlet component. */}
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
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />
      },
      {
        path: '/spots/manage',
        element: <ManageSpots />
      },
      {
        path: 'spots/:spotId/edit',
        element: <UpdateSpot />
      },
      {
        path: 'reviews/current',
        element: <ManageReviews />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
