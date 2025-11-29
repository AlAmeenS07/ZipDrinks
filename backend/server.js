import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDb from "./confiq/db.js"
import authRouter from "./routes/User/authRoutes.js"
import userRouter from "./routes/User/userRoutes.js"
import passport from "./confiq/passport.js"
import productRouter from "./routes/productRoutes.js"
import categoryRouter from "./routes/categoryRoutes.js"
import wishlistRouter from "./routes/wishlistRoutes.js"
import cartRouter from "./routes/cartRoutes.js"
import orderRouter from "./routes/orderRoutes.js"
import couponRouter from "./routes/couponRoutes.js"
import walletRouter from "./routes/User/wallerRoutes.js"
import bannerRouter from "./routes/User/bannerRoutes.js"
import { requestResponseLogger } from "./middlewares/requestResponseLogger.js"
import AdminAuthRouter from "./routes/Admin/adminAuthRoutes.js"
import AdminDataRouter from "./routes/Admin/AdminDataRoutes.js"
import AdminCustomerRouter from "./routes/Admin/AdminCustomerRoutes.js"
import AdminCategoriesRouter from "./routes/Admin/AdminCategoriesRoutes.js"
import AdminProductsRouter from "./routes/Admin/AdminProductsRoutes.js"
import AdminOrderRouter from "./routes/Admin/AdminOrderRoutes.js"
import AdminCouponRouter from "./routes/Admin/AdminCouponsRoutes.js"
import AdminSalesRouter from "./routes/Admin/AdminSalesRoutes.js"
import AdminDashboardRouter from "./routes/Admin/AdminDashboardRoutes.js"
import AdminBannerRouter from "./routes/Admin/AdminBannerRoutes.js"
import { errorHandler } from "./middlewares/errorHandler.js"

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended : true}))
app.use(cookieParser())
app.use(cors({
    credentials : true,
    origin : [
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL_MAIN
    ] 
}))

app.use(passport.initialize());
// app.use(requestResponseLogger)

connectDb()


app.get("/" , (req , res)=>{
    res.send("Hello")
})

// user

app.use('/api/auth' , authRouter)
app.use('/api/user' , userRouter)
app.use('/api/products' , productRouter)
app.use('/api/categories' , categoryRouter)
app.use('/api/wishlist' , wishlistRouter)
app.use('/api/cart' , cartRouter)
app.use('/api/order' , orderRouter)
app.use('/api/coupons' , couponRouter)
app.use('/api/wallet' , walletRouter)
app.use('/api/banner' , bannerRouter)


// admin

app.use('/api/admin/auth' , AdminAuthRouter)
app.use('/api/admin/data' , AdminDataRouter)
app.use('/api/admin/customers' , AdminCustomerRouter)
app.use('/api/admin/categories' , AdminCategoriesRouter)
app.use('/api/admin/products' , AdminProductsRouter)
app.use('/api/admin/orders' , AdminOrderRouter)
app.use('/api/admin/coupons' , AdminCouponRouter)
app.use('/api/admin/sales' , AdminSalesRouter)
app.use('/api/admin/dashboard' , AdminDashboardRouter)
app.use('/api/admin/banner' , AdminBannerRouter)

app.use(errorHandler)

app.listen(port , ()=>{
    console.log(`Server running on port http://localhost:${port}`)
})