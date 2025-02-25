import { PayloadAction, createSlice } from '@reduxjs/toolkit';


interface User {
    _id: string;
    email: string;
    nickname: string;
    avatar: string;
    role: 'admin' | 'admin2' | 'user';
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null as Partial<User> | null,
        isLoggedIn: false,
    },
    reducers: {
        setUserLoggedIn: (state, action: PayloadAction<Partial<User>>) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setUserLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;