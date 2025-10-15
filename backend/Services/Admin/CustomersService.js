import userModel from "../../models/userModel.js"

export const getCustomersService = async (req, res) => {
    try {

        const { search = '', status = 'All', page = 1, limit = 5 } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { fullname: { $regex: `^${search}`, $options: 'i' } },
                { email: { $regex: `^${search}`, $options: 'i' } },
            ];
        }

        if (status == 'Active') {
            query.isBlocked = false
        } else if (status == 'Blocked') {
            query.isBlocked = true
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await userModel.countDocuments(query);

        let customers = await userModel.find(query).skip(skip).limit(limit)

        res.json({ success: true, message: "Customer fetched Successfully", 
            customers , total , totalPages :  Math.ceil(total / limit) , currentPage : parseInt(page) })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const blockUnblockCustomerService = async (req, res) => {

    const { userId, action } = req.body;

    try {

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}