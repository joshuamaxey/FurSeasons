import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUserSpots } from '../../store/spots'; // Adjust the import path as needed
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Import the modal
import styles from './ManageSpots.module.css';

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.spots.currentUserSpots);
  const status = useSelector((state) => state.spots.status);
  const error = useSelector((state) => state.spots.error);
  const sessionUser = useSelector((state) => state.session.user); // Get current user

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);
  const [csrfToken, setCsrfToken] = useState(''); // State for CSRF token

  useEffect(() => {
    if (!sessionUser) {
      navigate('/'); // Redirect to home if user is not logged in
    } else {
      dispatch(fetchCurrentUserSpots());
    }

    // Fetch CSRF token from server
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf/restore');
      const data = await response.json();
      setCsrfToken(data['XSRF-Token']);
    };

    fetchCsrfToken();
  }, [dispatch, sessionUser, navigate]);

  const handleDeleteClick = (spot) => {
    setSpotToDelete(spot);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/spots/${spotToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Include the CSRF token
        },
      });

      if (response.ok) {
        dispatch(fetchCurrentUserSpots()); // Refresh the spots list
      } else {
        console.error('Failed to delete spot');
      }
    } catch (error) {
      console.error('Error deleting spot:', error);
    }
    setShowDeleteModal(false);
    setSpotToDelete(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Spots</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && spots.length === 0 && (
        <div className={styles.noSpotsContainer}>
          <p>You have no spots.</p>
          <NavLink to="/spots/new" className={styles.createSpotButton}>
            Create a New Spot
          </NavLink>
        </div>
      )}
      {status === 'succeeded' && spots.length > 0 && (
        <div className={styles.spotsGrid}>
          {spots.map((spot) => (
            <div
              key={spot.id}
              className={styles.spotCard}
              onClick={() => navigate(`/spots/${spot.id}`)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/spots/${spot.id}`);
                }
              }}
            >
              <img src={spot.previewImage} alt={spot.name} className={styles.spotImage} />
              <div className={styles.spotInfo}>
                <div className={styles.spotLocation}>{spot.city}, {spot.state}</div>
                <div className={styles.spotRating}>⭐ {spot.avgRating}</div>
                <div className={styles.spotPrice}>${spot.price} / night</div>
              </div>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.updateButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/spots/${spot.id}/edit`);
                  }}
                >
                  Update
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(spot);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {status === 'failed' && <p>Error loading spots data: {error}</p>}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default ManageSpots;
