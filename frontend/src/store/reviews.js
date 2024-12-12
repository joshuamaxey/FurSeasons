// frontend/src/store/reviews.js

const GET_REVIEWS_BY_SPOT_ID = 'reviews/GET_REVIEWS_BY_SPOT_ID';
const SET_REVIEWS = 'reviews/SET_REVIEWS';

// Action Creators
const getReviewsBySpotId = (reviews, spotId) => ({
  type: GET_REVIEWS_BY_SPOT_ID,
  reviews,
  spotId,
});

// const setReviews = (reviews, spotId) => ({
//   type: SET_REVIEWS,
//   reviews,
//   spotId,
// });

// Thunk Action Creator
export const fetchReviewsBySpotId = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getReviewsBySpotId(data.Reviews, spotId));
    return data;
  }
};

// Reducer
const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS_BY_SPOT_ID:
    case SET_REVIEWS: // Handle the new action type
      return {
        ...state,
        [action.spotId]: action.reviews,
      };
    default:
      return state;
  }
};

export default reviewsReducer;
