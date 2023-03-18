import { configureStore } from '@reduxjs/toolkit';
import workoutReducer from './workoutSlice';

export default configureStore({
    reducer: {
        workout: workoutReducer
    }
});