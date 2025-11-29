import express from "express"
import { adminLogin, adminLogout } from "../../controllers/Admin/authAdminController.js";
import { validate } from "../../middlewares/validate.js";
import { adminLoginSchema } from "../../Validations/Admin.js";

const AdminAuthRouter = express.Router()

AdminAuthRouter.post('/login' , validate(adminLoginSchema) , adminLogin);
AdminAuthRouter.post('/logout' , adminLogout);

export default AdminAuthRouter