import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots'; // Adjust the import path as needed
import styles from './Spots.module.css';

const Spots = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);
  const status = useSelector((state) => state.spots.status);
  const error = useSelector((state) => state.spots.error);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Spots</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && (
        <div className={styles.spotsGrid}>
          {spots.map((spot) => (
            <div key={spot.id} className={styles.spotCard}>
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
