import { getUserCategoriesService } from "../../Services/User/categoryServices.js"

// get category
export const getUserCategories = async (req , res)=>{
    await getUserCategoriesService(req ,res)
}