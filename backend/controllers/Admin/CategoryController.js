import { categoryAddService, categoryListUnlistService, getCategoriesService, singleCategoryService, updateCategoryService } from "../../Services/Admin/CategoryService.js"


export const addCategory = async(req , res)=>{
    await categoryAddService(req , res)
}

export const getCategories = async (req , res)=>{
    await getCategoriesService(req , res)
}

export const categoryListUnlist = async(req , res)=>{
    await categoryListUnlistService(req , res)
}

export const singleCategory = async (req , res)=>{
    await singleCategoryService(req , res)
}

export const updateCategory = async(req , res)=>{
    await updateCategoryService(req ,res)
}