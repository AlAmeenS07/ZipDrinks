import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../../models/userModel.js";
import transporter from "../../confiq/nodemailer.js";
import cache from "../../utils/nodeCache.js";
import walletModel from "../../models/wallet.js";
import { genAccessToken, genRefreshToken } from "../../utils/token.js";
import { BAD_REQUEST, CACHE_TIME, CONFLICT, COOKIE_MAX_AGE, CREATED, FORBIDDENT, GONE, NOT_FOUND, REFERRED_BY_AMOUNT, REFERRED_USED_AMOUNT, SERVER_ERROR, SIX_DIGIT_MIN_VALUE, SIX_DIGIT_RANGE_VALUE, SUCCESS, UNAUTHORIZED } from "../../utils/constants.js";

dotenv.config();

export const transactionIdCreator = async () => {
  let transactionId;
  let exist = true;

  while (exist) {
    const num = String(Math.floor(1000000 + Math.random() * 9000000));
    transactionId = `#${num}`;

    const transactionIdExist = await walletModel.findOne({ "payments.transactionId": transactionId });

    if (!transactionIdExist) {
      exist = false;
    }
  }

  return transactionId;
};


export const registerUser = async (req, res) => {
  let { fullname, email, phone, password, referredBy } = req.body;

  referredBy = referredBy.toUpperCase()

  if (!fullname || !email || !phone || !password) {
    return res.status(BAD_REQUEST).json({ success: false, message: "Missing Details" });
  }

  try {
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(CONFLICT).json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = String(Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE));

    const generateReferralCode = async () => {
      let refCode;
      let exist = true

      while (exist) {
        const num = Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE);
        refCode = `REF${num}`;

        let referralExist = await userModel.findOne({ referralCode: refCode })
        if (!referralExist) {
          exist = false
        }
      }

      return refCode
    };

    let referralCode = await generateReferralCode()

    const user = new userModel({ fullname, email, phone, password: hashPassword, referralCode, refferedBy: referredBy });
    await user.save();

    let wallet = await walletModel.create({ userId: user._id })

    if (referredBy) {
      const referredUser = await userModel.findOne({ referralCode: referredBy });

      if (referredUser) {
        const referWallet = await walletModel.findOne({ userId: referredUser._id });

        if (referWallet) {

          referWallet.balance += REFERRED_BY_AMOUNT;
          referWallet.payments.push({
            amount: REFERRED_BY_AMOUNT,
            type: "credit",
            description: `Referral Bonus for inviting ${fullname}`,
            transactionId: await transactionIdCreator()
          });
          await referWallet.save();

          wallet.balance += REFERRED_USED_AMOUNT;
          wallet.payments.push({
            amount: REFERRED_USED_AMOUNT,
            type: "credit",
            description: `Referral Bonus for signing up with ${referredBy}`,
            transactionId: await transactionIdCreator()
          });
          await wallet.save();
        }
      }
    }

    cache.set(`verify_${email}`, otp, CACHE_TIME);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Account Verification OTP",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(CREATED).json({ success: true, message: "OTP sent to email", email });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).json({ success: false, message: "Email and Password are required!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: "User doesn't exist!" });
    }

    if (!user.password) {
      return res.status(BAD_REQUEST).json({ success: false, message: "You are logged in using Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(BAD_REQUEST).json({ success: false, message: "Invalid Password" });
    }

    if (!user.isVerified) {
      return res.status(FORBIDDENT).json({ success: false, message: "User is not Verified" });
    }

    if (user.isBlocked) {
      return res.status(FORBIDDENT).json({ success: false, message: "You are blocked by admin!" });
    }

    const accessToken = genAccessToken(user._id)
    const refreshToken = genRefreshToken(user._id)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: COOKIE_MAX_AGE,
    });


    return res.status(SUCCESS).json({ success: true, message: "Login successful", user, accessToken });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
}


