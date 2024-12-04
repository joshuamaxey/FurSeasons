import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SpotDetails.module.css'; // Import CSS for styling

const SpotDetails = () => {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchSpotDetails();
  }, [spotId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!spot) {
    return <div>No spot data available.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.spotName}>{spot.name}</h1>
      <div className={styles.address}>{spot.address}, {spot.city}, {spot.state}, {spot.country}</div>
      <div className={styles.details}>
        <div className={styles.description}>{spot.description}</div>
        <div className={styles.price}>Price: ${spot.price} per night</div>
        <div className={styles.rating}>Average Rating: {spot.avgStarRating} ({spot.numReviews} reviews)</div>
      </div>
      <div className={styles.images}>
        {spot.SpotImages.map(image => (
          <img key={image.id} src={image.url} alt={`Spot Image ${image.id}`} className={styles.spotImage} />
        ))}
      </div>
      <div className={styles.ownerInfo}>
        <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
      </div>
    </div>
  );
};

export default SpotDetails;
