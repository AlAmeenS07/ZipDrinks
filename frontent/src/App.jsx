import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Login from "./pages/authentication/Login"
import Signup from "./pages/authentication/Signup"
import EmailVerify from "./pages/authentication/EmailVerify"
import Navbar from "./Components/Navbar"
import { ToastContainer } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import ForgotPassword from "./pages/authentication/ForgotPassword"
import About from "./pages/About/About"
import GoogleCallback from "./pages/authentication/GoogleCallback"
import AdminLogin from "./pages/Admin/AdminLogin"
import { useLocation } from "react-router-dom"
import AdminDash from "./pages/Admin/AdminDash"
import AdminCustomers from "./pages/Admin/AdminCustomers"
import AdminOrders from "./pages/Admin/Orders/AdminOrders.jsx"
import AdminProducts from "./pages/Admin/Products/AdminProducts.jsx"
import { fetchAdminData } from "./Store/Admin/AdminSlice.js"
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
import Profile from "./pages/UserProfile/Profile.jsx"
import ProfileEdit from "./pages/UserProfile/ProfileEdit.jsx"
import VerifyEditEmail from "./pages/UserProfile/VerifyEditEmail.jsx"
import UserProtectedRoute from "./Components/UserProtectedRoute.jsx"
import ChangePassword from "./pages/UserProfile/ChangePassword.jsx"
import Address from "./pages/UserProfile/Address.jsx"
import AddressForm from "./Components/AddressForm.jsx"
import AddAddress from "./pages/UserProfile/AddAddress.jsx"
import EditAddress from "./pages/UserProfile/EditAddress.jsx"
import Wishlist from "./pages/Home/Wishlist.jsx"
import Cart from "./pages/Home/Cart.jsx"
import { fetchCart } from "./Store/user/cartSlice.js"
import Checkout from "./pages/Home/Checkout.jsx"
import AdminOrderDetail from "./pages/Admin/Orders/AdminOrderDetail.jsx"
import MyOrders from "./pages/Home/MyOrders.jsx"
import OrderDetail from "./pages/Home/OrderDetail.jsx"
import OrderSuccess from "./pages/Home/OrderSuccess.jsx"
import Contact from "./pages/Home/Contact.jsx"
import AdminCoupon from "./pages/Admin/Coupons/AdminCoupon.jsx"
import AdminCouponAdd from "./pages/Admin/Coupons/AdminCouponAdd.jsx"
import AdminCouponEdit from "./pages/Admin/Coupons/AdminCouponEdit.jsx"
import ReferralCode from "./pages/UserProfile/ReferralCode.jsx"
import Wallet from "./pages/UserProfile/Wallet.jsx"
import AdminSales from "./pages/Admin/AdminSales.jsx"
import AdminBanner from "./pages/Admin/Banner/AdminBanner.jsx"
import AdminBannerAdd from "./pages/Admin/Banner/AdminBannerAdd.jsx"
import AdminBannerEdit from "./pages/Admin/Banner/AdminBannerEdit.jsx"

function App() {

  const location = useLocation()
  const hideNavbar = location.pathname.startsWith('/admin')
  const isLoggedIn = useSelector(state => state.user.isLoggedIn)
  const isVerified = useSelector(state => state.user.isVerified)
  const admin = useSelector(state => state.admin?.adminData?.isAdmin)
  const cart = useSelector(state => state.cart.cartData)
  const cartLoading = useSelector(state => state.cart.loading)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!admin) {
      dispatch(fetchAdminData())
    }
  }, [])

  useEffect(() => {
    if (!hideNavbar && isLoggedIn) {
      dispatch(fetchCart())
    }
  }, [isLoggedIn, dispatch, hideNavbar])

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
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={
            <UserProtectedRoute>
              <Profile />
            </UserProtectedRoute>
          } />
          <Route path="/profile/edit" element={
            <UserProtectedRoute>
              <ProfileEdit />
            </UserProtectedRoute>
          } />
          <Route path="/profile/edit/verify" element={
            <UserProtectedRoute>
              <VerifyEditEmail />
            </UserProtectedRoute>
          } />
          <Route path="/profile/change-password" element={
            <UserProtectedRoute>
              <ChangePassword />
            </UserProtectedRoute>
          } />
          <Route path="/profile/address" element={
            <UserProtectedRoute>
              <Address />
            </UserProtectedRoute>
          } />
          <Route path="/profile/address/add-address" element={
            <UserProtectedRoute>
              <AddAddress />
            </UserProtectedRoute>
          } />
          <Route path="/profile/address/:id/edit" element={
            <UserProtectedRoute>
              <EditAddress />
            </UserProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <UserProtectedRoute>
              <Wishlist />
            </UserProtectedRoute>
          } />
          <Route path="/cart" element={
            <UserProtectedRoute>
              <Cart />
            </UserProtectedRoute>
          } />
          <Route
            path="/checkout"
            element={
              <UserProtectedRoute>
                {cartLoading ? (
                  <div className="flex items-center justify-center h-screen">Loading...</div>
                ) : !cart || cart.items.length === 0 ? (
                  <Navigate to="/cart" />
                ) : (
                  <Checkout />
                )}
              </UserProtectedRoute>
            }
          />
          <Route path="/orders" element={
            <UserProtectedRoute>
              <MyOrders />
            </UserProtectedRoute>
          } />
          <Route path="/orders/:orderId" element={
            <UserProtectedRoute>
              <OrderDetail />
            </UserProtectedRoute>
          } />
          <Route path="/order-success" element={
            <UserProtectedRoute>
              <OrderSuccess />
            </UserProtectedRoute>
          } />
          <Route path="/profile/referral" element={
            <UserProtectedRoute>
              <ReferralCode />
            </UserProtectedRoute>
          } />
          <Route path="/profile/wallet" element={
            <UserProtectedRoute>
              <Wallet />
            </UserProtectedRoute>
          } />




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
          } />
          <Route path="/admin/orders/:orderId" element={
            <AdminProtectedRoute>
              <AdminOrderDetail />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/coupons" element={
            <AdminProtectedRoute>
              <AdminCoupon />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/coupons/add-coupon" element={
            <AdminProtectedRoute>
              <AdminCouponAdd />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/coupons/:couponId" element={
            <AdminProtectedRoute>
              <AdminCouponEdit />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/sales" element={
            <AdminProtectedRoute>
              <AdminSales />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/banner" element={
            <AdminProtectedRoute>
              <AdminBanner />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/banner/add-banner" element={
            <AdminProtectedRoute>
              <AdminBannerAdd />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/banner/:bannerId/edit" element={
            <AdminProtectedRoute>
              <AdminBannerEdit />
            </AdminProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />

        </Routes>
      </ErrorBoundary>
    </>
  )
}

export default App
