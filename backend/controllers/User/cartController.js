import { addToCartService, clearCartService, decrementCartService, getCartItemsService, removeFromCartService } from "../../Services/User/cartService.js"

// add to cart
export const addToCart = async(req , res)=>{
    await addToCartService(req , res)
}

// get cart
export const getCartItems = async(req , res)=>{
    await getCartItemsService(req , res)
}

// decrement cart
export const decrementCart = async(req , res)=>{
    await decrementCartService(req , res)
}

// remove cart item
export const removeFromCart = async(req , res)=>{
    await removeFromCartService(req , res)
}

// clear cart
export const clearCart = async(req , res)=>{
    await clearCartService(req , res)
}