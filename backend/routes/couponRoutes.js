import express from "express"
import { applyCoupon, getUserCoupons } from "../controllers/User/couponController.js"

const couponRouter = express.Router()

couponRouter.get('/' , getUserCoupons )
couponRouter.post('/' , applyCoupon)

export default couponRouter