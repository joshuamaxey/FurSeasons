// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import styles from './Reviews.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar } from '@fortawesome/free-solid-svg-icons';
// import CreateReviewModal from './CreateReviewModal';
// import DeleteReviewModal from './DeleteReviewModal';
// import UpdateReviewModal from './UpdateReviewModal';

// const Reviews = () => {
//   const { spotId } = useParams();
//   const [spot, setSpot] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [reviewToDelete, setReviewToDelete] = useState(null);
//   const [reviewToUpdate, setReviewToUpdate] = useState(null);
//   const [csrfToken, setCsrfToken] = useState('');

//   const user = useSelector((state) => state.session.user);

//   // Here we define a function to get the spot, and the reviews for that spot, using the spotId
//   const fetchSpotAndReviews = async () => {
//     try {
//       const spotResponse = await fetch(`/api/spots/${spotId}`);
//       if (!spotResponse.ok) throw new Error('Network response was not ok');
//       const spotData = await spotResponse.json();
//       setSpot(spotData);

//       const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);
//       if (!reviewsResponse.ok) throw new Error('Network response was not ok');
//       const reviewsData = await reviewsResponse.json();
//       setReviews(reviewsData.Reviews);

//       setLoading(false);
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   // Fetch the spot and reviews, then fetch the CSRF token.
//   useEffect(() => {
//     fetchSpotAndReviews();
//     const fetchCsrfToken = async () => {
//       const response = await fetch('/api/csrf/restore');
//       const data = await response.json();
//       setCsrfToken(data['XSRF-Token']);
//     };

//     fetchCsrfToken();
//   }, [spotId]);

//   // Here we use the information provided in the review modal to send a POST request to the backend for creating a new review in the database.
//   const handleReviewSubmit = async (reviewData) => {
//     try {
//       const response = await fetch(`/api/spots/${spotId}/reviews`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRF-Token': csrfToken,
//         },
//         body: JSON.stringify(reviewData),
//       });

//       // If our request is unsuccessful, throw an error.
//       if (!response.ok) throw new Error('Network response was not ok');

//       // Otherwise we submit the review and close the modal.
//       const data = await response.json();
//       setReviews([...reviews, data]);
//       setShowCreateModal(false);
//       fetchSpotAndReviews();
//     } catch (error) {
//       console.error('Failed to submit review:', error);
//     }
//   };

//   // Here we send a PUT request to the backend route using the review's id in order to update the given review.
//   const handleReviewUpdate = async (reviewData) => {
//     try {
//       const response = await fetch(`/api/reviews/${reviewToUpdate.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRF-Token': csrfToken,
//         },
//         body: JSON.stringify(reviewData),
//       });

//       // Throw an error if the update fails
//       if (!response.ok) throw new Error('Network response was not ok');

//       // Otherwise update the review and close the modal.
//       const updatedReview = await response.json();
//       setReviews(reviews.map(review => (review.id === reviewToUpdate.id ? updatedReview : review)));
//       setShowUpdateModal(false);
//       setReviewToUpdate(null);
//       fetchSpotAndReviews();
//     } catch (error) {
//       console.error('Failed to update review:', error);
//     }
//   };

//   // Here we send a DELETE request to the backend route for deleting a review using the review's id.
//   const handleReviewDelete = async () => {
//     try {
//       const response = await fetch(`/api/reviews/${reviewToDelete.id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRF-Token': csrfToken,
//         },
//       });

//       // If the deletion fails, throw an error
//       if (!response.ok) throw new Error('Network response was not ok');

//       // Otherwise delete the review and close the modal.
//       setReviews(reviews.filter(review => review.id !== reviewToDelete.id));
//       setShowDeleteModal(false);
//       setReviewToDelete(null);
//       fetchSpotAndReviews();
//     } catch (error) {
//       console.error('Failed to delete review:', error);
//     }
//   };

//   const userHasReviewed = reviews.some(review => review.userId === user?.id); // Check if the user has already reviewed the current spot by checking if any of the reviews have the user'd id.
//   const isOwner = spot?.ownerId === user?.id; // Check if the user is the owner of the spot.

//   if (loading) return <div>Loading...</div>; // If we're still loading data, show 'Loading...'
//   if (error) return <div>Error: {error}</div>; // If there's an error loading data, throw a message with the relevant error

//   // Sort reviews to display newest first
//   const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort the reivews in order from oldest (bottom) to newest (top)

