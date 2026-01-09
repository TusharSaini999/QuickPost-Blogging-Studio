import { configureStore } from "@reduxjs/toolkit"
import TheamSlice from "../Feature/TheamMode";
import AuthSlice from "../Feature/Auth";
import ProfileSlice from "../Feature/Profile";
import PostSlice from "../Feature/Post";
import GobalSlice from "../Feature/GlobalPost";
const store = configureStore({
  reducer: {
    TheamSlice,
    AuthSlice,
    ProfileSlice,
    PostSlice,
    GobalSlice,
  }
});

export default store