import productModel from "../../models/productModel.js";

export const addProductsServic = async (req, res) => {
    const { name, category, offer, maxRedeem, description, images,
        brand, ingredients, serve, store, life, variants } = req.body

    let updatedVariants = variants.map((v) => {
        return { ...v, sku: `${name.replace(/\s+/g, "")}-${v.size.replace(/\s+/g, "")}`.toUpperCase() }
    })

    try {

        if (!name.trim() || !category.trim() || !description.trim() || !brand.trim() || !ingredients.trim() ||
            !serve.trim() || !store.trim() || !life.trim() || variants.length == 0 || images.length == 0) {
            return res.json({ success: false, message: "Invalid Entries !" });
        }

        let existProduct = await productModel.findOne({ name });

        if (existProduct) {
            return res.json({ success: false, message: "Product is already exists !" })
        }

        let product = await productModel({
            name, description, category, offer, maxRedeem,
            images, variants: updatedVariants, brand, ingredients, store, serve, life
        })

        await product.save()

        res.json({ success: true, message: "Product addedd successfully", product })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const getProductsService = async (req, res) => {

    const { search = '', filter = '', sort = '', page = 1, limit } = req.query

    const limitPerPage = Number(limit)

    try {

        const query = {}

        if (search.trim()) {
            query.name = { $regex: `^${search}`, $options: "i" }
        }

        if (filter == "listed") {
            query.isListed = true
        }
        else if (filter == "unlisted") {
            query.isListed = false
        }
        else if (filter && filter !== "all") {
            query.category = filter
        }

        let sortQuery = {};

        if (sort == "lastAdded") {
            sortQuery = { createdAt: -1 }
        }
        else if (sort == "firstAdded") {
            sortQuery = { createdAt: 1 }
        }


        const skip = (parseInt(page) - 1) * limitPerPage


        const total = await productModel.countDocuments(query)

        let products = await productModel.find(query).sort(sortQuery).skip(skip).limit(limitPerPage);

        if (!products) {
            return res.json({ success: false, message: "Something went wrong !" })
        }

        res.json({
            success: true, message: "Products fetched successfully", products, total,
            totalPages: Math.ceil(total / limitPerPage), currentPage: parseInt(page)
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const productListUnlistService = async (req, res) => {
    const { productId } = req.params;

    try {

        let product = await productModel.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "User not Found !" })
        }

        if (product.isListed) {
            product.isListed = false
        } else {
            product.isListed = true
        }

        await product.save()

        res.json({ success: true, message: "Updated Successfully", product })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const singleProductService = async (req, res) => {
    const { productId } = req.params;

    try {

        let product = await productModel.findById(productId)

        if (!product) {
            return res.json({ success: false, message: "Something wrong !" })
        }

        res.json({ success: true, message: "Product fetched successfully", product })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const updateProductService = async (req, res) => {
    const { productId } = req.params;
    const { name, category, offer, maxRedeem, description, images,
        brand, ingredients, serve, store, life, variants } = req.body

    let updatedVariants = variants.map((v) => {
        return { ...v, sku: `${name.replace(/\s+/g, "")}-${v.size.replace(/\s+/g, "")}`.toUpperCase() }
    })

    if (!name.trim() || !category.trim() || !description.trim() || !brand.trim() || !ingredients.trim() ||
        !serve.trim() || !store.trim() || !life.trim() || variants.length == 0 || images.length == 0) {
        return res.json({ success: false, message: "Invalid Entries !" });
    }

    try {

        let updateProduct = await productModel.findByIdAndUpdate(productId, {$set: { name, category, description, offer, maxRedeem,
                images, brand, ingredients, serve, store, life, variants : updatedVariants}})

        if (!updateProduct) {
            return res.json({ success: false, message: "Something went wrong !" })
        }

        res.json({ success: true, message: "Product updated successfully", updateProduct })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}