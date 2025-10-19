import { getUserCategoriesService } from "../../Services/User/categoryServices.js"

export const getUserCategories = async (req , res)=>{
    await getUserCategoriesService(req ,res)
}