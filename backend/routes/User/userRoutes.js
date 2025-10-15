import express from "express"
import { getUserId } from "../../middlewares/User/userAuth.js";
import { getUserData } from "../../controllers/User/userController.js";

const userRouter = express.Router();

userRouter.get('/data' , getUserId , getUserData)

export default userRouter