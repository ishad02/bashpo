import {createSlice} from '@reduxjs/toolkit';
import { updateCart } from '../components/cartUtil';

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state, action) => {
            state.userInfo = null;
            state.cartItems = [];
            localStorage.removeItem('userInfo');
            localStorage.removeItem('otpInfo');
            updateCart(state);
        },
    },
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;