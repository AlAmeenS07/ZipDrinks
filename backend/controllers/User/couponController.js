import { applyCouponService, getUserCouponsService } from "../../Services/User/couponService.js"


export const getUserCoupons = async(req , res)=>{
    await getUserCouponsService(req , res)
}

export const applyCoupon = async(req , res)=>{
    await applyCouponService(req , res)
}