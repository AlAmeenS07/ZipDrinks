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
app.use

connectDb()


app.get("/" , (req , res)=>{
    res.send("Hello")
})

app.use('/api/auth' , authRouter)
app.use('/api/user' , userRouter)
app.use('/api/admin' , AdminRouter)
app.use('/api/products' , productRouter)
app.use('/api/categories' , categoryRouter)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

app.listen(port , ()=>{
    console.log(`Server running on port http://localhost:${port}`)
})