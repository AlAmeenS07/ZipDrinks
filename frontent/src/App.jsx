import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Login from "./pages/authentication/Login"
import Signup from "./pages/authentication/Signup"
import EmailVerify from "./pages/authentication/EmailVerify"
import Navbar from "./Components/Navbar"
import { toast, ToastContainer } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { loadingEnd, loginStart, loginSuccess, otpVerified } from "./Store/user/UserSlice"
import { useEffect } from "react"
import ForgotPassword from "./pages/authentication/ForgotPassword"
import About from "./pages/About/About"
import GoogleCallback from "./pages/authentication/googleCallback"
import AdminLogin from "./pages/Admin/AdminLogin"
import { useLocation } from "react-router-dom"
import AdminDash from "./pages/Admin/AdminDash"
import AdminCustomers from "./pages/Admin/AdminCustomers"
import AdminOrders from "./pages/Admin/AdminOrders"
import AdminProducts from "./pages/Admin/AdminProducts"
import { fetchAdminData } from "./Store/Admin/AdminSlice.js"
import axiosInstance from "./Helper/AxiosInstance.js"

function App() {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation()
  const hideNavbar = location.pathname.startsWith('/admin')
  const isLoggedIn = useSelector(state => state.user.isLoggedIn)
  const isVerified = useSelector(state => state.user.isVerified)
  // const loading = useSelector(state => state.user.loading);
  const admin = useSelector(state => state.admin?.adminData?.isAdmin)
  const dispatch = useDispatch()


    useEffect(() => {
      dispatch(fetchAdminData())
    }, [dispatch])

  useEffect(() => {
    async function getUser() {
      dispatch(loginStart())
      try {

        let user = await axiosInstance.get(backendUrl + '/api/user/data')
        if (user.data.success) {
          if (user.data.userData.isVerified) {
            dispatch(loginSuccess(user.data.userData))
            dispatch(otpVerified())
          }
        }

      } catch (error) {
        toast.error(error.message)
      }
      finally{
        dispatch(loadingEnd())
      }
    }
    getUser()
  }, [])

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={"/"} /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to={"/"} /> : <Signup />} />
        <Route path="/email-verify" element={!isVerified ? <EmailVerify /> : <Navigate to={"/"} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/google-callback" element={!isVerified ? <GoogleCallback /> : <Navigate to={"/"} />}/>
        
        <Route path="/admin/login" element={!admin ? <AdminLogin /> : <Navigate to={"/admin/dashboard"} />} />
        <Route path="/admin/dashboard" element={admin ? <AdminDash /> : <Navigate to={"/admin/login"} />} />
        <Route path="/admin/customers" element={admin ? <AdminCustomers /> : <Navigate to={"/admin/login"} /> } />
        <Route path="/admin/orders" element={ admin ? <AdminOrders /> : <Navigate to={"/admin/login"} /> }/>
        <Route path="/admin/products" element={ admin ? <AdminProducts /> : <Navigate to={"/admin/login"} /> } />
      </Routes>
    </>
  )
}

export default App
