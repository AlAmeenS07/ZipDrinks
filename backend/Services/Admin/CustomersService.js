import userModel from "../../models/userModel.js"

export const getCustomersService = async (req, res) => {
    try {

        const { search = '', status = 'All', page = 1, limit = 5 } = req.query;

        const query = { isAdmin : false };

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
        const total = await userModel.countDocuments();

        let customers = await userModel.find(query).skip(skip).limit(limit).sort({createdAt : -1})

        res.json({ success: true, message: "Customer fetched Successfully", 
            customers , total , totalPages :  Math.ceil(total / parseInt(limit)) , currentPage : parseInt(page) })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const blockUnblockCustomerService = async (req, res) => {

    const { customerId } = req.params;

    try {

        let customer = await userModel.findById(customerId);

        if(!customer){
            return res.json({success : false , message : "User not Found !"})
        }

        if(customer.isBlocked){
            customer.isBlocked = false
        }else{
            customer.isBlocked = true
        }

        await customer.save()

        res.json({success : true , message : "Updated Successfully" , customer})

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}