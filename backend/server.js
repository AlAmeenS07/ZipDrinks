import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDb from "./confiq/db.js"
import authRouter from "./routes/User/authRoutes.js"
import userRouter from "./routes/User/userRoutes.js"
import passport from "./confiq/passport.js"
import AdminRouter from "./routes/Admin/AdminRouter.js"
import productRouter from "./routes/productRoutes.js"
import categoryRouter from "./routes/categoryRoutes.js"
import wishlistRouter from "./routes/wishlistRoutes.js"
import cartRouter from "./routes/cartRoutes.js"
import orderRouter from "./routes/orderRoutes.js"
import logger from "./utils/logger.js"
import couponRouter from "./routes/couponRoutes.js"
import walletRouter from "./routes/User/wallerRoutes.js"
import bannerRouter from "./routes/User/bannerRoutes.js"
import { requestResponseLogger } from "./middlewares/requestResponseLogger.js"

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended : true}))
app.use(cookieParser())
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL 
}))

app.use(passport.initialize());
app.use(requestResponseLogger)

connectDb()


app.get("/" , (req , res)=>{
    res.send("Hello")
})

app.use('/api/auth' , authRouter)
app.use('/api/user' , userRouter)
app.use('/api/admin' , AdminRouter)
app.use('/api/products' , productRouter)
app.use('/api/categories' , categoryRouter)
app.use('/api/wishlist' , wishlistRouter)
app.use('/api/cart' , cartRouter)
app.use('/api/order' , orderRouter)
app.use('/api/coupons' , couponRouter)
app.use('/api/wallet' , walletRouter)
app.use('/api/banner' , bannerRouter)

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

app.listen(port , ()=>{
    logger.info(`Server running on port http://localhost:${port}`)
})