
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import axiosInstance from "../../Helper/AxiosInstance"
import axios from "axios";

const initialState = {
    loading: false,
    productData: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    error: null
}

export const productFetch = createAsyncThunk('product/productFetch', async (params = {}, { rejectWithValue }) => {
    try {

        // const {data} = await axiosInstance.get('/api/products' , {params});

        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products`,
            { params, withCredentials: true }
        );


        if (data.success) {
            return {
                products: data.products,
                totalItems: data.totalItems,
                currentPage: data.currentPage,
                totalPages: data.totalPages
            }
        } else {
            return data.message
        }

    } catch (error) {
        return rejectWithValue(error.message)
    }
})

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(productFetch.pending, (state) => {
                state.loading = true
            })
            .addCase(productFetch.fulfilled, (state, action) => {
                state.loading = false,
                    state.productData = action.payload.products
                state.totalItems = action.payload.totalItems
                state.currentPage = action.payload.currentPage
                state.totalPages = action.payload.totalPages
            })
            .addCase(productFetch.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
    }

})

export default productSlice.reducer