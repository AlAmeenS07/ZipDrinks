import userModel from "../../models/userModel.js";
import { NOT_FOUND, SERVER_ERROR, SUCCESS, USER_NOT_FOUND } from "../../utils/constants.js";

export const getAdminDataService = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
        }

        return res.status(SUCCESS).json({
            success: true, userData: {
                fullname: user.fullname, email: user.email, isAdmin: user.isAdmin,
            }
        });

    } catch (error) {
        return res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
}