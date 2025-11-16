import axios from 'axios';
import store from '../Store/Store';
import { loginSuccess, logout } from '../Store/user/UserSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().user.accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`,{ withCredentials: true });

        if (data.success) {
          store.dispatch(loginSuccess({ accessToken: data.accessToken , userData : data.userData }))
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return axiosInstance(originalRequest)

      } catch (error) {
        console.log(error?.response?.data?.message)
        store.dispatch(logout())
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout` , {} , {withCredentials : true});
        return Promise.reject(error)

      }
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;