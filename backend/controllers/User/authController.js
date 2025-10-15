// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
// import userModel from "../../models/userModel.js";
// import transporter from "../../confiq/nodemailer.js";
// import dotenv from "dotenv"
// import cache from "../../utils/nodeCache.js"

// dotenv.config()


// export const register = async (req, res) => {
//     const { fullname, email, phone, password } = req.body;

//     if (!fullname || !email || !phone || !password) {
//         return res.json({ success: false, message: "Missing Details" })
//     }

//     try {

//         const existUser = await userModel.findOne({ email })
//         if (existUser) {
//             return res.json({ success: false, message: "User already exists" })
//         }

//         const hashPassword = await bcrypt.hash(password, 10);

//         const otp = String(Math.floor(100000 + Math.random() * 900000));

//         const user = new userModel({ fullname, email, phone, password: hashPassword });
//         await user.save();

//         cache.set(`verify_${email}`, otp, 60)

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         })

//         const mailOption = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Account Verification Otp',
//             text: `Your otp is : ${otp}`
//         }

//         await transporter.sendMail(mailOption)

//         res.json({ success: true, message: "OTP send on mail" })

//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }

// }


// export const login = async (req, res) => {
//     const { email, password } = req.body

//     if (!email || !password) {
//         return res.json({ success: false, message: "Email and Password are required !" })
//     }

//     try {

//         const user = await userModel.findOne({ email });

//         if (!user) {
//             return res.json({ success: false, message: "User doesn't exists !" })
//         }

//         const isMatch = await bcrypt.compare(password, user.password)

//         if (!isMatch) {
//             return res.json({ success: false, message: "Invalid Password" })
//         }

//         if (!user.isVerified) {
//             return res.json({ success: false, message: "User is not Verified" })
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         })

//         return res.json({ success: true, message: "Login success" })

//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }

// }

// export const logout = async (req, res) => {
//     try {

//         res.clearCookie('token', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
//         })

//         return res.json({ success: true, message: "Logged Out" })

//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }
// }

// export const resendVerifyOtp = async (req, res) => {
//     try {
//         const { userId } = req.body;

//         const user = await userModel.findById(userId)

//         if (user.isVerified) {
//             return res.json({ success: false, message: "User already verified" })
//         }

//         const otp = String(Math.floor(100000 + Math.random() * 900000));

//         cache.set(`verify_${user.email}`, otp, 60)

//         const mailOption = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Account Verification Otp',
//             text: `Your otp is : ${otp}`
//         }

//         await transporter.sendMail(mailOption)

//         res.json({ success: true, message: "Resend the verification otp sent on Email" })

//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }
// }

// export const verifyEmail = async (req, res) => {

//     const { userId, otp } = req.body;
//     if (!userId || !otp) {
//         return res.json({ success: false, message: "Missing Details !" })
//     }

//     try {

//         const user = await userModel.findById(userId)

//         if (!user) {
//             return res.json({ success: false, message: "User Not found !" })
//         }

//         const cachedOtp = cache.get(`verify_${user.email}`);

//         if (!cachedOtp) {
//             return res.json({ success: false, message: "OTP expires" })
//         }

//         if (cachedOtp !== otp) {
//             return res.json({ success: false, message: "Invalid Otp" })
//         }

//         user.isVerified = true;

//         await user.save()

//         cache.del(`verify_${user.email}`)

//         return res.json({ success: true, message: "Email Verified Successfully" })


//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }

// }

// export const sendResetPasswordOtp = async (req, res) => {

//     const { email } = req.body;

//     if (!email) {
//         return res.json({ success: false, message: "Email is required" })
//     }

//     try {

//         const user = await userModel.findOne({ email });

//         if (!user) {
//             return res.json({ success: false, message: "User not found" })
//         }

//         const otp = String(Math.floor(100000 + Math.random() * 900000));

//         cache.set(`reset_${email}`, otp, 60)

//         const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15min" })

//         res.cookie("tempToken", tempToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
//             maxAge: 15 * 60 * 1000
//         })

//         const mailOption = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Reset password OTP',
//             text: `Your passwore reset otp is : ${otp}`
//         }

