import { configureStore } from "@reduxjs/toolkit"
import TheamSlice from "../Feature/TheamMode";
import AuthSlice from "../Feature/Auth";
import ProfileSlice from "../Feature/Profile"
import PostSlice from "../Feature/Post"
const store = configureStore({
  reducer: {
    TheamSlice,
    AuthSlice,
    ProfileSlice,
    PostSlice
  }
});

export default store