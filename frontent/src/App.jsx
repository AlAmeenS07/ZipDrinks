import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Login from "./pages/authentication/Login"
import Signup from "./pages/authentication/Signup"
import EmailVerify from "./pages/authentication/EmailVerify"
import Navbar from "./Components/Navbar"
import { toast, ToastContainer } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { loadingEnd, loginStart, loginSuccess, logout, otpVerified } from "./Store/user/UserSlice"
import { useEffect } from "react"
import ForgotPassword from "./pages/authentication/ForgotPassword"
import About from "./pages/About/About"
import GoogleCallback from "./pages/authentication/googleCallback"
import AdminLogin from "./pages/Admin/AdminLogin"
import { useLocation } from "react-router-dom"
import AdminDash from "./pages/Admin/AdminDash"
import AdminCustomers from "./pages/Admin/AdminCustomers"
import AdminOrders from "./pages/Admin/AdminOrders"
import AdminProducts from "./pages/Admin/Products/AdminProducts.jsx"
import { fetchAdminData } from "./Store/Admin/AdminSlice.js"
import axiosInstance from "./Helper/AxiosInstance.js"
import AdminProtectedRoute from "./Components/Admin/AdminProtectedRoute.jsx"
import AdminCategory from "./pages/Admin/AdminCategory.jsx"
import AdminCategoryAdd from "./pages/Admin/AdminCategoryAdd.jsx"
import AdminCategoryEdit from "./pages/Admin/AdminCategoryEdit.jsx"
import AdminAddProducts from "./pages/Admin/Products/AdminAddProducts.jsx"
import AdminEditProduct from "./pages/Admin/Products/AdminEditProduct.jsx"
import ProductDetail from "./pages/Home/ProductDetail.jsx"
import Shop from "./pages/Home/Shop.jsx"
import NotFound from "./pages/Home/NotFound.jsx"
import ErrorBoundary from "./pages/Home/ErrorBoundary.jsx"

function App() {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation()
  const hideNavbar = location.pathname.startsWith('/admin')
  const isLoggedIn = useSelector(state => state.user.isLoggedIn)
  const isVerified = useSelector(state => state.user.isVerified)
  const admin = useSelector(state => state.admin?.adminData?.isAdmin)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!admin) {
      dispatch(fetchAdminData())
    }
  }, [])

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
        } else {
          let res = await axiosInstance.post(backendUrl + '/api/auth/logout');
          if (res.data.success) {
            dispatch(logout())
          }
        }

      } catch (error) {
        toast.error(error.message)
      }
      finally {
        dispatch(loadingEnd())
      }
    }
    getUser()
  }, [])

  return (
    <>
      <ErrorBoundary>
      <ToastContainer position="top-right" autoClose={3000} />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to={"/"} /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to={"/"} /> : <Signup />} />
        <Route path="/email-verify" element={!isVerified ? <EmailVerify /> : <Navigate to={"/"} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/google-callback" element={!isVerified ? <GoogleCallback /> : <Navigate to={"/"} />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/shop" element={<Shop />} />

        <Route path="/admin/login" element={admin ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDash />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <AdminProtectedRoute>
            <AdminCustomers />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminProtectedRoute>
            <AdminOrders />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <AdminProtectedRoute>
            <AdminProducts />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <AdminProtectedRoute>
            <AdminCategory />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/categories/add-category" element={
          <AdminProtectedRoute>
            <AdminCategoryAdd />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/categories/:id/edit-category" element={
          <AdminProtectedRoute>
            <AdminCategoryEdit />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/products/add-product" element={
          <AdminProtectedRoute>
            <AdminAddProducts />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/products/:id/edit-product" element={
          <AdminProtectedRoute>
            <AdminEditProduct />
          </AdminProtectedRoute>
        }/>

        <Route path="*" element={<NotFound />}/>

      </Routes>
      </ErrorBoundary>
    </>
  )
}

export default App
