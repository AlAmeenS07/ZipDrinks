import express from "express";
import { adminLogin, adminLogout } from "../../controllers/Admin/authAdminController.js";
import { getAdminData } from "../../controllers/Admin/adminDataController.js";
import { getAdminId } from "../../middlewares/Admin/adminAuth.js";
import { blockUnblockCustomer, getCustomers } from "../../controllers/Admin/customersController.js";
import { addCategory, categoryListUnlist, getCategories, singleCategory, updateCategory } from "../../controllers/Admin/CategoryController.js";
import { addProducts, getProducts, productListUnlist, singleProduct, updateProduct } from "../../controllers/Admin/productController.js";

const AdminRouter = express.Router()

AdminRouter.post('/login' , adminLogin);
AdminRouter.post('/logout' , adminLogout);
AdminRouter.get('/data' , getAdminId , getAdminData)
AdminRouter.get('/customers' , getCustomers)
AdminRouter.patch('/customers/:customerId/status' , blockUnblockCustomer)
AdminRouter.post('/add-category' , addCategory)
AdminRouter.get('/categories' , getCategories)
AdminRouter.patch('/categories/:categoryId/status' , categoryListUnlist)
AdminRouter.get('/categories/:categoryId' , singleCategory);
AdminRouter.put('/categories/:categoryId' , updateCategory)
AdminRouter.post('/products/add-product' , addProducts)
AdminRouter.get('/products' , getProducts)
AdminRouter.patch('/products/:productId' , productListUnlist)
AdminRouter.get('/products/:productId' , singleProduct)
AdminRouter.put('/products/:productId' , updateProduct)

export default AdminRouter