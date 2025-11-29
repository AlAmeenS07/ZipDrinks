import express from "express"
import { addProducts, getProducts, productListUnlist, singleProduct, updateProduct } from "../../controllers/Admin/productController.js"
import { getAdminId } from "../../middlewares/Admin/adminAuth.js"
import { validate } from "../../middlewares/validate.js"
import { addProductSchema, updateProductSchema } from "../../Validations/Admin.js"

const AdminProductsRouter = express.Router()

AdminProductsRouter.use(getAdminId)

AdminProductsRouter.post('/add-product' , validate(addProductSchema) , addProducts)
AdminProductsRouter.get('/' , getProducts)
AdminProductsRouter.patch('/:productId' , productListUnlist)
AdminProductsRouter.get('/:productId' , singleProduct)
AdminProductsRouter.put('/:productId' , validate(updateProductSchema) , updateProduct)

export default AdminProductsRouter