//         await transporter.sendMail(mailOption)

//         return res.json({ success: true, message: "Reset password otp send on your mail." })

//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }
// }


// export const resendResetPasswordOtp = async (req, res) => {

//     const { email } = req.body

//     try {

//         const user = await userModel.findOne({ email })

//         if (!user) {
//             return res.json({ success: false, message: "User not found !" })
//         }

//         const otp = String(Math.floor(100000 + Math.random() * 900000));

//         cache.set(`reset_${email}`, otp, 60)

//         const mailOption = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Reset password OTP',
//             text: `Your passwore reset new otp is : ${otp}`
//         }

//         await transporter.sendMail(mailOption)

//         return res.json({ success: true, message: "Reset password new otp send on your mail." })

//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }

// }


// export const verifyResetPasswordOtp = async (req, res) => {

//     const { otp, email } = req.body

//     if (!otp || !email) {
//         return res.json({ success: false, message: "Missing Details !" })
//     }

//     try {

//         const user = await userModel.findOne({ email })

//         if (!user) {
//             return res.json({ success: false, message: "User Not found !" })
//         }

//         const cachedResetOtp = cache.get(`reset_${email}`);


//         if (!cachedResetOtp) {
//             return res.json({ success: false, message: "OTP Expires" })
//         }

//         if (cachedResetOtp !== otp) {
//             return res.json({ success: false, message: "Invalid Otp" })
//         }

//         return res.json({ success: true, message: "Reset Password OTP Verified Successfully" })

//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }

// }


// export const resetPassword = async (req, res) => {
//     const { newPassword, confirmNewPassword, email } = req.body

//     if (!email) {
//         return res.json({ success: false, message: "Unauthorized Error" });
//     }

//     if (!newPassword || !confirmNewPassword || !email) {
//         return res.json({ success: false, message: "newPassword are required !" })
//     }

//     if (newPassword !== confirmNewPassword) {
//         return res.json({ success: false, message: "New Password and Confirm password must be match !" })
//     }

//     try {

//         const user = await userModel.findOne({ email })

//         if (!user) {
//             return res.json({ success: false, message: "User not found" })
//         }

//         const hashedNewPassword = await bcrypt.hash(newPassword, 10)

//         user.password = hashedNewPassword

//         await user.save()

//         cache.del(`reset_${email}`);

//         res.clearCookie('tempToken', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
//         })

//         return res.json({ success: true, message: "Password has been reset successfully" })

//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }
// }


// export const isAuth = async (req, res) => {
//     try {
//         return res.json({ success: true })
//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }
// }

// export const verifyTemp = async (req, res) => {
//     try {
//         return res.json({ success: true })
//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }
// }


// export const googleSignIn = async (req, res) => {
//     try {

//         let user = req.user;

//         if (!user) {
//             return res.redirect(`${process.env.FRONTEND_URL}/signup`)
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         })

//         res.redirect(`${process.env.FRONTEND_URL}/google-callback`);

//     } catch (error) {
//         res.json({ success: false, message: error.message})
//     }
// }


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
  googleSignInService
} from "../../Services/User/authServices.js";

export const register = async (req, res) => {
    await registerUser(req, res);
}

export const login = async (req, res) => {
    await loginUser(req, res);
}

export const logout = async (req, res) => {
    await logoutUser(req, res);
}

export const resendVerifyOtp = async (req, res) => {
    await resendVerifyOtpService(req, res);
}

export const resendResetPasswordOtp = async (req, res) => {
    await resendResetPasswordOtpService(req, res);
}

export const verifyEmail = async (req, res) => {
    await verifyEmailService(req, res);
}

export const sendResetPasswordOtp = async (req, res) => {
    await sendResetPasswordOtpService(req, res);
}

export const verifyResetPasswordOtp = async (req, res) => {
    await verifyResetPasswordOtpService(req, res);
}

export const resetPassword = async (req, res) => {
    await resetPasswordService(req, res);
}

export const isAuth = async (req, res) => {
    await isAuthService(req, res);
}

export const verifyTemp = async (req, res) => {
    await verifyTempService(req, res);
}

export const googleSignIn = async (req, res) => {
    await googleSignInService(req, res);
}
