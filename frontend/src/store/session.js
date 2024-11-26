import { csrfFetch } from "./csrf"; // This is a custom fetch function that attaches the CSRF token to the request

// These are action-type constants that make it easier to define actions and help to prevent typose and syntax errors concerning actions
const SET_USER = "session/setUser"; // This action type is used to set the user in the Redux store
const REMOVE_USER = "session/removeUser"; // This action is used to remove the user from the Redux store

// This is an action creator that returns an action with the type SET_USER and a payload containing the user data.
const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    };
};

// This is an action creator that returns an action with the type REMOVE_USER
const removeUser = () => {
    return {
        type: REMOVE_USER
    };
};

//! login, restoreUser, and logout

// This is a thunk action creator which allows for asynchronous logic in action creators.
export const login = (user) => async (dispatch) => { // our login thunk takes a 'user' object as an argument (which contains a 'credential' (username/email) and 'password')
    const { credential, password } = user; // use destructuring to extract the credential and password from the user object
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password
        })
    });
    //^ Send a post request to '/api/session' with the user credentials
    const data = await response.json(); // await the response to the POST request, then parse it as JSON
    dispatch(setUser(data.user)); // dispatch the setUser action with the user data from the response
    return response; // return the response for further use if necessary
};

//* Credentials for logging in:
// email: demo@user.io
// password: password

// This is a thunk action creator for restoring the user session
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

// test logout route for loggin out via action in the devTools
export const logout = () => async (dispatch) => {
    const response = await csrfFetch("/api/session", {
        method: "DELETE",
    })
    dispatch(removeUser());
    return response;
}

//* dispatch logout action from devTools:
// window.store.dispatch(window.sessionActions.logout());

//! Signup

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password
        })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

//! Reducer

const initialState = { user: null }; // By default, our 'user' state is null (when there is no session user)

const sessionReducer = (state = initialState, action) => { // Our session reducer function will handle state changes based on dispatched actions
    switch (action.type) { // We use a switch/case statement to update the state based on the provided action type
        case SET_USER: // update the state with the user data from the action payload
            return { ...state, user: action.payload };
        case REMOVE_USER: // Resets the user state to 'null'
            return { ...state, user: null };
        default: // returns the current state unchanged if the action type does not match any of the cases
            return state;
    }
};

//^ Summary: We define the constants for our action types. Create actions to set or remove the user. Create a thunk action creator to handle asynchronous logic for logging in a user and dispatching actions. Define the initial state of the session. Create our reducer to manage state changes based on dispatched actions. Export the reducer for use in the Redux store within combineReducers.

export default sessionReducer;
