import jwt from "jsonwebtoken";
import { GONE, SERVER_ERROR, UNAUTHORIZED } from "../../utils/constants.js";

export const userAuth = async (req, res, next) => {

    const accessToken = req.headers?.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(UNAUTHORIZED).json({ success: false, message: "Not Authorized" })
    }

    try {

        const tokenDecode = jwt.verify(accessToken, process.env.JWT_SECRET);

        if (!tokenDecode.id) {
            return res.status(UNAUTHORIZED).json({ success: false, message: "Not Authorized" });
        }

        req.body.userId = tokenDecode.id;

        next()

    } catch (error) {
        return res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const verifyTempToken = async (req, res, next) => {
    const { tempToken } = req.cookies;

    if (!tempToken) {
        return res.status(GONE).json({ success: false, message: "You time out" })
    }

    try {

        const tokenDecode = jwt.verify(tempToken, process.env.JWT_SECRET);

        if (tokenDecode.email) {
            req.body.email = tokenDecode.email
        } else {
            return res.status(GONE).json({ success: false, message: "Your time out" })
        }

        next()

    } catch (error) {
        return res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}

export const getUserId = async (req, res, next) => {

    const accessToken  = req.headers?.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(UNAUTHORIZED).json({ success: false, message: "Not Authorized" })
    }

    try {

        const tokenDecode = jwt.verify(accessToken, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id
        } else {
            return res.status(UNAUTHORIZED).json({ success: false, message: "Not Authorized" })
        }

        next()

    } catch (error) {
        return res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }

}
