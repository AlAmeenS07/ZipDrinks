import express from "express";
import { adminLogin, adminLogout } from "../../controllers/Admin/authAdminController.js";
import { getAdminData } from "../../controllers/Admin/adminDataController.js";
import { getAdminId } from "../../middlewares/Admin/adminAuth.js";
import { blockUnblockCustomer, getCustomers } from "../../controllers/Admin/customersController.js";

const AdminRouter = express.Router()

AdminRouter.post('/login' , adminLogin);
AdminRouter.post('/logout' , adminLogout);
AdminRouter.get('/data' , getAdminId , getAdminData)
AdminRouter.get('/customers' , getCustomers)
AdminRouter.patch('/customers/:id/status' , blockUnblockCustomer)

export default AdminRouter