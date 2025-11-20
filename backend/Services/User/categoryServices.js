import categoryModel from "../../models/categoryModel.js"
import { NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js"


export const getUserCategoriesService = async (req , res)=>{
    try {

        let categories = await categoryModel.find({ isListed : true})

        if(!categories){
            return res.status(NOT_FOUND).json({success : false , message : "Something went wrong !"})
        }

        res.status(SUCCESS).json({success : true , message : "category fetched successfully" , categories})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}