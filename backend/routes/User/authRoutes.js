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
import { validate } from "../../middlewares/validate.js";
import { loginSchema, registerSchema, resendVerifyOtpSchema, resetPasswordSchema, sendResetPasswordOtpSchema, verifyEmailSchema, verifyResetOtpSchema } from "../../Validations/User.js";

const authRouter = express.Router()

authRouter.post('/register' , validate(registerSchema) , register)
authRouter.post('/login' , validate(loginSchema) , login);
authRouter.post('/logout' , logout)
authRouter.post('/verify-otp' , validate(verifyEmailSchema) , verifyEmail)
authRouter.post('/resend-otp' , validate(resendVerifyOtpSchema) , resendVerifyOtp)
authRouter.post('/reset-password-otp' , validate(sendResetPasswordOtpSchema) , sendResetPasswordOtp)
authRouter.post('/resend-reset-password-otp' , verifyTempToken , resendResetPasswordOtp)
authRouter.post('/verify-reset-password-otp' , verifyTempToken, validate(verifyResetOtpSchema) , verifyResetPasswordOtp)
authRouter.get('/verify-temptoken' , verifyTempToken , verifyTemp)
authRouter.post('/reset-password' , verifyTempToken , validate(resetPasswordSchema) , resetPassword)
authRouter.get('/is-auth' , userAuth , isAuth)
authRouter.get('/google' , passport.authenticate('google', {scope : ['profile' , 'email']}));
authRouter.get('/google/callback' , passport.authenticate('google' , {session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`}) , googleSignIn)
authRouter.get('/refresh-token' , refreshToken)


export default authRouter