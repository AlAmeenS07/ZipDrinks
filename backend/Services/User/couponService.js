import couponModel from "../../models/coupon.js"
import orderModel from "../../models/orderModel.js"


export const getUserCouponsService = async(req , res)=>{
    try {

        let coupons = await couponModel.find({isDeleted : false})

        if(!coupons){
            return res.status(404).json({success : false , message : "Coupons not found"})
        }

        coupons = coupons.filter(c => new Date() < new Date(c.expiryDate))

        res.status(200).json({success : true , message : "Coupons fetched successfully" , coupons})
        
    } catch (error) {
        res.status(500).json({success : false , message : error.message})
    }
}


export const applyCouponService = async(req , res)=>{
    const { couponId , userId , totalAmount} = req.body
    try {

        let coupon = await couponModel.findOne({_id : couponId , isDeleted : false , isActive : true})

        if(!coupon){
            return res.status(404).json({success : false , message : "Coupon not found !"})
        }

        if(totalAmount < coupon.minPurchase){
            return res.status(400).json({success : false , message : `Minimum purchase should be ${coupon.minPurchase} `})
        }

        if(new Date() > new Date(coupon.expiryDate)){
            return res.status(400).json({success : false , message : "Coupon is expired !"})
        }

        let orders = await orderModel.find({userId , couponId})

        if(orders.length >= coupon.limit){
            return res.status(400).json({success : false , message : "Coupon is already used !"})
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

        res.status(200).json({success : true , message : "Coupon applied successfully" , couponDiscount})
        
    } catch (error) {
        res.status(500).json({success : false , message : error.message})
    }
}

