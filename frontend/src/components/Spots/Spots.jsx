import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots'; // Adjust the import path as needed
import styles from './Spots.module.css';

const Spots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate hook
  const spots = useSelector((state) => state.spots.spots);
  const status = useSelector((state) => state.spots.status);
  const error = useSelector((state) => state.spots.error);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`); // Navigate to spot details page
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Spots</h1>
      {status === 'loading' && <p>Loading...</p>}
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
              <img src={spot.previewImage} alt={spot.name} className={styles.spotImage} />
              <div className={styles.spotInfo}>
                <div className={styles.spotLocation}>{spot.city}, {spot.state}</div>
                <div className={styles.spotRating}>⭐ {spot.avgRating}</div>
                <div className={styles.spotPrice}>${spot.price} / night</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {status === 'failed' && <p>Error loading spots data: {error}</p>}
    </div>
  );
};

export default Spots;