//   const showBeTheFirst = user && !userHasReviewed && !isOwner && reviews.length === 0; // If the current user is not the owner of the spot, and if they have not already posted a review, and there are no reviews, we will use this variable to show 'Be the first to leave a review' instead of empty space.

//   // Helper function to format the review count display
//   const formatReviewCount = (numReviews) => {
//     if (numReviews === 1) {
//       return '1 review';
//     } else if (numReviews > 1) {
//       return `${numReviews} reviews`;
//     }
//     return 'No reviews';
//   };

//   return (
//     <div className={styles.reviewsContainer}>
//       <div className={styles.header}>
//         <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
//         <span className={styles.avgRating}>
//           {reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length).toFixed(1) : 'No ratings yet'} •
//         </span>
//         <span className={styles.numReviews}>({formatReviewCount(reviews.length)})</span>
//       </div>
//       {user && !userHasReviewed && !isOwner && (
//         <button className={styles.reviewButton} onClick={() => setShowCreateModal(true)}>
//           Post Your Review
//         </button>
//       )}
//       {showBeTheFirst && (
//         <p className={styles.beTheFirst}>Be the first to post a review!</p>
//       )}
//       {showCreateModal && <CreateReviewModal onClose={() => setShowCreateModal(false)} onSubmit={handleReviewSubmit} />}
//       {sortedReviews.length > 0 ? (
//         sortedReviews.map(review => (
//           <div key={review.id} className={styles.review}>
//             <h3>{review.User?.firstName || 'Loading...'}</h3>
//             <p className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</p>
//             <p className={styles.reviewBody}>{review.review}</p>
//             {review.userId === user?.id && (
//               <>
//                 <button className={styles.updateButton}
//                   onClick={() => {
//                     setReviewToUpdate(review);
//                     setShowUpdateModal(true);
//                   }}
//                 >
//                   Update
//                 </button>
//                 <button className={styles.deleteButton} onClick={() => {
//                   setReviewToDelete(review);
//                   setShowDeleteModal(true);
//                 }}>Delete</button>
//               </>
//             )}
//           </div>
//         ))
//       ) : (
//         !showBeTheFirst && <p>No reviews available for this spot.</p>
//       )}
//       {showDeleteModal && (
//         <DeleteReviewModal
//           onClose={() => setShowDeleteModal(false)}
//           onDelete={handleReviewDelete}
//         />
//       )}
//       {showUpdateModal && (
//         <UpdateReviewModal
//           onClose={() => setShowUpdateModal(false)}
//           onSubmit={handleReviewUpdate}
//           review={reviewToUpdate}
//           spotName="How was your stay?"
//         />
//       )}
//     </div>
//   );
// };

// export default Reviews;

//! ----------------------------------------------------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviewsBySpotId } from '../../store/reviews'; // Import the action
import styles from './Reviews.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import CreateReviewModal from './CreateReviewModal';
import DeleteReviewModal from './DeleteReviewModal';
import UpdateReviewModal from './UpdateReviewModal';

const Reviews = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  const reviews = useSelector((state) => state.reviews[spotId] || []);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reviewToUpdate, setReviewToUpdate] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots[spotId]); // Fetch the spot info from the Redux state

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf/restore');
      const data = await response.json();
      setCsrfToken(data['XSRF-Token']);
    };

    dispatch(fetchReviewsBySpotId(spotId));
    fetchCsrfToken();
    setLoading(false);
  }, [dispatch, spotId]);

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

      await dispatch(fetchReviewsBySpotId(spotId)); // Fetch updated reviews after submitting a new review
      setShowCreateModal(false);
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

      await dispatch(fetchReviewsBySpotId(spotId)); // Fetch updated reviews after updating a review
      setShowUpdateModal(false);
      setReviewToUpdate(null);
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

      await dispatch(fetchReviewsBySpotId(spotId)); // Fetch updated reviews after deleting a review
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const userHasReviewed = reviews.some(review => review.userId === user?.id);
  const isOwner = spot?.ownerId === user?.id;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const showBeTheFirst = user && !userHasReviewed && !isOwner && reviews.length === 0;

  const formatReviewCount = (numReviews) => {
    if (numReviews === 1) {
      return '1 review';
    } else if (numReviews > 1) {
      return `${numReviews} reviews`;
    }
    return 'No reviews';
  };

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.header}>
        <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
        <span className={styles.avgRating}>
          {reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length).toFixed(1) : 'No ratings yet'} •
        </span>
        <span className={styles.numReviews}>({formatReviewCount(reviews.length)})</span>
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
