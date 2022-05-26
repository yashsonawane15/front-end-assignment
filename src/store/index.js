import authSlice from "./authStore";
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
})

export default store;