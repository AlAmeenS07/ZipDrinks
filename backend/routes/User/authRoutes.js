import express from "express"
import {
  register,
  login,
  logout,
  resendVerifyOtp,
  resendResetPasswordOtp,
  verifyEmail,
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPassword,
  isAuth,
  verifyTemp,
  googleSignIn,
  refreshToken
} from "../../controllers/User/authController.js";

import {userAuth, verifyTempToken} from "../../middlewares/User/userAuth.js";
import passport from "../../confiq/passport.js"

const authRouter = express.Router()

authRouter.post('/register' , register)
authRouter.post('/login' , login);
authRouter.post('/logout' , logout)
authRouter.post('/verify-otp' , verifyEmail)
authRouter.post('/resend-otp' , resendVerifyOtp)
authRouter.post('/reset-password-otp' , sendResetPasswordOtp)
authRouter.post('/resend-reset-password-otp' , verifyTempToken , resendResetPasswordOtp)
authRouter.post('/verify-reset-password-otp' , verifyTempToken, verifyResetPasswordOtp)
authRouter.get('/verify-temptoken' , verifyTempToken , verifyTemp)
authRouter.post('/reset-password' , verifyTempToken , resetPassword)
authRouter.get('/is-auth' , userAuth , isAuth)
authRouter.get('/google' , passport.authenticate('google', {scope : ['profile' , 'email']}));
authRouter.get('/google/callback' , passport.authenticate('google' , {session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`}) , googleSignIn)
authRouter.get('/refresh-token' , refreshToken)


export default authRouter