import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import databaseService from "../Appwrite/databases";

const initialState = {
    InitialReq: false,
    posts: {},
    cursor: null,
    loading: false,
    error: null,
    searchpost: {},
    searchcursor: null,
};

export const fetchGlobalPosts = createAsyncThunk(
    "GobalSlice/fetchGlobalPosts",
    async (payload, { rejectWithValue }) => {
        try {
            console.log("it is hist", payload)
            const res = await databaseService.getPublicPosts(payload);
            console.log("Global Post", res);
            if (!res.success) {
                return rejectWithValue(res.message);
            }

            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
// export const searchGlobalPosts = createAsyncThunk(
//     "GobalSlice/searchGlobalPosts",
//     async (payload, { rejectWithValue }) => {
//         try {
//             const res = await databaseService.getPublicPosts(payload);

//             if (!res.success) {
//                 return rejectWithValue(res.message);
//             }

//             return res;
//         } catch (err) {
//             return rejectWithValue(err.message);
//         }
//     }
// );

const GobalSlice = createSlice({
    name: "GlobalPost",
    initialState,
    reducers: {
        clearSearchPosts: (state) => {
            state.searchpost = {};
            state.searchcursor = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGlobalPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGlobalPosts.fulfilled, (state, action) => {
                if (action.payload?.searchmode) {
                    for (const post of action.payload?.list) {
                        if (!state.searchpost[post.$id]) {
                            state.searchpost[post.$id] = post;
                        }
                    }
                    state.searchcursor = action.payload.lastId;
                } else {
                    for (const post of action.payload?.list) {
                        if (!state.posts[post.$id]) {
                            state.posts[post.$id] = post;
                        }
                    }
                    state.InitialReq = true;
                    state.cursor = action.payload.lastId;
                }
                state.loading = false;
            })
            .addCase(fetchGlobalPosts.rejected, (state, action) => {
                state.error = action.payload?.message;
                state.loading = false;
            })
        //         .addCase(searchGlobalPosts.pending,(state,action)=>{
        //             state.loading = true;
        //             state.error = null;
        //         })
        //         .addCase(searchGlobalPosts.fulfilled,(state,action)=>{

        //         })
        //         .addCase(searchGlobalPosts.rejected, (state, action) => {
        //             state.error = action.payload?.message;
        //             state.loading = false;
        //         })
    },
});

export const { resetGlobalPosts,clearSearchPosts } = GobalSlice.actions;
export default GobalSlice.reducer;
