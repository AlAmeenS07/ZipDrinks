import walletModel from "../../models/wallet.js"
import mongoose from "mongoose"

export const getUserWalletService = async (userId, page = 1, limit = 5) => {

    page = parseInt(page)
    limit = parseInt(limit)
    const skip = (page - 1) * limit

    const wallet = await walletModel.aggregate([{ $match: { userId: new mongoose.Types.ObjectId(userId) } }, { $unwind: "$payments" }, {$sort : {"payments.time" : -1}} , { $skip: skip }, { $limit: limit } ])

    if (!wallet || wallet.length === 0) {
        return false
    }

    return wallet
}
