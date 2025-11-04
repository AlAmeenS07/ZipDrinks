import { getAllProductsService, getSingleProductService } from "../../Services/User/productServices.js"

// get all product
export const getAllProducts = async(req , res)=>{
    await getAllProductsService(req , res)
}

// get single product
export const getSingleProduct = async(req , res)=>{
    await getSingleProductService(req ,res)
}