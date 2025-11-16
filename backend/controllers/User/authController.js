import {
  registerUser,
  loginUser,
  logoutUser,
  resendVerifyOtpService,
  resendResetPasswordOtpService,
  verifyEmailService,
  sendResetPasswordOtpService,
  verifyResetPasswordOtpService,
  resetPasswordService,
  isAuthService,
  verifyTempService,
  googleSignInService,
  refreshTokenService
} from "../../Services/User/authServices.js";


// user signup
export const register = async (req, res) => {
    await registerUser(req, res);
}

// user login
export const login = async (req, res) => {
    await loginUser(req, res);
}

// user logout
export const logout = async (req, res) => {
    await logoutUser(req, res);
}

// resend verify otp
export const resendVerifyOtp = async (req, res) => {
    await resendVerifyOtpService(req, res);
}

// resend password otp
export const resendResetPasswordOtp = async (req, res) => {
    await resendResetPasswordOtpService(req, res);
}

// verify email
export const verifyEmail = async (req, res) => {
    await verifyEmailService(req, res);
}

// reset password otp
export const sendResetPasswordOtp = async (req, res) => {
    await sendResetPasswordOtpService(req, res);
}

// verify reset password otp
export const verifyResetPasswordOtp = async (req, res) => {
    await verifyResetPasswordOtpService(req, res);
}

// reset password
export const resetPassword = async (req, res) => {
    await resetPasswordService(req, res);
}

// user auth check
export const isAuth = async (req, res) => {
    await isAuthService(req, res);
}

// verify temp token
export const verifyTemp = async (req, res) => {
    await verifyTempService(req, res);
}

// google signin
export const googleSignIn = async (req, res) => {
    await googleSignInService(req, res);
}


export const refreshToken = async(req , res)=>{
    await refreshTokenService(req , res)
}