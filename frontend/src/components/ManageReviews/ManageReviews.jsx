import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './ManageReviews.module.css';
import UpdateReviewModal from '../Reviews/UpdateReviewModal';
import DeleteReviewModal from '../Reviews/DeleteReviewModal';

const ManageReviews = () => {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToUpdate, setReviewToUpdate] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews/current', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch reviews');
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
  }, [dispatch]);

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

      if (!response.ok) throw new Error('Failed to update review');

      const updatedReview = await response.json();
      setReviews(reviews.map(review => (review.id === reviewToUpdate.id ? updatedReview : review)));
      setShowUpdateModal(false);
      setReviewToUpdate(null);
      fetchReviews(); // Fetch reviews again to update spot names
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

      if (!response.ok) throw new Error('Failed to delete review');

      setReviews(reviews.filter(review => review.id !== reviewToDelete.id));
      setShowDeleteModal(false);
      setReviewToDelete(null);
      fetchReviews(); // Fetch reviews again to update spot names
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.manageReviewsContainer}>
      <h1>Manage Reviews</h1>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className={styles.review}>
            <h2>{review.Spot?.name || 'Loading...'}</h2>
            <p>{new Date(review.createdAt).toLocaleDateString()}</p>
            <p>{review.review}</p>
            <button className={styles.updateButton}
              onClick={() => {
                setReviewToUpdate(review);
                setShowUpdateModal(true);
              }}
            >
              Update
            </button>
            <button className={styles.deleteButton}
              onClick={() => {
                setReviewToDelete(review);
                setShowDeleteModal(true);
              }}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
      {showUpdateModal && (
        <UpdateReviewModal
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleReviewUpdate}
          review={reviewToUpdate}
          spotName={reviewToUpdate.Spot?.name || 'Loading...'}
        />
      )}
      {showDeleteModal && (
        <DeleteReviewModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleReviewDelete}
        />
      )}
    </div>
  );
};

export default ManageReviews;
