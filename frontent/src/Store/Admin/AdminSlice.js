import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helper/AxiosInstance";
import { toast } from "react-toastify";

const initialState = {
    loading: false,
    isLoggedIn: false,
    adminData: null,
    error: null,
}


export const fetchAdminData = createAsyncThunk(
    'admin/fetchAdminData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/data');
            if (response.data.success && response.data.userData.isAdmin) {
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
        adminOut: (state) => {
            state.adminData = null;
            state.loading = false;
            state.isLoggedIn = false;
            state.error = null;
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
                toast.error(action.payload);
            });
    }

})

export const { loadStart, loadEnd, adminOut } = adminSlice.actions;

export default adminSlice.reducer;
