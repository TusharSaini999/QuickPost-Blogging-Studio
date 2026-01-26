import { configureStore } from "@reduxjs/toolkit"
import RootReducer from "../Feature/rootReducer";
const store = configureStore({
  reducer: RootReducer
});

export default store