import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SpotDetails.module.css';
import Reviews from '../Reviews/Reviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const SpotDetails = () => {
  const { spotId } = useParams(); // get the spotId from the route parameters
  // useState manages the local state for spot, loading, and error
  const [spot, setSpot] = useState(null); // initializes 'spot' to null and provides a function to update it.
  const [loading, setLoading] = useState(true); // initializes 'loading' to true and provides a function for updating it.
  const [error, setError] = useState(null); // initializes error to null and provides a function to update it.

  useEffect(() => {
    // Here we fetch the spot details when the component mounts or when spotId changes. fetchSpotDetails is an asynchronous function that fetches data from the backend using the spotId
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${spotId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // If the fetch request is successful, we set the spot state with the retrieved data and update loading to 'false'
        const data = await response.json();
        setSpot(data);
        setLoading(false);
        console.log('Spot data:', data);
        // If there are errors, we set the error state and update loading to 'false.'
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSpotDetails();
  }, [spotId]);

  // If we are still loading data, display 'Loading'
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there were issues fetching fetching the spot, display the relevant error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If the spot doesn't exist, display a message
  if (!spot) {
    return <div>No spot data available.</div>;
  }

  // Here we create a function to format our reviews. If there is 1 review, the 'review' will be singular. If there are more, it will be plural. If there are no reviews, we show "New" instead of the review count.
  const formatReviewCount = (numReviews) => {
    if (numReviews === 1) {
      return '1 review';
    } else if (numReviews > 1) {
      return `${numReviews} reviews`;
    }
    return 'New';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.spotName}>{spot.name}</h1>
      <div className={styles.address}>{spot.city}, {spot.state}, {spot.country}</div>
      <div className={styles.images}>
        {spot.SpotImages && spot.SpotImages.length > 0 ? (
          spot.SpotImages.map((image, index) => (
            <img
              key={image.id}
              className={classNames(styles.spotImage, styles[`spotImage-${index}`])}
              src={image.url}
              alt={`Spot Image ${image.id}`}
              onLoad={() => console.log(`Loaded image ${index + 1}: ${image.url}`)}
              onError={(e) => {
                console.error(`Failed to load image ${index + 1}: ${image.url}`);
                console.log('Error event:', e);
              }}
            />
          ))
        ) : (
          <div>No images available.</div>
        )}
      </div>
      <div className={styles.ownerInfo}>
        <div className={styles.details}>
          <h2 id={styles.host}>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <div className={styles.description}>{spot.description}</div>
        </div>
        <div className={styles.priceAndRating}>
          <div className={styles.price}>${spot.price} night</div>
          <div className={styles.rating}>
            <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
            <span className={styles.avgRating}>
              {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : 'New'}
            </span>
            {spot.numReviews > 0 && (
              <span className={styles.numReviews}>• ({formatReviewCount(spot.numReviews)})</span>
            )}
          </div>
        <button className={styles.reserveButton} onClick={() => alert('Feature coming soon')}>
          Reserve
        </button>
        </div>
      </div>
      <hr></hr>
      <Reviews />
    </div>
  );
};

export default SpotDetails;
