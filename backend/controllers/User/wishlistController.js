import { addToWishlistService, getWishlistsServices, removeAllWishListService, removeWishlistService } from "../../Services/User/wishlistService.js"

// add to wishlist
export const addToWishlist = async(req , res)=>{
    await addToWishlistService(req , res)
}

// get wishlist
export const getWishlists = async(req , res)=>{
    await getWishlistsServices(req , res)
}

// remove wishlist item
export const removeWishlist = async(req , res)=>{
    await removeWishlistService(req , res)
}

// clear wishlist
export const removeAllWishList = async(req , res)=>{
    await removeAllWishListService(req , res)
}