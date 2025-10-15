import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading : false,
    isLoggedIn : false,
    isVerified : false,
    userData : null,
    error : null,
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        loginStart : (state)=>{
            state.loading = true;
        },
        loadingEnd : (state)=>{
            state.loading = false;
        },
        loginSuccess : (state , action)=>{
            state.userData = action.payload;
            state.isLoggedIn = true;
            state.loading = false;
        },
        loginFail : (state , action)=>{
            state.loading = false;
            state.error = action.payload
        },
        otpVerified : (state)=>{
            state.isVerified = true,
            state.isLoggedIn = true,
            state.loading = false
        },
        logout : (state)=>{
            state.userData = null;
            state.loading = false;
            state.isLoggedIn = false;
            state.error = null;
            state.isVerified = false;
        }
    }

})

export const {loginStart , loginSuccess , loginFail , loadingEnd , otpVerified , logout} = userSlice.actions;

export default userSlice.reducer;
