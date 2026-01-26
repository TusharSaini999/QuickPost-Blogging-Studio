import { combineReducers } from '@reduxjs/toolkit';

import TheamSlice from "./TheamMode.js";
import AuthSlice from "./Auth.js";
import ProfileSlice from "./Profile.js";
import PostSlice from "./Post.js";
import GobalSlice from "./GlobalPost.js";

const appReducer = combineReducers({
  TheamSlice,
  AuthSlice,
  ProfileSlice,
  PostSlice,
  GobalSlice
});

const RootReducer = (state, action) => {
  if (action.type === 'Auth/logout') {
    state = {
      TheamSlice: state.TheamSlice,
    };
  }
  return appReducer(state, action);
};

export default RootReducer;
