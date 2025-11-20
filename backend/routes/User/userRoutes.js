import express from "express"
import { getUserId, userAuth } from "../../middlewares/User/userAuth.js";
import { changePassword, deleteAddress, editAddress, editUserData, getOneAddress, getUserAddress, getUserData, resendEditEmailOtp, userAddressAdd, verifyEditEmialOtp } from "../../controllers/User/userController.js";

const userRouter = express.Router();

userRouter.get('/data' , getUserId , getUserData)
userRouter.put('/edit' , userAuth , editUserData)
userRouter.post('/edit/verify' , userAuth , verifyEditEmialOtp)
userRouter.post('/edit/resend-otp' , userAuth , resendEditEmailOtp)
userRouter.put('/edit/change-password' , userAuth , changePassword)
userRouter.post('/address' , userAuth , userAddressAdd)
userRouter.get('/address' , getUserId , getUserAddress)
userRouter.get('/address/:addressId' , getOneAddress)
userRouter.put('/address/:addressId' , editAddress)
userRouter.patch('/address/:addressId/delete' , deleteAddress)


export default userRouter