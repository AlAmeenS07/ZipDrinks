import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./user/UserSlice.js"
import adminReducer from "./Admin/AdminSlice.js"

const store = configureStore({
    reducer : {
        user : userReducer,
        admin : adminReducer
    }
})

export default store;