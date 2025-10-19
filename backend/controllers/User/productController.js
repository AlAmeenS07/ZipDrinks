import { getAllProductsService, getSingleProductService } from "../../Services/User/productServices.js"


export const getAllProducts = async(req , res)=>{
    await getAllProductsService(req , res)
}

export const getSingleProduct = async(req , res)=>{
    await getSingleProductService(req ,res)
}