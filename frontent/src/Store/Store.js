import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./user/UserSlice.js"
import adminReducer from "./Admin/AdminSlice.js"
import productReducer from "./user/Products.js"

const store = configureStore({
    reducer : {
        user : userReducer,
        admin : adminReducer,
        product : productReducer
    }
})

export default store;