import walletModel from "../../models/wallet.js"
import mongoose from "mongoose"

export const getUserWalletService = async (userId, page = 1, limit = 5 , filter) => {

    page = parseInt(page)
    limit = parseInt(limit)
    const skip = (page - 1) * limit

    let walletExists = await walletModel.findOne({ userId });

    if (!walletExists) {
        walletExists = await walletModel.create({ userId, balance: 0, payments: [] });
    }

    let query = {}

    if(filter == "credit"){
        query["payments.type"] = "credit"
    }
    else if(filter == "debit"){
        query["payments.type"] = "debit"
    }

    let wallet = await walletModel.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $unwind: "$payments" },
        { $match : query},
        { $sort: { "payments.time": -1 } },
        { $skip: skip },
        { $limit: limit }
    ])

    if (!wallet) {
        return false
    }

    return wallet
}
