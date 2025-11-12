import express from "express"
import { getUserId } from "../../middlewares/User/userAuth.js"
import { getUserWallet } from "../../controllers/User/walletController.js"

const walletRouter = express.Router()

walletRouter.get('/' , getUserId , getUserWallet)

export default walletRouter