import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/AxiosInstance";


const initialState = {
    cartData : null,
    loading : false,
    error : null
}

export const fetchCart = createAsyncThunk('cart/fetchCart' , async(_ , { rejectWithValue })=>{
    try {

        let {data} = await axiosInstance.get('/api/cart');

        if(data.success){            
            return data.cart
        }
        
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers : {
        clearCart : (state)=>{
            state.cartData = null
        }
    },
    extraReducers : (builder)=>{
        builder
            .addCase(fetchCart.pending , (state)=>{
                state.loading = true
            })
            .addCase(fetchCart.fulfilled , (state , action)=>{
                state.cartData = action.payload
                state.loading = false
            })
            .addCase(fetchCart.rejected , (state , action)=>{
                state.error = action.payload
                state.loading = false
            })
    }
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer