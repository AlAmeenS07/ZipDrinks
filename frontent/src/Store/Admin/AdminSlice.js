import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helper/AxiosInstance";

const initialState = {
    loading: false,
    isLoggedIn: false,
    adminData: JSON.parse(localStorage.getItem("adminData")) || null,
    accessToken : null,
    error: null,
}


export const fetchAdminData = createAsyncThunk('admin/fetchAdminData', async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/data');
            if (response.data.success && response.data.userData.isAdmin) {
                localStorage.setItem("adminData", JSON.stringify(response.data.userData));
                return response.data.userData;
            } else {
                return rejectWithValue("Admin not authorized");
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        loadStart: (state) => {
            state.loading = true;
        },
        loadEnd: (state) => {
            state.loading = false;
        },
        adminLoginSuccess : (state , action)=>{
            if(action.payload.accessToken){
                state.accessToken = action.payload.accessToken
            }
            if(action.payload.adminData){
                state.adminData = action.payload.adminData;
            }
            state.isLoggedIn = true;
            state.loading = false;
        },
        adminOut: (state) => {
            state.adminData = null;
            state.loading = false;
            state.isLoggedIn = false;
            state.accessToken = null
            state.error = null;
            localStorage.removeItem("adminData")
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminData.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.adminData = action.payload;
            })
            .addCase(fetchAdminData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }

})

export const { loadStart, loadEnd, adminOut , adminLoginSuccess } = adminSlice.actions;

export default adminSlice.reducer;
