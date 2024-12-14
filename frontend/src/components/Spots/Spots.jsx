import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots'; // import the fetchSpots method from the spots state in the Redux store
import styles from './Spots.module.css';

const Spots = () => {
  const dispatch = useDispatch(); // used to dispatch actions to the Redux store
  const navigate = useNavigate(); // Used to navigate to different routes
  // useSelector is used to select data from the Redux store
  const spots = useSelector((state) => state.spots.spots); // select the list of spots from the Redux state
  const status = useSelector((state) => state.spots.status); // Selects the status of the spots loading process from the Redux state
  const error = useSelector((state) => state.spots.error); // Selects error messages related to loading spots from the Redux state

  // This useEffect will fetch the spots data when the component mounts
  useEffect(() => {
    dispatch(fetchSpots()); // dispatch the action to fetch the spots from the backend.
  }, [dispatch]);

  // When we click on a certain tile, navigate to that spot's detail page
  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  // Here we format the 'rating' of each spot to one decimal place (since we want the rating always displayed as a decimal, even if it is a whole number). Also, set the rating to "New" if there are no ratings.
  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'New';
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Spots</h1>
      {/* Check to see if all of the spots are loaded. if NOT (if the status is still 'loading'), display "Loading..." instead of an error message */}
      {status === 'loading' && <p>Loading...</p>}
      {/* Once the spots have been successfully fetched, map through them and display them as tiles on the page. */}
      {status === 'succeeded' && (
        <div className={styles.spotsGrid}>
          {spots.map((spot) => (
            <div
              key={spot.id}
              className={styles.spotCard}
              onClick={() => handleTileClick(spot.id)}
              style={{ cursor: 'pointer' }} // Change pointer to cursor on hover
              title={spot.name} // Display tooltip on hover
            >
              {/* Display spot data (minus the specific address of the spot) */}
              <img src={spot.previewImage} alt={spot.name} className={styles.spotImage} />
              <div className={styles.spotInfo}>
                <div className={styles.spotLocation}>{spot.city}, {spot.state}</div>
                {/* use WIN+. to insert emojis directly into code */}
                <div className={styles.spotRating}>⭐ {formatRating(spot.avgRating)}</div>
                <div className={styles.spotPrice}><strong>${spot.price}</strong> night</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* If we fail to load the spots for some reason, show this message and the relevant error*/}
      {status === 'failed' && <p>Error loading spots data: {error}</p>}
    </div>
  );
};

export default Spots;
