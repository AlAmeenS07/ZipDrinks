import { addCouponService, couponStatusService, deleteCouponService, getCouponsService, getSingleCouponService, updateCouponService } from "../../Services/Admin/couponService.js"

export const addCoupon = async(req , res)=>{
    await addCouponService(req , res)
}

export const getCoupons = async(req , res)=>{
    await getCouponsService(req , res)
}

export const getSingleCoupon = async(req , res)=>{
    await getSingleCouponService(req , res)
}

export const updateCoupon = async(req , res)=>{
    await updateCouponService(req , res)
}

export const couponStatus = async(req , res)=>{
    await couponStatusService(req , res)
}

export const deleteCoupon = async(req , res)=>{
    await deleteCouponService(req , res)
}