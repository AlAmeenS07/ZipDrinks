import productModel from "../../models/productModel.js";
import { NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js";

export const getAllProductsService = async (req, res) => {
  try {
    let { search = '', category = '',  size = '', sort = '', page = 1, limit = 0 } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 0;

    const skipItems = (page - 1) * limit;

    let query = { isListed: true };

    if (search.trim()) {
      query.name = { $regex: `${search.trim()}`, $options: "i" };
    }

    if (category) {
      const categoriesArray = category.split(',');
      query.category = { $in: categoriesArray };
    }

    if (size) {
      const sizesArray = size.split(',');
      query['variants.size'] = { $in: sizesArray };
    }

    let sortQuery = {};
    switch (sort) {
      case 'price-low':
        sortQuery['variants.salePrice'] = 1;
        break;
      case 'price-high':
        sortQuery['variants.salePrice'] = -1;
        break;
      case 'AtoZ':
        sortQuery.name = 1;
        break;
      case 'ZtoA':
        sortQuery.name = -1;
        break;
      case 'newest':
        sortQuery.createdAt = -1;
        break;
      default:
        break;
    }


    const products = await productModel.find(query).sort(sortQuery).skip(skipItems).limit(limit);

    const totalItems = await productModel.countDocuments(query);

    res.status(SUCCESS).json({ success: true, message: "Products fetched successfully", products, totalItems,
        totalPages: limit ? Math.ceil(totalItems / limit) : 1, currentPage: page });

  } catch (error) {
    res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const getSingleProductService = async(req , res)=>{
    const { productId } = req.params;

     try {

        const product = await productModel.findById(productId);

        if(!product){
            return res.status(NOT_FOUND).json({success : false , message : "Something went wrong !"})
        }

        res.status(SUCCESS).json({success : true , message : "product fetched successfully" , product})
        
     } catch (error) {
        res.status(SERVER_ERROR).json({success : false , message : error.message})
     }
}