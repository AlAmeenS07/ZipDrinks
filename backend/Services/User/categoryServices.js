import categoryModel from "../../models/categoryModel.js"


export const getUserCategoriesService = async (req , res)=>{
    try {

        let categories = await categoryModel.find({ isListed : true})

        if(!categories){
            return res.json({success : false , message : "Something went wrong !"})
        }

        res.json({success : true , message : "category fetched successfully" , categories})
        
    } catch (error) {
        res.json({success : false , message : error.message})
    }
}