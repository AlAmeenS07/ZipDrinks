import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
    couponCode : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    limit : {
        type : Number,
        required : true
    },
    discount : {
        type : String,
        required : true
    },
    minPurchase : {
        type : Number,
        required : true
    },
    maxRedeem : {
        type : Number,
        required : true
    },
    expiryDate : {
        type : Date,
        required : true
    },
    isActive : {
        type : Boolean,
        default : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},
{
    timestamps : true
}
)

const couponModel = mongoose.models.coupons || mongoose.model("coupons" , couponSchema)

export default couponModel