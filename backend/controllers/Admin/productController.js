import { addProductsServic, getProductsService, productListUnlistService, singleProductService, updateProductService } from "../../Services/Admin/ProductService.js"

// add products
export const addProducts = async (req , res)=>{
    await addProductsServic(req , res)
}

// get products
export const getProducts = async(req , res)=>{
    await getProductsService(req , res)
}

// list/unlist product
export const productListUnlist = async(req , res)=>{
    await productListUnlistService(req , res)
}

// get single product
export const singleProduct = async(req , res)=>{
    await singleProductService(req ,res)
}

// update product
export const updateProduct = async (req , res)=>{
    await updateProductService(req ,res)
}