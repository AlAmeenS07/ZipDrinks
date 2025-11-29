import couponModel from "../../models/coupon.js"
import { CONFLICT, COUPON_ALREADY_EXISTS, COUPON_CREATED_SUCCESSFULLY, COUPON_DELETED_SUCCESSFULLY, COUPON_FETCHED_SUCCESSFULLY, COUPON_NOT_FOUND, COUPON_UPDATED_SUCCESSFULLY, COUPONS_FETCHED_SUCCESSFULLY, CREATED, NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js";

export const addCouponService = async (req, res) => {
    const { couponCode, discount, description, expiryDate, limit, minPurchase, maxRedeem } = req.body

    try {
        // if (
        //     [couponCode, discount, description, expiryDate, limit, minPurchase, maxRedeem]
        //         .some(field => field === undefined || field === null || field === "")
        // ) {
        //     return res.status(BAD_REQUEST).json({ success: false, message: "Missing details" });
        // }

        let coupon;

        coupon = await couponModel.findOne({couponCode : couponCode.toUpperCase()})
        if(coupon){
            return res.status(CONFLICT).json({success : false , message : COUPON_ALREADY_EXISTS })
        }

        coupon = await couponModel({
            couponCode : couponCode.toUpperCase(), discount, description, expiryDate: new Date(expiryDate),
            limit: Number(limit), minPurchase: Number(minPurchase), maxRedeem: Number(maxRedeem)
        })

        await coupon.save()

        res.status(CREATED).json({ success: true, message: COUPON_CREATED_SUCCESSFULLY })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const getCouponsService = async (req, res) => {

    let { search , filter , page , limit} = req.query

    page = parseInt(page)
    limit = parseInt(limit)

    const skip = (page - 1) * limit

    try {

        let query = {isDeleted : false}

        if(search){
            query.$or = [
                {couponCode : {$regex : `^${search}` , $options : "i"}},
                {description : {$regex : `^${search}` , $options : "i"}}
            ]
        }

        if(filter == "active"){
            query.isActive = true
        }
        else if (filter == "inactive"){
            query.isActive = false
        }
        else if(filter == "expired"){
            query.expiryDate = {$lt : new Date()}
        }

        let totalCount = await couponModel.countDocuments(query)

        let coupon = await couponModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit)

        if (!coupon) {
            return res.status(NOT_FOUND).json({ success: false, message: COUPON_NOT_FOUND })
        }

        res.status(SUCCESS).json({ success: true, message: COUPONS_FETCHED_SUCCESSFULLY, 
            coupon , totalCount , totalPages : Math.ceil(totalCount / limit) ,currentPage : page })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const getSingleCouponService = async (req, res) => {
    const { couponId } = req.params
    try {

        const coupon = await couponModel.findById(couponId)

        if (!coupon) {
            return res.status(NOT_FOUND).json({ success: false, message: COUPON_NOT_FOUND})
        }

        res.status(SUCCESS).json({ success: true, message: COUPON_FETCHED_SUCCESSFULLY, coupon })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const updateCouponService = async (req, res) => {
    const { couponId } = req.params;
    const { couponCode, discount, description, expiryDate, limit, minPurchase, maxRedeem } = req.body
    try {

        // if (
        //     [couponCode, discount, description, expiryDate, limit, minPurchase, maxRedeem]
        //         .some(field => field === undefined || field === null || field === "")
        // ) {
        //     return res.status(BAD_REQUEST).json({ success: false, message: "Missing details" });
        // }

        let coupon = await couponModel.findByIdAndUpdate(couponId, {$set : { couponCode : couponCode.toUpperCase(), discount, description, 
            expiryDate: new Date(expiryDate),limit: Number(limit), minPurchase: Number(minPurchase), maxRedeem: Number(maxRedeem)}})

        if(!coupon){
            return res.status(NOT_FOUND).json({success : false , message : COUPON_NOT_FOUND })
        }

        res.status(SUCCESS).json({success : true , message : COUPON_UPDATED_SUCCESSFULLY })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const couponStatusService = async(req , res)=>{
    const { couponId } = req.params;
    try {

        let coupon = await couponModel.findById(couponId)

        if(!coupon){
            return res.status(NOT_FOUND).json({success : false , message : COUPON_NOT_FOUND })
        }

        coupon.isActive = !coupon.isActive
        await coupon.save()

        res.status(SUCCESS).json({success : true , message : COUPON_UPDATED_SUCCESSFULLY , coupon})

    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const deleteCouponService = async(req , res)=>{
    const { couponId } = req.params
    try {
        
        let coupon = await couponModel.findByIdAndUpdate(couponId , {$set : {isDeleted : true}})

        if(!coupon){
            return res.status(NOT_FOUND).json({success : false , message : COUPON_NOT_FOUND })
        }

        res.status(SUCCESS).json({success : true , message : COUPON_DELETED_SUCCESSFULLY })

    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}