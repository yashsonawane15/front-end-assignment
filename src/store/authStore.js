import { configureStore, createSlice } from '@reduxjs/toolkit';

const initial = {
    loggedIn: false,
    baseUrl: "http://localhost:8085/api/v1",
    id: ""
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initial,
    reducers: {
        loginReducer(state, action) {
            return {...state, loggedIn: true, id: action.payload}
        },
        logoutReducer(state, action) {
            return {...state, loggedIn: false, id: ""} 
        }
    }
})

export const authActions = authSlice.actions;

const store = configureStore({
    reducer: authSlice.reducer
});

export default authSlice;