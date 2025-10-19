import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    isListed : {
        type : Boolean,
        default : true
    },
    offer : {
        type : String,
        default : null
    },
    maxRedeem : {
        type : Number,
        default : 0
    }
},
{
    timestamps : true
}
)

const categoryModel = mongoose.model.category || mongoose.model("catogory" , categorySchema)
export default categoryModel