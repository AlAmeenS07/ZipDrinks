import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../../models/userModel.js";
import transporter from "../../confiq/nodemailer.js";
import cache from "../../utils/nodeCache.js";
import walletModel from "../../models/wallet.js";
import { genAccessToken, genRefreshToken } from "../../utils/token.js";
import { BAD_REQUEST, CACHE_TIME, CONFLICT, COOKIE_MAX_AGE, CREATED, EMAIL_AND_PASSWORD_REQUIRED, EMAIL_IS_REQUIRED, EMAIL_VERIFIED_SUCCESSFULLY, FORBIDDENT, GONE, INVALID_OTP, INVALID_PASSWORD, INVALID_REFRESH_TOKEN, LOGIN_SUCCESS, LOGOUT_SUCCESS, MISSING_DETAILS, NEW_PASSWORD_REQUIRED, NOT_AUTHORIZED, NOT_FOUND, OTP_EXPIRED, OTP_SENT_TO_EMAIL, PASSWORD_RESET_SUCCESSFULLY, PASSWORDS_MUST_MATCH, REFERRED_BY_AMOUNT, REFERRED_USED_AMOUNT, RESET_PASSWORD_OTP_RESENT, RESET_PASSWORD_OTP_SENT, RESET_PASSWORD_OTP_VERIFIED, SERVER_ERROR, SIX_DIGIT_MIN_VALUE, SIX_DIGIT_RANGE_VALUE, SUCCESS, UNAUTHORIZED, USER_ALREADY_EXISTS, USER_ALREADY_VERIFIED, USER_BLOCKED, USER_DOES_NOT_EXIST, USER_GOOGLE_LOGIN, USER_IS_BLOCKED, USER_NOT_FOUND, USER_NOT_VERIFIED, VERIFICATION_OTP_RESENT } from "../../utils/constants.js";

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

  // if (!fullname || !email || !phone || !password) {
  //   return res.status(BAD_REQUEST).json({ success: false, message: MISSING_DETAILS });
  // }

  try {
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(CONFLICT).json({ success: false, message: USER_ALREADY_EXISTS });
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

    return res.status(CREATED).json({ success: true, message: OTP_SENT_TO_EMAIL, email });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // if (!email || !password) {
  //   return res.status(BAD_REQUEST).json({ success: false, message: EMAIL_AND_PASSWORD_REQUIRED });
  // }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: USER_DOES_NOT_EXIST });
    }

    if (!user.password) {
      return res.status(BAD_REQUEST).json({ success: false, message: USER_GOOGLE_LOGIN });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(BAD_REQUEST).json({ success: false, message: INVALID_PASSWORD });
    }

    if (!user.isVerified) {
      return res.status(FORBIDDENT).json({ success: false, message: USER_NOT_VERIFIED });
    }

    if (user.isBlocked) {
      return res.status(FORBIDDENT).json({ success: false, message: USER_BLOCKED });
    }

    const accessToken = genAccessToken(user._id)
    const refreshToken = genRefreshToken(user._id)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: COOKIE_MAX_AGE,
    });


    return res.status(SUCCESS).json({ success: true, message: LOGIN_SUCCESS , user, accessToken });
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
    return res.status(SUCCESS).json({ success: true, message: LOGOUT_SUCCESS });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const resendVerifyOtpService = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
    }

    if (user.isVerified) {
      return res.status(BAD_REQUEST).json({ success: false, message: USER_ALREADY_VERIFIED });
    }

    const otp = String(Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE));
    cache.set(`verify_${user.email}`, otp, CACHE_TIME);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(SUCCESS).json({ success: true, message: VERIFICATION_OTP_RESENT });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
}


export const verifyEmailService = async (req, res) => {
  const { email, otp } = req.body;

  // if (!email || !otp) {
  //   return res.status(BAD_REQUEST).json({ success: false, message: MISSING_DETAILS });
  // }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
    }

    const cachedOtp = cache.get(`verify_${user.email}`);
    if (!cachedOtp) {
      return res.status(GONE).json({ success: false, message: OTP_EXPIRED });
    }

    if (cachedOtp !== otp) {
      return res.status(BAD_REQUEST).json({ success: false, message: INVALID_OTP});
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

    return res.status(SUCCESS).json({ success: true, message: EMAIL_VERIFIED_SUCCESSFULLY , user, accessToken });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const sendResetPasswordOtpService = async (req, res) => {
  const { email } = req.body;
  // if (!email) {
  //   return res.status(BAD_REQUEST).json({ success: false, message: EMAIL_IS_REQUIRED });
  // }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
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

    return res.status(SUCCESS).json({ success: true, message: RESET_PASSWORD_OTP_SENT });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const resendResetPasswordOtpService = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
    }

    const otp = String(Math.floor(SIX_DIGIT_MIN_VALUE + Math.random() * SIX_DIGIT_RANGE_VALUE));
    cache.set(`reset_${email}`, otp, CACHE_TIME);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      text: `Your new password reset OTP is: ${otp}`,
    });

    return res.status(SUCCESS).json({ success: true, message: RESET_PASSWORD_OTP_RESENT });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const verifyResetPasswordOtpService = async (req, res) => {
  const { otp, email } = req.body;

  // if (!otp || !email) {
  //   return res.status(BAD_REQUEST).json({ success: false, message: MISSING_DETAILS });
  // }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
    }

    const cachedOtp = cache.get(`reset_${email}`);
    if (!cachedOtp) {
      return res.status(GONE).json({ success: false, message: OTP_EXPIRED });
    }
    if (cachedOtp !== otp) {
      return res.status(BAD_REQUEST).json({ success: false, message: INVALID_OTP });
    }

    return res.status(SUCCESS).json({ success: true, message: RESET_PASSWORD_OTP_VERIFIED });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const resetPasswordService = async (req, res) => {
  const { newPassword, confirmNewPassword, email } = req.body;

  if (!email) {
    return res.status(UNAUTHORIZED).json({ success: false, message: NOT_AUTHORIZED });
  }
  if (!newPassword || !confirmNewPassword) {
    return res.status(BAD_REQUEST).json({ success: false, message: NEW_PASSWORD_REQUIRED });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(BAD_REQUEST).json({ success: false, message: PASSWORDS_MUST_MATCH });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
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

    return res.status(SUCCESS).json({ success: true, message: PASSWORD_RESET_SUCCESSFULLY });
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
      return res.status(UNAUTHORIZED).json({ success: false, message: NOT_AUTHORIZED });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if(user.isBlocked){
      return res.status(FORBIDDENT).json({success : false , message : USER_IS_BLOCKED })
    }

    const newAccessToken = genAccessToken(decoded.id);

    return res.status(SUCCESS).json({
      success: true,
      accessToken: newAccessToken,
      userData: user
    });

  } catch (error) {
    return res.status(UNAUTHORIZED).json({ success: false, message: INVALID_REFRESH_TOKEN });
  }
};
