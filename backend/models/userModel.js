import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true,
    },
    googleId : {
        type : String,
        unique : true,
        sparse : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : String,
        required : false,
        sparse : true,
        default : null
    },
    password : {
        type : String,
        required : false
    },
    profileImage : {
        type : String,
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    referralCode : {
        type : String,
        default : '',
        unique : true
    },
    refferedBy : {
        type : String,
        default : null
    },

},
{
    timestamps : true,
}
)

const userModel = mongoose.models.user || mongoose.model('user' , userSchema);
export default userModel