import styles from './DeleteConfirmationModal.module.css'; // Create and adjust CSS as needed

const DeleteConfirmationModal = ({ onClose, onConfirm }) => {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this spot?</p>
        <div className={styles.buttonContainer}>
          <button className={styles.confirmButton} onClick={onConfirm}>Yes (Delete Spot)</button>
          <button className={styles.cancelButton} onClick={onClose}>No (Keep Spot)</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
