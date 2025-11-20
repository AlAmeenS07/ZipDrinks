import express from "express"
import { getMainBanner } from "../../controllers/User/bannerController.js"

const bannerRouter = express.Router()

bannerRouter.get('/' , getMainBanner)

export default bannerRouter