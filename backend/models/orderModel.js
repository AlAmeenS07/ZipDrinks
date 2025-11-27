import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        orderId: {
            type: String,
            unique: true,
        },
        couponId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "coupons"
        },
        couponAmount : {
            type : Number
        },
        items: [
            {
                _id: false,
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required: true,
                },
                name: {
                    type: String,
                    required: true
                },
                sku: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                salePrice: {
                    type: Number,
                    required: true
                },
                size: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                subTotal: {
                    type: Number,
                    required: true
                },
                appliedOffer: {
                    type: String
                },
                category: {
                    type: String,
                    required: true
                },
                coverImage : {
                    type : String
                },
                status: {
                    type: String,
                    enum: ["pending", "processing", "out-for-delivery", "delivered", "cancelled", "return-requested", "returned", "return-rejected"],
                    default: "pending",
                },
                refundAmount: { 
                    type: Number, 
                    default: 0 
                },
                cancelReason: {
                    type: String,
                    default: "none"
                },
                returnReason: {
                    type: String,
                    default: "none"
                },
                returnApprove: {
                    type: Boolean,
                    default: false
                }
            },
        ],

        address: {
            fullname: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            district: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            landmark: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                required: true
            },
        },

        subTotal: { 
            type: Number, 
            required: true 
        },
        taxAmount: { 
            type: Number, 
            required: true 
        },
        deliveryFee: { 
            type: Number, 
            required: true,
            default : 0 
        },
        totalAmount: { 
            type: Number, 
            required: true 
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Razorpay", "Wallet"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "completed", "refunded", "failed"],
            default: "pending",
        },

        transactions: [
            {
                _id : false,
                amount: { 
                    type: Number 
                },
                paymentMethod: {
                    type: String,
                    enum: ["COD", "Razorpay", "Wallet"],
                },
                status: {
                    type: String,
                    enum: ["pending", "paid", "completed", "refunded"],
                    default : "pending"
                },
                transactionId: { 
                    type: String,
                    default : null
                },
                time: { 
                    type: Date,
                    default : Date.now 
                },
            },
        ],

        orderStatus: {
            type: String,
            enum: [ "pending", "processing", "out-for-delivery", "delivered", "cancelled", "returned", "return-requested" , "return-rejected"],
            default: "pending",
        },

        orderDate: {
            type: Date,
            default: Date.now,
        },
        deliveryDate : {
            type : Date
        }
    },
    { timestamps: true }
);

const orderModel = mongoose.models.orders || mongoose.model("orders", orderSchema);

export default orderModel;
