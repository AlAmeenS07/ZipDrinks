import cartModel from "../../models/cartModel.js"
import wishlistModel from "../../models/wishlistModel.js"
import { BAD_REQUEST, CONFLICT, NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js"


export const addToWishlistService = async(req , res)=>{
    const { productId , userId} = req.body
    try {

        if(!productId || !userId){
            return res.status(BAD_REQUEST).json({success : false , message : "Something went wrong !"})
        }

        let cartItem = await cartModel.findOne({ userId, items: { $elemMatch: { productId } }});


        if(cartItem){
            return res.status(BAD_REQUEST).json({success : false , message : "Product already in cart !"})
        }

        let addWishlist = await wishlistModel.findOne({ userId })

        if(!addWishlist){
            addWishlist = new wishlistModel({userId , items : [{productId}]})

        }else{
            const existProduct = await addWishlist.items.some((item)=> item.productId.toString() == productId)

            if(existProduct){
                return res.status(CONFLICT).json({success : false , message : "Product already exist in wishlist !"})
            }

            addWishlist.items.push({productId})
        }

        await addWishlist.save()

        res.status(SUCCESS).json({success : true , message : "Added to wishlist" , addWishlist})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const getWishlistsServices = async(req , res)=>{
    const { userId } = req
    try {

        const wishlist = await wishlistModel.findOne({userId}).populate("items.productId")

        if(!wishlist){
            return res.status(NOT_FOUND).json({success : false , message : "Wishlist not found !"})
        }

        res.status(SUCCESS).json({success : true , message : "Wishlist fetched successfully" , wishlist})
        
    } catch (error) {
        return res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const removeWishlistService = async(req , res)=>{
    const { productId } = req.params
    const userId = req.userId
    try {
        
        if(!userId || !productId){
            return res.status(BAD_REQUEST).json({success : false , message : "Something went wrong !"})
        }

        let wishlist = await wishlistModel.findOne({userId})

        if(!wishlist){
            return res.status(NOT_FOUND).json({success : false , message : "Something went wrong !"})
        }

        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId)

        await wishlist.save()

        res.status(SUCCESS).json({success : true , message : "Removed from wallet"})

    } catch (error) {
        return res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const removeAllWishListService = async(req , res)=>{
    const userId = req.userId

    try {

        const wishlist = await wishlistModel.updateOne({userId} , {$set : {items : []}})

        if(!wishlist){
            return res.status(NOT_FOUND).json({success : false , message : "Something went wrong !"})
        }

        res.status(SUCCESS).json({success : true , message : "Updated Succssfully" , wishlist})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}