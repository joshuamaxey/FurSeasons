import { useState } from 'react';
import styles from './CreateReviewModal.module.css';

const CreateReviewModal = ({ onClose, onSubmit }) => {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (review.length < 10 || stars === 0) {
      setErrors(['Review must be at least 10 characters and a star rating must be selected.']);
      return;
    }
    try {
      await onSubmit({ review, stars });
    } catch (error) {
      setErrors([error.message]);
    }
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <h2>How was your stay?</h2>
        {errors.length > 0 && (
          <ul className={styles.errors}>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <textarea
            placeholder="Leave your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
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
            ))} <p className={styles.stars}>Stars</p>
          </div>
          <button type="submit" disabled={review.length < 10 || stars === 0} className={review.length < 10 || stars === 0 ? styles.disabledButton : ''}>
            Submit Your Review
          </button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateReviewModal;
