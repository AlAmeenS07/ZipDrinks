import { categoryAddService, categoryListUnlistService, getCategoriesService, singleCategoryService, updateCategoryService } from "../../Services/Admin/CategoryService.js"

// add category
export const addCategory = async(req , res)=>{
    await categoryAddService(req , res)
}

// get categories
export const getCategories = async (req , res)=>{
    await getCategoriesService(req , res)
}

// list/unlist category
export const categoryListUnlist = async(req , res)=>{
    await categoryListUnlistService(req , res)
}

// specific category
export const singleCategory = async (req , res)=>{
    await singleCategoryService(req , res)
}

// update category
export const updateCategory = async(req , res)=>{
    await updateCategoryService(req ,res)
}