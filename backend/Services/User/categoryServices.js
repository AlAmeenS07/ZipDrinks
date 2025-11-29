import categoryModel from "../../models/categoryModel.js"
import { CATEGORIES_FETCHED_SUCCESSFULLY, NOT_FOUND, SERVER_ERROR, SOMETHING_WENT_WRONG, SUCCESS } from "../../utils/constants.js"


export const getUserCategoriesService = async (req , res)=>{
    try {

        let categories = await categoryModel.find({ isListed : true})

        if(!categories){
            return res.status(NOT_FOUND).json({success : false , message : SOMETHING_WENT_WRONG })
        }

        res.status(SUCCESS).json({success : true , message : CATEGORIES_FETCHED_SUCCESSFULLY , categories})
        
    } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
    }
}