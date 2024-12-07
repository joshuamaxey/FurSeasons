import styles from './DeleteReviewModal.module.css';

const DeleteReviewModal = ({ onClose, onDelete }) => {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <h2 className={styles.confirmDelete}>Confirm Delete</h2>
        <h4 className={styles.message}>Are you sure you want to delete this review?</h4>
        <button onClick={onDelete} className={styles.yes}>Yes (Delete Review)</button>
        <button onClick={onClose} className={styles.no}>No (Keep Review)</button>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
