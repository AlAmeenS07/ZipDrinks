import { addProductsServic, getProductsService, productListUnlistService, singleProductService, updateProductService } from "../../Services/Admin/ProductService.js"


export const addProducts = async (req , res)=>{
    await addProductsServic(req , res)
}

export const getProducts = async(req , res)=>{
    await getProductsService(req , res)
}

export const productListUnlist = async(req , res)=>{
    await productListUnlistService(req , res)
}

export const singleProduct = async(req , res)=>{
    await singleProductService(req ,res)
}

export const updateProduct = async (req , res)=>{
    await updateProductService(req ,res)
}