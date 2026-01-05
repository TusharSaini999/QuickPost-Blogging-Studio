import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import databaseService from "../Appwrite/databases";

const initialState = {
    AllPost: {},
    PublicPost: {},
    PrivatePost: {},
    DraftPost: {},
    HistoryData: {},
    getloading: true,
    error: null,
    getStatus: null,
    historyDataOfPrifs: {},
    createStatus: null,
    EditHistory: {},
};
export const getPost = createAsyncThunk(
    "Post/getPost",
    async (payload, { rejectWithValue }) => {
        try {
            let data = await databaseService.getAllTypePost({ userId: payload });
            if (data.success) {
                return data;
            }
            else {
                return rejectWithValue("Server Error");
            }
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

export const createPost = createAsyncThunk(
    "post/createPost",
    async (payload, { rejectWithValue }) => {
        try {
            let data = await databaseService.createPost(payload);
            if (data.success) {
                console.log(data);
                return data;
            } else {
                return rejectWithValue({
                    errorMessage: data.message,
                    id: payload.documnetId
                });
            }
        } catch (error) {
            console.log(error);
            return rejectWithValue({
                errorMessage: error.message,
                id: payload.documnetId
            });
        }
    }
);

export const deletePost = createAsyncThunk(
    "Post/deletePost",
    
    async (payload, { rejectWithValue }) => {
        try {
            let data = await databaseService.deletePost(payload);
            if (data.success) {
                console.log(data);
                return {
                    res: data,
                    id: payload.documnetId
                };
            } else {
                return rejectWithValue({
                    errorMessage: data.message,
                    id: payload.documnetId,
                    status: payload.status,
                    visibility: payload.visibility
                });
            }
        } catch (error) {
            console.log(error);
            return rejectWithValue({
                errorMessage: error.message,
                id: payload.documnetId,
                status: payload.status,
                visibility: payload.visibility
            });
        }
    }
);
export const updatePost = createAsyncThunk(
    "Post/updatePost",
    async (payload, { rejectWithValue }) => {
        try {
            let data = await databaseService.updatePost(payload);
            if (data.success) {
                console.log(data);
                return {
                    res: data,
                    id:payload.$id
                };
            } else {
                return rejectWithValue({
                    errorMessage: data.message,
                    id: payload.$id
                });
            }
        } catch (error) {
            console.log(error);
            return rejectWithValue({
                errorMessage: error.message,
                id: payload.documnetId
            });
        }
    }
);

const PostSlice = createSlice({
    name: "Post",
    initialState,
    reducers: {
        createPostContext: (state, action) => {
            let post = action.payload;
            let value = Object.values(post)[0];
            console.log("Data ehter in Store :", post, value)
            state.AllPost = { ...post, ...state.AllPost };
            if (value.status == "Post") {
                if (value.visibility == "Public") {
                    state.PublicPost = { ...post, ...state.PublicPost };
                } else if (value.visibility == "Private") {
                    state.PrivatePost = { ...post, ...state.PrivatePost }
                }
            } else if (value.status == "Draft") {
                state.DraftPost = { ...action.payload, ...state.DraftPost }
            }
        },
        deletePostContext: (state, action) => {
            let id = action.payload.id;
            let status = action.payload.status;
            let visibility = action.payload.visibility;

            state.AllPost[id].status = "Deleted";
            if (status == "Post") {
                if (visibility == "Public") {
                    state.PublicPost[id].status = "Deleted";
                } else if (visibility == "Private") {
                    state.PrivatePost[id].status = "Deleted";
                }
            } else if (status == "Draft") {
                state.DraftPost[id].status = "Deleted";
            }
        },
        // Taken the Object {$id:...,currentData:...}
        updatePostContext: (state, action) => {
            let id = action.payload.$id;
            let currentData = action.payload.currentData;
            let currentStatus = currentData[id]?.status;
            let currentVisibilty = currentData[id]?.visibility;

            state.EditHistory[id] = {
                AllPost:{...state.AllPost},
                DraftPost:{...state.DraftPost},
                PublicPost:{...state.PublicPost},
                PrivatePost:{...state.PrivatePost}
            };
            if (state.AllPost[id]) {
                state.AllPost[id] = {...currentData,...state.AllPost};
            }
            if (currentStatus == "Draft") {
                state.DraftPost = {...currentData,...state.DraftPost};
                delete state.PublicPost[id];
                delete state.PrivatePost[id];
            } else if (currentStatus == "Post") {
                if (currentVisibilty == "Public") {
                    state.PublicPost = {...currentData,...state.PublicPost};
                    delete state.PrivatePost[id];
                    delete state.DraftPost[id];
                } else {
                    state.PrivatePost = {...currentData,...state.PrivatePost};
                    delete state.PublicPost[id];
                    delete state.DraftPost[id];
                }
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPost.pending, (state) => {
                state.getloading = true;
                state.error = null;
                state.getStatus = "Pending";
            })
            .addCase(getPost.fulfilled, (state, action) => {
                for (const post of action.payload.allPost.documents) {
                    if (!state.AllPost[post.$id]) {
                        state.AllPost[post.$id] = post;
                    }
                }
                for (const post of action.payload.publicPost.documents) {
                    if (!state.PublicPost[post.$id]) {
                        state.PublicPost[post.$id] = post;
                    }
                }
                for (const post of action.payload.privatePost.documents) {
                    if (!state.PrivatePost[post.$id]) {
                        state.PrivatePost[post.$id] = post;
                    }
                }
                for (const post of action.payload.draftPost.documents) {
                    if (!state.DraftPost[post.$id]) {
                        state.DraftPost[post.$id] = post;
                    }
                }
                state.getloading = false;
                state.error = null;
                state.getStatus = "Completed";
            })
            .addCase(getPost.rejected, (state, action) => {
                state.getloading = false;
                state.error = action.payload;
                state.getStatus = "Error";
            })
            .addCase(createPost.pending, (state, action) => {
                state.createStatus = "Pending";
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.createStatus = "Completed";
            })
            .addCase(createPost.rejected, (state, action) => {
                const postId = action.payload.id;
                console.log("It is remove due to not updtae in Backend", postId);
                delete state.AllPost[postId];
                delete state.PublicPost[postId];
                delete state.PrivatePost[postId];
                delete state.DraftPost[postId];
                state.error = action.payload.errorMessage;
                state.createStatus = "Error";
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                let id = action.payload.id;
                delete state.AllPost[id];
                delete state.PublicPost[id];
                delete state.PrivatePost[id];
                delete state.DraftPost[id];
            })
            .addCase(deletePost.rejected, (state, action) => {
                let id = action.payload.id;
                let status = action.payload.status;
                let visibility = action.payload.visibility;

                state.AllPost[id].status = status;
                if (status == "Post") {
                    if (visibility == "Public") {
                        state.PublicPost[id].status = status;
                    } else if (visibility == "Private") {
                        state.PrivatePost[id].status = status;
                    }
                } else if (status == "Draft") {
                    state.DraftPost[id].status = status;
                }
                state.error = action.payload.errorMessage;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                let id = action.payload?.id;
                let currentData = action.payload?.res?.document;
                if(state.AllPost[id]){
                    state.AllPost[id]=currentData;
                }
                if(state.PrivatePost[id]){
                    state.PrivatePost[id]=currentData;
                }
                if(state.PublicPost[id]){
                    state.PublicPost[id]=currentData;
                }
                if(state.DraftPost[id]){
                    state.DraftPost[id]=currentData;
                }
                delete state.EditHistory[id];
            })
            .addCase(updatePost.rejected, (state, action) => {
                let id = action.payload.id;
                state.AllPost=state.EditHistory[id].AllPost;
                state.PrivatePost=state.EditHistory[id].PrivatePost;
                state.PublicPost=state.EditHistory[id].PublicPost;
                state.DraftPost=state.EditHistory[id].DraftPost;
                delete state.EditHistory[id];
                state.error = action.payload.errorMessage;
            })
    }
});

export const { createPostContext, deletePostContext,updatePostContext, clearError } = PostSlice.actions;
export default PostSlice.reducer;
