
import express from "express";
import { getUserCategories } from "../controllers/User/categoryService.js";

const categoryRouter = express.Router()

categoryRouter.get('/' , getUserCategories)

export default categoryRouter