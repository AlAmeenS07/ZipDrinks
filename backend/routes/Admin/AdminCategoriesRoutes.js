import express from "express"
import { addCategory, categoryListUnlist, getCategories, singleCategory, updateCategory } from "../../controllers/Admin/CategoryController.js"
import { getAdminId } from "../../middlewares/Admin/adminAuth.js"
import { validate } from "../../middlewares/validate.js"
import { categoryAddSchema, categoryUpdateSchema } from "../../Validations/Admin.js"

const AdminCategoriesRouter = express.Router()

AdminCategoriesRouter.use(getAdminId)

AdminCategoriesRouter.post('/add-category' , validate(categoryAddSchema) , addCategory)
AdminCategoriesRouter.get('/' , getCategories)
AdminCategoriesRouter.patch('/:categoryId/status' , categoryListUnlist)
AdminCategoriesRouter.get('/:categoryId' , singleCategory);
AdminCategoriesRouter.put('/:categoryId' , validate(categoryUpdateSchema) , updateCategory)

export default AdminCategoriesRouter