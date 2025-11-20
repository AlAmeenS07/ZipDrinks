import userModel from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { genAccessToken, genRefreshToken } from "../../utils/token.js";
import { BAD_REQUEST, COOKIE_MAX_AGE, FORBIDDENT, NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js";

dotenv.config();

export const adminLoginService = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(BAD_REQUEST).json({ success: false, message: "Email and Password are required!" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(NOT_FOUND).json({ success: false, message: "User doesn't exist!" });
        }

        if (!user.isAdmin) {
            return res.status(FORBIDDENT).json({ success: false, message: "Only admin can access" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(BAD_REQUEST).json({ success: false, message: "Invalid Password" });
        }

        const accessToken = genAccessToken(user._id)
        const refreshToken = genRefreshToken(user._id)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: COOKIE_MAX_AGE,
        });

        return res.status(SUCCESS).json({ success: true, message: "Login success" , accessToken , adminData : user});
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
        return res.status(SUCCESS).json({ success: true, message: "Logged out" });
    } catch (error) {
        return res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
};
