import express from "express";
import { adminLogin, adminLogout } from "../../controllers/Admin/authAdminController.js";
import { getAdminData } from "../../controllers/Admin/adminDataController.js";
import { getAdminId } from "../../middlewares/Admin/adminAuth.js";
import { blockUnblockCustomer, getCustomers } from "../../controllers/Admin/customersController.js";
import { addCategory, categoryListUnlist, getCategories, singleCategory, updateCategory } from "../../controllers/Admin/CategoryController.js";
import { addProducts, getProducts, productListUnlist, singleProduct, updateProduct } from "../../controllers/Admin/productController.js";
import { approveOrderItemReturn, approveOrderReturn, changeOrderStatus, getOrders, getSingleOrder } from "../../controllers/Admin/orderController.js";
import { addCoupon, couponStatus, deleteCoupon, getCoupons, getSingleCoupon, updateCoupon } from "../../controllers/Admin/couponController.js";
import { generateSalesExcel, generateSalesPdf, getSales } from "../../controllers/Admin/salesController.js";

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
AdminRouter.get('/orders' , getOrders)
AdminRouter.get('/orders/:orderId' , getSingleOrder)
AdminRouter.put('/orders/:orderId/status' , changeOrderStatus)
AdminRouter.patch('/orders/:orderId/return' , approveOrderReturn)
AdminRouter.patch('/orders/:orderId/return-item' , approveOrderItemReturn)
AdminRouter.post('/coupons/add-coupon' , addCoupon)
AdminRouter.get('/coupons' , getCoupons)
AdminRouter.get('/coupons/:couponId' , getSingleCoupon)
AdminRouter.put('/coupons/:couponId' , updateCoupon)
AdminRouter.patch('/coupons/:couponId/status' , couponStatus)
AdminRouter.patch('/coupons/:couponId' , deleteCoupon)
AdminRouter.get('/sales' , getSales)
AdminRouter.get('/sales/download-pdf' , generateSalesPdf)
AdminRouter.get('/sales/download-excel' , generateSalesExcel)

export default AdminRouter