import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsBySpotId } from '../../store/reviews';
import styles from './SpotDetails.module.css';
import Reviews from '../Reviews/Reviews';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reviews = useSelector((state) => state.reviews[spotId] || []);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length).toFixed(1)
    : 'New';
  const numReviews = reviews.length;

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${spotId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSpot(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    dispatch(fetchReviewsBySpotId(spotId));
    fetchSpotDetails();
  }, [dispatch, spotId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!spot) {
    return <div>No spot data available.</div>;
  }

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
              {avgRating}
            </span>
            {numReviews > 0 && (
              <span className={styles.numReviews}>• ({formatReviewCount(numReviews)})</span>
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
