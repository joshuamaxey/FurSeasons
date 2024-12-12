import { createStore, applyMiddleware, compose, combineReducers } from 'redux'; // 'compose' is a function to compose multiple store enhancers. combineReducers allows us to combine multiple reducers into a single reducer function.
import thunk from 'redux-thunk'; // thunk middleware allows us to handle asynchronous actions in Redux
import sessionReducer from './session'; // reducer to handle session-related state
import spotsReducer from './spots';
import reviewsReducer from './reviews';

const rootReducer = combineReducers({ // our rootReducer combines multiple reducers into a single reducer function.
  session: sessionReducer,
  spots: spotsReducer,
  reviews: reviewsReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk); // if the environment is production, apply ONLY the thunk middleware
} else {
  const logger = (await import("redux-logger")).default; // dynamically import redux-logger for use in dev environment
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger)); // use composeEnhancers to apply both thunk and logger with Redux DevTools (if available) in development environment.
}

const configureStore = (preloadedState) => { // create the Redux store with the provided preloadedState, enhancer, and rootReducer
  return createStore(rootReducer, preloadedState, enhancer);
};

//^ SUMMARY: Combine our reducers into a single root reducer. Configure middleware and enhancers based on the environment (production vs development). Create a Redux store with the root reducer, preloadedState, and enhancer. Then export the configureStore function for use in main.jsx.

export default configureStore;
