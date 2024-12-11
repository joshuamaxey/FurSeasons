// Action Types
const FETCH_SPOTS = 'spots/FETCH_SPOTS';
const FETCH_CURRENT_USER_SPOTS = 'spots/FETCH_CURRENT_USER_SPOTS';
const SET_STATUS = 'spots/SET_STATUS';
const SET_ERROR = 'spots/SET_ERROR';

// Action Creators
const fetchSpotsAction = (spots) => ({
  type: FETCH_SPOTS,
  spots,
});

const fetchCurrentUserSpotsAction = (spots) => ({
  type: FETCH_CURRENT_USER_SPOTS,
  spots,
});

const setStatusAction = (status) => ({
  type: SET_STATUS,
  status,
});

const setErrorAction = (error) => ({
  type: SET_ERROR,
  error,
});

// Thunks
export const fetchSpots = () => async (dispatch) => {
  dispatch(setStatusAction('loading'));
  try {
    const response = await fetch('/api/spots');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    dispatch(fetchSpotsAction(data.Spots));
    dispatch(setStatusAction('succeeded'));
  } catch (err) {
    dispatch(setErrorAction(err.message));
    dispatch(setStatusAction('failed'));
  }
};

export const fetchCurrentUserSpots = () => async (dispatch) => {
  dispatch(setStatusAction('loading'));
  try {
    const response = await fetch('/api/spots/current', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    dispatch(fetchCurrentUserSpotsAction(data.Spots));
    dispatch(setStatusAction('succeeded'));
  } catch (err) {
    dispatch(setErrorAction(err.message));
    dispatch(setStatusAction('failed'));
  }
};

// Reducer
const initialState = {
  spots: [],
  currentUserSpots: [],
  status: 'idle',
  error: null,
};

export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SPOTS:
      return { ...state, spots: action.spots };
    case FETCH_CURRENT_USER_SPOTS:
      return { ...state, currentUserSpots: action.spots };
    case SET_STATUS:
      return { ...state, status: action.status };
    case SET_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
