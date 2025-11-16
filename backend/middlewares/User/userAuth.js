import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {

    const accessToken = req.headers?.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({ success: false, message: "Not Authorized" })
    }

    try {

        const tokenDecode = jwt.verify(accessToken, process.env.JWT_SECRET);

        if (!tokenDecode.id) {
            return res.status(401).json({ success: false, message: "Not Authorized" });
        }

        req.body.userId = tokenDecode.id;

        next()

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


export const verifyTempToken = async (req, res, next) => {
    const { tempToken } = req.cookies;

    if (!tempToken) {
        return res.status(410).json({ success: false, message: "You time out" })
    }

    try {

        const tokenDecode = jwt.verify(tempToken, process.env.JWT_SECRET);

        if (tokenDecode.email) {
            req.body.email = tokenDecode.email
        } else {
            return res.status(410).json({ success: false, message: "Your time out" })
        }

        next()

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getUserId = async (req, res, next) => {

    const accessToken  = req.headers?.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({ success: false, message: "Not Authorized" })
    }

    try {

        const tokenDecode = jwt.verify(accessToken, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id
        } else {
            return res.status(401).json({ success: false, message: "Not Authorized" })
        }

        next()

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}
