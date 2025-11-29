import userModel from "../../models/userModel.js";
import { NOT_FOUND, SERVER_ERROR, SUCCESS, UPDATED_SUCCESSFULLY, USER_NOT_FOUND } from "../../utils/constants.js";

export const getCustomersService = async (req, res) => {
  try {
    const { search = '', status = 'All', page = 1, limit = 5 } = req.query;

    const query = { isAdmin: false };

    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status == 'Active') {
      query.isBlocked = false;
    } else if (status == 'Blocked') {
      query.isBlocked = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await userModel.countDocuments(query);

    let customers = await userModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(SUCCESS).json({
      success: true,
      message: "Customers fetched successfully",
      customers,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
    });

  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const blockUnblockCustomerService = async (req, res) => {
  const { customerId } = req.params;

  try {
    let customer = await userModel.findById(customerId);

    if (!customer) {
      return res.status(NOT_FOUND).json({ success: false, message: USER_NOT_FOUND });
    }

    if (customer.isBlocked) {
      customer.isBlocked = false;
    } else {
      customer.isBlocked = true;
    }

    await customer.save();

    return res.status(SUCCESS).json({ success: true, message: UPDATED_SUCCESSFULLY, customer });

  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};
