// src/redux/store.js
import { createStore } from 'redux';

// Reducer mặc định
const initialState = {};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;