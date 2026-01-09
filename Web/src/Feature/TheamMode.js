import { createSlice } from '@reduxjs/toolkit'
let theam = localStorage.getItem("theam");
let initialState;
if (theam) {
    if (theam == "true") {
        initialState = {
            value: true
        }
    }
    else {
        initialState = {
            value: false
        }
    }
} else {
    initialState = {
        value: false
    }
}

const TheamSlice = createSlice({
    name: 'Theam',
    initialState: initialState,
    reducers: {
        setMode: (state, actions) => {
            localStorage.setItem("theam",!state.value);
            state.value = !state.value;
        }
    }
})

export const { setMode } = TheamSlice.actions

export default TheamSlice.reducer;