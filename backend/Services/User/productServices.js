import productModel from "../../models/productModel.js";

export const getAllProductsService = async (req, res) => {
  try {
    let {
      search = '',
      category = '', // comma-separated categories
      size = '',     // comma-separated sizes
      sort = '',
      page = 1,
      limit = 0
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 0;

    const skipItems = (page - 1) * limit;

    // Build query
    let query = { isListed: true };

    // Search by name
    if (search.trim()) {
      query.name = { $regex: `^${search.trim()}`, $options: "i" };
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

    // Fetch products
    const products = await productModel
      .find(query)
      .sort(sortQuery)
      .skip(skipItems)
      .limit(limit);

    const totalItems = await productModel.countDocuments(query);

    res.json({
      success: true,
      message: "Products fetched successfully",
      products,
      totalItems,
      totalPages: limit ? Math.ceil(totalItems / limit) : 1,
      currentPage: page
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getSingleProductService = async(req , res)=>{
    const { productId } = req.params;

     try {

        const product = await productModel.findById(productId);

        if(!product){
            return res.json({success : false , message : "Something went wrong !"})
        }

        res.json({success : true , message : "product fetched successfully" , product})
        
     } catch (error) {
        res.json({success : false , message : error.message})
     }
}