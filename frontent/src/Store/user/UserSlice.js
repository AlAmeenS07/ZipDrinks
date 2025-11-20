import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading : true,
    isLoggedIn : false,
    isVerified : false,
    userData : null,
    accessToken : null,
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
            if(action.payload.accessToken){
                state.accessToken = action.payload.accessToken
            }
            if(action.payload.userData){
                state.userData = action.payload.userData;
            }
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
            state.accessToken = null;
        }
    }

})

export const {loginStart , loginSuccess , loginFail , loadingEnd , otpVerified , logout} = userSlice.actions;

export default userSlice.reducer;
