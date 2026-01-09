import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import databaseService from "../Appwrite/databases";

const initialState = {
    InitialReq:false,
    posts: {},
    cursor: null,
    loading: false,
    error: null,
};

export const fetchGlobalPosts = createAsyncThunk(
    "GobalSlice/fetchGlobalPosts",
    async (payload, { rejectWithValue }) => {
        try {
            console.log("it is hist")
            const res = await databaseService.getPublicPosts(payload);

            if (!res.success) {
                return rejectWithValue(res.message);
            }

            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const GobalSlice = createSlice({
    name: "GlobalPost",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGlobalPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGlobalPosts.fulfilled, (state, action) => {
                for (const post of action.payload?.list) {
                    if (!state.posts[post.$id]) {
                        state.posts[post.$id] = post;
                    }
                }
                state.InitialReq=true;
                state.cursor=action.payload.lastId;
                state.loading = false;
            })
            .addCase(fetchGlobalPosts.rejected, (state, action) => {
                state.error = action.payload?.message;
                state.loading = false;
            });
    },
});

export const { resetGlobalPosts } = GobalSlice.actions;
export default GobalSlice.reducer;
