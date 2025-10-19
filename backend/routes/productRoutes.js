import express from "express"
import { getAllProducts, getSingleProduct } from "../controllers/User/productController.js"

const productRouter = express.Router()


productRouter.get("/" , getAllProducts)
productRouter.get('/:productId' , getSingleProduct)

export default productRouter