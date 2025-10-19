import mongoose, { mongo } from "mongoose"

const varientSchema = new mongoose.Schema({
    size : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    salePrice : {
        type : Number,
        required : true
    },
    sku : {
        type : String,
        required : true
    },
},
{ _id : false}
)


const ProductSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    offer : {
        type : String,
        default : null
    },
    maxRedeem : {
        type : Number,
        default : 0
    },
    description : {
        type : String,
        required : true
    },
    images : [
        {
            type : String,
            required : true
        }
    ],
    variants : [varientSchema],
    brand : {
        type : String,
        required : true
    },
    ingredients : {
        type : String,
        required : true
    },
    store : {
        type : String,
        required : true
    },
    serve : {
        type : String,
        required : true
    },
    life : {
        type : String,
        required : true
    },
    isListed : {
        type : Boolean,
        default : true
    }

},
{
    timestamps : true
})

const productModel = mongoose.model.products || mongoose.model("products" , ProductSchema);

export default productModel;