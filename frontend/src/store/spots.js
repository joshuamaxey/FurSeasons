// Action Types
const FETCH_SPOTS = 'spots/FETCH_SPOTS';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';
const SET_STATUS = 'spots/SET_STATUS';
const SET_ERROR = 'spots/SET_ERROR';

// Action Creators
const fetchSpotsAction = (spots) => ({
  type: FETCH_SPOTS,
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

const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
  spot,
});

const updateSpotAction = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

const deleteSpotAction = (id) => ({
  type: DELETE_SPOT,
  id,
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

// Reducer
const initialState = {
  spots: [],
  status: 'idle',
  error: null,
};

export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SPOTS:
      return { ...state, spots: action.spots };
    case SET_STATUS:
      return { ...state, status: action.status };
    case SET_ERROR:
      return { ...state, error: action.error };
    case CREATE_SPOT:
      return { ...state, spots: [...state.spots, action.spot] };
    case UPDATE_SPOT:
      return {
        ...state,
        spots: state.spots.map((spot) =>
          spot.id === action.spot.id ? action.spot : spot
        ),
      };
    case DELETE_SPOT:
      return {
        ...state,
        spots: state.spots.filter((spot) => spot.id !== action.id),
      };
    default:
      return state;
  }
}
