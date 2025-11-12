import mongoose from "mongoose"

const walletSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    balance : {
        type : Number,
        default : 0
    },
    payments : [
        {
            _id : false,
            amount : {
                type : Number,
                required : true
            },
            type : {
                type : String,
                enum : ["credit" , "debit"],
                required : true
            },
            description : {
                type : String,
            },
            transactionId : {
                type : String
            },
            time : {
                type : Date,
                default : Date.now
            }
        }
    ]
},
{
    timestamps : true
})

const walletModel = mongoose.models.wallets || mongoose.model("wallets" , walletSchema);

export default walletModel;