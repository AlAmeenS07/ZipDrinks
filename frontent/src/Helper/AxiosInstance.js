import axios from 'axios';
import store from '../Store/Store';
import { loadingEnd, loginSuccess, logout } from '../Store/user/UserSlice';
import { adminLoginSuccess } from '../Store/Admin/AdminSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userToken = store.getState().user.accessToken;
    const adminToken = store.getState().admin.accessToken;

    const url = config.url.replace(import.meta.env.VITE_BACKEND_URL, "");

    if (url.startsWith("/api/admin")) {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    }
    else {
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }
    return config
  },
  (err) => Promise.reject(err)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error)
    const originalRequest = error.config

    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`, { withCredentials: true });

        console.log("axos1", data)

        if (data.success) {
          console.log("axios2", data)
          if (data.userData.isAdmin) {
            store.dispatch(adminLoginSuccess({ accessToken: data.accessToken, adminData: data.userData }))
          } else {
            store.dispatch(loginSuccess({ accessToken: data.accessToken, userData: data.userData }))
          }
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return axiosInstance(originalRequest)

      } catch (error) {
        console.log(error?.response?.data?.message)
        store.dispatch(logout())
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
        return Promise.reject(error)

      }
      finally{
        store.dispatch(loadingEnd())
      }
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;