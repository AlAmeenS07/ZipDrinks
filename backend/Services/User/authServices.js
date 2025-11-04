import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../../models/userModel.js";
import transporter from "../../confiq/nodemailer.js";
import cache from "../../utils/nodeCache.js";

dotenv.config();

export const registerUser = async (req, res) => {
  const { fullname, email, phone, password } = req.body;

  if (!fullname || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  try {
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const user = new userModel({ fullname, email, phone, password: hashPassword });
    await user.save();

    cache.set(`verify_${email}`, otp, 60);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Account Verification OTP",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(201).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and Password are required!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist!" });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, message: "You are logged in using Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "User is not Verified" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: "You are blocked by admin!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const resendVerifyOtpService = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    cache.set(`verify_${user.email}`, otp, 60);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(200).json({ success: true, message: "Verification OTP resent to email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


export const verifyEmailService = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing Details!" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const cachedOtp = cache.get(`verify_${user.email}`);
    if (!cachedOtp) {
      return res.status(410).json({ success: false, message: "OTP expired" });
    }

    if (cachedOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    await user.save();
    cache.del(`verify_${user.email}`);

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const sendResetPasswordOtpService = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    cache.set(`reset_${email}`, otp, 60);

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

    return res.status(200).json({ success: true, message: "Reset password OTP sent to email." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const resendResetPasswordOtpService = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    cache.set(`reset_${email}`, otp, 60);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      text: `Your new password reset OTP is: ${otp}`,
    });

    return res.status(200).json({ success: true, message: "Reset password OTP resent to email." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const verifyResetPasswordOtpService = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    return res.status(400).json({ success: false, message: "Missing Details!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const cachedOtp = cache.get(`reset_${email}`);
    if (!cachedOtp) {
      return res.status(410).json({ success: false, message: "OTP expired" });
    }
    if (cachedOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    return res.status(200).json({ success: true, message: "Reset password OTP verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const resetPasswordService = async (req, res) => {
  const { newPassword, confirmNewPassword, email } = req.body;

  if (!email) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (!newPassword || !confirmNewPassword) {
    return res.status(400).json({ success: false, message: "New password required!" });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ success: false, message: "Passwords must match!" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
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

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const isAuthService = async (req, res) => {
  return res.status(200).json({ success: true });
};


export const verifyTempService = async (req, res) => {
  return res.status(200).json({ success: true });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/google-callback`);
  } catch (error) {
    return res.redirect(`${process.env.FRONTENT_URL}/login?error=${error.message}`)
  }
};
