import categoryModel from "../../models/categoryModel.js"


export const categoryAddService = async (req, res) => {
    const { name, description, offer, maxRedeem, image } = req.body

    try {

        if (!name.trim() || !description.trim() || !image.trim()) {
            return res.json({ success: false, message: "Missing Details !" })
        }

        let existCategory = await categoryModel.findOne({ name })

        if (existCategory) {
            return res.json({ success: false, message: "Category already exist !" })
        }

        let category = new categoryModel({ name, description, offer, maxRedeem, image })
        await category.save()

        res.json({ success: true, message: "Category added successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}


export const getCategoriesService = async (req, res) => {

    const { search = "", sort = "" , page = 1 , limit } = req.query

    try {

        const query = {}

        if (search) {
            query.name = { $regex: `^${search}`, $options: "i" }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await categoryModel.countDocuments(query)
        const limitValue = parseInt(limit) || 5

        let categories;

        if (sort == "lastAdded") {
            categories = await categoryModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitValue)
        }
        else{
            categories = await categoryModel.find(query).skip(skip).limit(limitValue)
        }

        if (!categories) {
            return res.json({ success: false, message: "Something went wrong !" })
        }

        res.json({ success: true, message: "Categories fetched Successfully", 
            categories , total , totalPages : Math.ceil(total / limitValue) , currentPage : Number(page) })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const categoryListUnlistService = async (req , res)=>{
    const { categoryId } = req.params;

    try {

        let category = await categoryModel.findById(categoryId)

        if(!category){
            return res.json({success : false , message : "Something went wrong !"})
        }

        if(category.isListed){
            category.isListed = false;
        }
        else{
            category.isListed = true
        }

        await category.save()

        res.json({success : true , message : "Updated Succssfully"})
        
    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}


export const singleCategoryService = async (req , res)=>{
    const { categoryId } = req.params;

    console.log(categoryId)

    try {

        const category = await categoryModel.findById(categoryId);

        if(!category){
            return res.json({success : false , message : "Something went wrong !"})
        }

        res.json({success : true , message : "Category fetched successfully" , category})
        
    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}

export const updateCategoryService = async(req , res)=>{

    const {name , description , offer , maxRedeem , image} = req.body
    const { categoryId } = req.params;

    if(!name.trim() || !description.trim() || !image){
        return res.json({success : false , message : "Missing Details !"})
    }

    try {

        let category = await categoryModel.findByIdAndUpdate(categoryId , {$set : {name , description , offer , maxRedeem , image}});

        if(!category){
            return res.json({success : false , message : "Something went wrong !"})
        }

        category.name = name;
        category.description = description;
        category.offer = offer;
        category.maxRedeem = maxRedeem
        category.image = image;

        await category.save()

        return res.json({success : true , message : "Updated Successfully" , category})
        
    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}