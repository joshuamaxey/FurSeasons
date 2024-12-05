import styles from './DeleteReviewModal.module.css';

const DeleteReviewModal = ({ onClose, onDelete }) => {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <h2>Are you sure you want to delete this review?</h2>
        <button onClick={onDelete}>Yes (Delete Review)</button>
        <button onClick={onClose}>No (Keep Review)</button>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
