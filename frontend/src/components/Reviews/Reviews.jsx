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

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/spots/${spotId}/reviews`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setReviews(data.Reviews);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf/restore');
      const data = await response.json();
      setCsrfToken(data['XSRF-Token']);
    };

    fetchCsrfToken();
  }, [spotId]); // Ensure fetchReviews is not included in the dependency array

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
      fetchReviews();
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
      fetchReviews();
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
      fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const userHasReviewed = reviews.some(review => review.userId === user?.id);
  const isOwner = user?.id === spotId; // Assuming the owner ID is same as spot ID

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.header}>
        <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
        <span className={styles.avgRating}>
          {reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length).toFixed(1) : 'No ratings yet'}
        </span>
        <span className={styles.numReviews}>({reviews.length} reviews)</span>
      </div>
      {user && !userHasReviewed && !isOwner && (
        <button className={styles.reviewButton} onClick={() => setShowCreateModal(true)}>
          Post Your Review
        </button>
      )}
      {showCreateModal && <CreateReviewModal onClose={() => setShowCreateModal(false)} onSubmit={handleReviewSubmit} />}
      {reviews.length > 0 ? (
        reviews.map(review => (
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
        <p>No reviews available for this spot.</p>
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
