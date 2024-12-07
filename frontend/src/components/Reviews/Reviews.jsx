import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Reviews.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import CreateReviewModal from './CreateReviewModal';
import DeleteReviewModal from './DeleteReviewModal';
import UpdateReviewModal from './UpdateReviewModal';

const Reviews = () => {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reviewToUpdate, setReviewToUpdate] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  const user = useSelector((state) => state.session.user);

  const fetchSpotAndReviews = async () => {
    try {
      const spotResponse = await fetch(`/api/spots/${spotId}`);
      if (!spotResponse.ok) throw new Error('Network response was not ok');
      const spotData = await spotResponse.json();
      setSpot(spotData);

      const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);
      if (!reviewsResponse.ok) throw new Error('Network response was not ok');
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData.Reviews);

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpotAndReviews();
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf/restore');
      const data = await response.json();
      setCsrfToken(data['XSRF-Token']);
    };

    fetchCsrfToken();
  }, [spotId]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await fetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setReviews([...reviews, data]);
      setShowCreateModal(false);
      fetchSpotAndReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleReviewUpdate = async (reviewData) => {
    try {
      const response = await fetch(`/api/reviews/${reviewToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const updatedReview = await response.json();
      setReviews(reviews.map(review => (review.id === reviewToUpdate.id ? updatedReview : review)));
      setShowUpdateModal(false);
      setReviewToUpdate(null);
      fetchSpotAndReviews();
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleReviewDelete = async () => {
    try {
      const response = await fetch(`/api/reviews/${reviewToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');

      setReviews(reviews.filter(review => review.id !== reviewToDelete.id));
      setShowDeleteModal(false);
      setReviewToDelete(null);
      fetchSpotAndReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const userHasReviewed = reviews.some(review => review.userId === user?.id);
  const isOwner = spot?.ownerId === user?.id; // Check if the user is the owner of the spot

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Sort reviews to display newest first
  const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const showBeTheFirst = user && !userHasReviewed && !isOwner && reviews.length === 0;

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.header}>
        <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
        <span className={styles.avgRating}>
          {reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length).toFixed(1) : 'No ratings yet'} •
        </span>
        <span className={styles.numReviews}>({reviews.length} reviews)</span>
      </div>
      {user && !userHasReviewed && !isOwner && (
        <button className={styles.reviewButton} onClick={() => setShowCreateModal(true)}>
          Post Your Review
        </button>
      )}
      {showBeTheFirst && (
        <p className={styles.beTheFirst}>Be the first to post a review!</p>
      )}
      {showCreateModal && <CreateReviewModal onClose={() => setShowCreateModal(false)} onSubmit={handleReviewSubmit} />}
      {sortedReviews.length > 0 ? (
        sortedReviews.map(review => (
          <div key={review.id} className={styles.review}>
            <h3>{review.User?.firstName || 'Loading...'}</h3>
            <p className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</p>
            <p className={styles.reviewBody}>{review.review}</p>
            {review.userId === user?.id && (
              <>
                <button
                  onClick={() => {
                    setReviewToUpdate(review);
                    setShowUpdateModal(true);
                  }}
                >
                  Update
                </button>
                <button onClick={() => {
                  setReviewToDelete(review);
                  setShowDeleteModal(true);
                }}>Delete</button>
              </>
            )}
          </div>
        ))
      ) : (
        !showBeTheFirst && <p>No reviews available for this spot.</p>
      )}
      {showDeleteModal && (
        <DeleteReviewModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleReviewDelete}
        />
      )}
      {showUpdateModal && (
        <UpdateReviewModal
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleReviewUpdate}
          review={reviewToUpdate}
          spotName="How was your stay?"
        />
      )}
    </div>
  );
};

export default Reviews;
