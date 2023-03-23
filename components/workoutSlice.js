import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeB: new Array(10).fill(false),
    activeM: new Array(17).fill(false),
    muscleTag: [],
    bodyTag: [],
    scrollP: 0
}

export const workoutSlice = createSlice({
    name: 'workout',
    initialState,
    reducers: {
        updateActiveB: (state, action) => {
            state.activeB = action.payload;
        },
        updateActiveM: (state, action) => {
            state.activeM = action.payload;
        },
        updateMuscleTag: (state, action) => {
            state.muscleTag = action.payload;
        },
        updateBodyTag: (state, action) => {
            state.bodyTag = action.payload;
        },
        updateScroll: (state, action) => {
            state.scrollP = action.payload;
        }
    }
});

export const { updateActiveB, updateActiveM, updateBodyTag, updateMuscleTag, updateScroll } = workoutSlice.actions;

export default workoutSlice.reducer;