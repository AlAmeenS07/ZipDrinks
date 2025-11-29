import cartModel from "../../models/cartModel.js"
import wishlistModel from "../../models/wishlistModel.js"
import { ADDED_TO_WISHLIST, BAD_REQUEST, CONFLICT, NOT_FOUND, PRODUCT_ALREADY_IN_CART, PRODUCT_ALREADY_IN_WISHLIST, REMOVED_FROM_WISHLIST, SERVER_ERROR, SOMETHING_WENT_WRONG, SUCCESS, UPDATED_SUCCESSFULLY, WISHLIST_FETCHED_SUCCESSFULLY, WISHLIST_NOT_FOUND } from "../../utils/constants.js"


export const addToWishlistService = async(req , res)=>{
    const { productId , userId} = req.body
    try {

        if(!productId || !userId){
            return res.status(BAD_REQUEST).json({success : false , message : SOMETHING_WENT_WRONG })
        }

        let cartItem = await cartModel.findOne({ userId, items: { $elemMatch: { productId } }});


        if(cartItem){
            return res.status(BAD_REQUEST).json({success : false , message : PRODUCT_ALREADY_IN_CART })
        }

        let addWishlist = await wishlistModel.findOne({ userId })

        if(!addWishlist){
            addWishlist = new wishlistModel({userId , items : [{productId}]})

        }else{
            const existProduct = await addWishlist.items.some((item)=> item.productId.toString() == productId)

            if(existProduct){
                return res.status(CONFLICT).json({success : false , message : PRODUCT_ALREADY_IN_WISHLIST })
            }

            addWishlist.items.push({productId})
        }

        await addWishlist.save()

        res.status(SUCCESS).json({success : true , message : ADDED_TO_WISHLIST , addWishlist})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const getWishlistsServices = async(req , res)=>{
    const { userId } = req
    try {

        const wishlist = await wishlistModel.findOne({userId}).populate("items.productId")

        if(!wishlist){
            return res.status(NOT_FOUND).json({success : false , message : WISHLIST_NOT_FOUND })
        }

        res.status(SUCCESS).json({success : true , message : WISHLIST_FETCHED_SUCCESSFULLY , wishlist})
        
    } catch (error) {
        return res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const removeWishlistService = async(req , res)=>{
    const { productId } = req.params
    const userId = req.userId
    try {
        
        if(!userId || !productId){
            return res.status(BAD_REQUEST).json({success : false , message : SOMETHING_WENT_WRONG })
        }

        let wishlist = await wishlistModel.findOne({userId})

        if(!wishlist){
            return res.status(NOT_FOUND).json({success : false , message : SOMETHING_WENT_WRONG  })
        }

        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId)

        await wishlist.save()

        res.status(SUCCESS).json({success : true , message : REMOVED_FROM_WISHLIST })

    } catch (error) {
        return res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}


export const removeAllWishListService = async(req , res)=>{
    const userId = req.userId

    try {

        const wishlist = await wishlistModel.updateOne({userId} , {$set : {items : []}})

        if(!wishlist){
            return res.status(NOT_FOUND).json({success : false , message : SOMETHING_WENT_WRONG })
        }

        res.status(SUCCESS).json({success : true , message : UPDATED_SUCCESSFULLY , wishlist})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}