export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(SUCCESS).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const resendVerifyOtpService = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(BAD_REQUEST).json({ success: false, message: "User already verified" });
    }

    const otp = String(Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE));
    cache.set(`verify_${user.email}`, otp, CACHE_TIME);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(SUCCESS).json({ success: true, message: "Verification OTP resent to email" });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
}


export const verifyEmailService = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(BAD_REQUEST).json({ success: false, message: "Missing Details!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: "User not found!" });
    }

    const cachedOtp = cache.get(`verify_${user.email}`);
    if (!cachedOtp) {
      return res.status(GONE).json({ success: false, message: "OTP expired" });
    }

    if (cachedOtp !== otp) {
      return res.status(BAD_REQUEST).json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    await user.save();
    cache.del(`verify_${user.email}`);

    const accessToken = genAccessToken(user._id)
    const refreshToken = genRefreshToken(user._id)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: COOKIE_MAX_AGE,
    });

    return res.status(SUCCESS).json({ success: true, message: "Email verified successfully", user, accessToken });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const sendResetPasswordOtpService = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(BAD_REQUEST).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE));
    cache.set(`reset_${email}`, otp, CACHE_TIME);

    const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.cookie("tempToken", tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 15 * 60 * 1000,
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      text: `Your password reset OTP is: ${otp}`,
    });

    return res.status(SUCCESS).json({ success: true, message: "Reset password OTP sent to email." });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const resendResetPasswordOtpService = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: "User not found!" });
    }

    const otp = String(Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE));
    cache.set(`reset_${email}`, otp, CACHE_TIME);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      text: `Your new password reset OTP is: ${otp}`,
    });

    return res.status(SUCCESS).json({ success: true, message: "Reset password OTP resent to email." });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const verifyResetPasswordOtpService = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    return res.status(BAD_REQUEST).json({ success: false, message: "Missing Details!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: "User not found!" });
    }

    const cachedOtp = cache.get(`reset_${email}`);
    if (!cachedOtp) {
      return res.status(GONE).json({ success: false, message: "OTP expired" });
    }
    if (cachedOtp !== otp) {
      return res.status(BAD_REQUEST).json({ success: false, message: "Invalid OTP" });
    }

    return res.status(SUCCESS).json({ success: true, message: "Reset password OTP verified" });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const resetPasswordService = async (req, res) => {
  const { newPassword, confirmNewPassword, email } = req.body;

  if (!email) {
    return res.status(UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
  }
  if (!newPassword || !confirmNewPassword) {
    return res.status(BAD_REQUEST).json({ success: false, message: "New password required!" });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(BAD_REQUEST).json({ success: false, message: "Passwords must match!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: "User not found!" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    cache.del(`reset_${email}`);
    res.clearCookie("tempToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(SUCCESS).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const isAuthService = async (req, res) => {
  return res.status(SUCCESS).json({ success: true });
};


export const verifyTempService = async (req, res) => {
  return res.status(SUCCESS).json({ success: true });
};


export const googleSignInService = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/signup`);
    }

    if (user.isBlocked) {
      return res.redirect(`${process.env.FRONTEND_URL}/google-callback?error=blocked`);
    }

    const fullname = encodeURIComponent(user.fullname)
    const email = encodeURIComponent(user.email)

    const accessToken = genAccessToken(user._id)
    const refreshToken = genRefreshToken(user._id)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: COOKIE_MAX_AGE,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/google-callback?accessToken=${accessToken}&fullname=${fullname}&email=${email}`);
  } catch (error) {
    return res.redirect(`${process.env.FRONTENT_URL}/login?error=${error.message}`)
  }
};


export const refreshTokenService = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(UNAUTHORIZED).json({ success: false, message: "Not Authorized!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if(user.isBlocked){
      return res.status(FORBIDDENT).json({success : false , message : "User is blocked"})
    }

    const newAccessToken = genAccessToken(decoded.id);

    return res.status(SUCCESS).json({
      success: true,
      accessToken: newAccessToken,
      userData: user
    });

  } catch (error) {
    return res.status(UNAUTHORIZED).json({ success: false, message: "Invalid refresh token" });
  }
};
