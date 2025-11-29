import couponModel from "../../models/coupon.js"
import orderModel from "../../models/orderModel.js"
import { BAD_REQUEST, COUPON_ALREADY_USED, COUPON_APPLIED_SUCCESSFULLY, COUPON_IS_EXPIRED, COUPON_NOT_FOUND, COUPONS_FETCHED_SUCCESSFULLY, MINIMUM_PURCHASE_REQUIRED, NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js"


export const getUserCouponsService = async(req , res)=>{
    try {

        let coupons = await couponModel.find({isDeleted : false})

        if(!coupons){
            return res.status(NOT_FOUND).json({success : false , message : COUPON_NOT_FOUND })
        }

        coupons = coupons.filter(c => new Date() < new Date(c.expiryDate))

        res.status(SUCCESS).json({success : true , message : COUPONS_FETCHED_SUCCESSFULLY , coupons})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const applyCouponService = async(req , res)=>{
    const { couponId , userId , totalAmount} = req.body
    try {

        let coupon = await couponModel.findOne({_id : couponId , isDeleted : false , isActive : true})

        if(!coupon){
            return res.status(NOT_FOUND).json({success : false , message : COUPON_NOT_FOUND })
        }

        if(totalAmount < coupon.minPurchase){
            return res.status(BAD_REQUEST).json({success : false , message : `${MINIMUM_PURCHASE_REQUIRED} ${coupon.minPurchase} `})
        }

        if(new Date() > new Date(coupon.expiryDate)){
            return res.status(BAD_REQUEST).json({success : false , message : COUPON_IS_EXPIRED })
        }

        let orders = await orderModel.find({userId , couponId})

        if(orders.length >= coupon.limit){
            return res.status(BAD_REQUEST).json({success : false , message : COUPON_ALREADY_USED })
        }

        let couponDiscount;
        if(!coupon.discount.includes("%")){
            couponDiscount = parseInt(coupon.discount)
        }
        else{
            let percent = parseInt(coupon.discount.split("%")[0].trim())
            couponDiscount = ((totalAmount * percent) / 100)
        }

        if(couponDiscount > coupon.maxRedeem){
            couponDiscount = coupon.maxRedeem
        }

        res.status(SUCCESS).json({success : true , message : COUPON_APPLIED_SUCCESSFULLY , couponDiscount})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}

