import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import databaseService from '../Appwrite/databases';

const initialState = {
    profileData: null,
    historyData: null,
    historyName: null,
    loading: false,
    error: null,
    savestatus: null
};

export const saveData = createAsyncThunk(
    "Profile/Save",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await databaseService.updateProfile(payload);
            console.log(res)
            if (res.success) {
                console.log("done")
                return res;
            } else {
                return rejectWithValue("Server Error");
            }
        } catch (error) {
            console.error(error);
            return rejectWithValue("Server Error");
        }
    }
);

const ProfileSlice = createSlice({
    name: 'Profile',
    initialState,
    reducers: {
        update: (state, action) => {
            state.historyData = state.profileData;
            state.profileData = action.payload;
        },
        setloading: (state, action) => {
            state.loading = action.payload;
        },
        updateHistoryName: (state, action) => {
            state.historyName = action.payload;
        },
        clearError:(state)=>{
            state.error=null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveData.pending, (state) => {
                state.savestatus = "Pending";
            })
            .addCase(saveData.fulfilled, (state,action) => {
                console.log("Complte")
                state.historyData = null;
                state.profileData.fileid=action.payload.FileId;
                state.savestatus = "Completed";
            })
            .addCase(saveData.rejected, (state, action) => {
                console.log("Rejected")
                state.profileData = state.historyData;
                state.savestatus = "Error";
                state.error = action.payload;
            });
    }
});

export const { update, setloading, updateHistoryName,clearError } = ProfileSlice.actions;
export default ProfileSlice.reducer;
