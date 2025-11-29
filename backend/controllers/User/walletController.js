import walletModel from "../../models/wallet.js"
import { getUserWalletService } from "../../Services/User/wallerService.js"
import mongoose from "mongoose"
import { NOT_FOUND, SERVER_ERROR, SUCCESS, WALLET_FETCHED_SUCCESSFULLY, WALLET_NOT_FOUND } from "../../utils/constants.js"


// user wallet

export const getUserWallet = async (req, res) => {
    const { userId } = req
    let { page, limit , filter } = req.query

    try {
        page = parseInt(page)
        limit = parseInt(limit)

        let wallet = await getUserWalletService(userId, page, limit , filter)

        if (!wallet) {
            return res.status(NOT_FOUND).json({ success: false, message: WALLET_NOT_FOUND })
        }

        const totalCountResult = await walletModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$payments" },
            { $count: "totalItems" },
        ]);

        const totalItems = totalCountResult[0]?.totalItems || 0;
        const totalPages = Math.ceil(totalItems / limit);

        res.status(SUCCESS).json({ success: true, message: WALLET_FETCHED_SUCCESSFULLY, wallet, totalPages, currentPage: page })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }

}