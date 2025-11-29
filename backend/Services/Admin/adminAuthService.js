import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { genAccessToken, genRefreshToken } from "../../utils/token.js";
import { BAD_REQUEST, COOKIE_MAX_AGE, FORBIDDENT, INVALID_PASSWORD, LOGIN_SUCCESS, LOGOUT_SUCCESS, NOT_FOUND, ONLY_ADMIN_IS_ALLOWED, SERVER_ERROR, SUCCESS, USER_NOT_FOUND } from "../../utils/constants.js";

dotenv.config();

export const adminLoginService = async (req, res) => {
    const { email, password } = req.body;

    // if (!email || !password) {
    //     return res.status(BAD_REQUEST).json({ success: false, message: "Email and Password are required!" });
    // }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
        }

        if (!user.isAdmin) {
            return res.status(FORBIDDENT).json({ success: false, message: ONLY_ADMIN_IS_ALLOWED });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(BAD_REQUEST).json({ success: false, message: INVALID_PASSWORD });
        }

        const accessToken = genAccessToken(user._id)
        const refreshToken = genRefreshToken(user._id)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: COOKIE_MAX_AGE,
        });

        return res.status(SUCCESS).json({ success: true, message: LOGIN_SUCCESS , accessToken , adminData : user});
    } catch (error) {
        return res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
};

export const adminLogoutService = async (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: COOKIE_MAX_AGE,
        });
        return res.status(SUCCESS).json({ success: true, message: LOGOUT_SUCCESS });
    } catch (error) {
        return res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
};
