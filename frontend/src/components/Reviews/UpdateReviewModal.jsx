import { useState } from 'react';
import styles from './UpdateReviewModal.module.css';

const UpdateReviewModal = ({ onClose, onSubmit, review, spotName }) => {
  const [updatedReview, setUpdatedReview] = useState(review.review);
  const [stars, setStars] = useState(review.stars);
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updatedReview.length < 10 || stars === 0) {
      setErrors(['Review must be at least 10 characters and a star rating must be selected.']);
      return;
    }
    onSubmit({ review: updatedReview, stars });
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <h2>{spotName}</h2>
        {errors.length > 0 && (
          <ul className={styles.errors}>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            placeholder="Share your experience..."
            value={updatedReview}
            onChange={(e) => setUpdatedReview(e.target.value)}
            required
          />
          <div className={styles.starRating}>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={index < stars ? styles.filledStar : styles.emptyStar}
                onClick={() => setStars(index + 1)}
              >
                ★
              </span>
            ))}
          </div>
          <button type="submit" disabled={updatedReview.length < 10 || stars === 0}>
            Update Your Review
          </button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateReviewModal;
