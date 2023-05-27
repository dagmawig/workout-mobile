import { configureStore } from '@reduxjs/toolkit';
import workoutReducer from './workoutSlice';

// exports reducer for redux store
export default configureStore({
    reducer: {
        workout: workoutReducer
    }
});