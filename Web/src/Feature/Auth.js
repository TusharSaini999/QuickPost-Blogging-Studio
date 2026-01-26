import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import { createPost, deletePost, updatePost ,getPost} from './Post';

const initialState = {
    status: false,
    userData: null,
    check: false,
    historyPrefs: null,
    deletePrefs: null,
    editPrefs: null
};
export const loginAndFetchPosts = createAsyncThunk(
  'Auth/loginAndFetchPosts',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(login(userData)); // update auth state
      dispatch(getPost({ userId: userData.$id, defaults: true })).unwrap();
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const AuthSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
            state.check = true;
        },
        logout: (state, action) => {
            state.status = false;
            state.userData = null;
            state.check = action.payload.value;
        },
        updateEmail: (state) => {
            state.userData.emailVerification = true;
        },
        updateName: (state, action) => {
            state.userData.name = action.payload;
        },
        updatePrefs: (state, action) => {
            state.historyPrefs = state.userData.prefs;
            state.userData.prefs = action.payload;
        },
        removePostCount: (state, action) => {
            state.deletePrefs = state.userData.prefs;
            state.userData.prefs = action.payload;
        },
        updateEditPrefs:(state,action)=>{
            state.editPrefs=state.userData.prefs;
            state.userData.prefs=action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.fulfilled, (state) => {
                state.historyPrefs = null;
            })
            .addCase(createPost.rejected, (state) => {
                state.userData.prefs = state.historyPrefs;
                state.historyPrefs = null;
            })
            .addCase(deletePost.fulfilled, (state) => {
                state.deletePrefs = null;
            })
            .addCase(deletePost.rejected, (state) => {
                state.userData.prefs = state.historyPrefs;
                state.deletePrefs = null;
            })
            .addCase(updatePost.fulfilled, (state) => {
                state.editPrefs = null;
            })
            .addCase(updatePost.rejected, (state) => {
                state.userData.prefs = state.editPrefs;
                state.editPrefs = null;
            })
    }
});

export const { login, logout, updateEmail, updateName, updatePrefs, removePostCount,updateEditPrefs } = AuthSlice.actions;
export default AuthSlice.reducer;
