import orderModel from "../../models/orderModel.js";

export const getSalesService = async (filter, startDate, endDate) => {
  try {
    let query = {};

    const now = new Date();

    if (filter === "daily") {

      const start = new Date(now.setHours(0, 0, 0, 0));
      const end = new Date(now.setHours(23, 59, 59, 999));
      query.orderDate = { $gte: start, $lte: end };

    } else if (filter === "weekly") {

      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      query.orderDate = { $gte: weekAgo, $lte: new Date() };

    } else if (filter === "monthly") {

      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      query.orderDate = { $gte: monthAgo, $lte: new Date() };

    } else if (filter === "yearly") {

      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      query.orderDate = { $gte: yearAgo, $lte: new Date() };
      
    } else if (filter === "custom" && startDate && endDate) {
      query.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      query.orderDate = { $lte: new Date() };
    }

    const allOrders = await orderModel
      .find(query)
      .populate("couponId")
      .sort({ orderDate: -1 });

    const sales = await orderModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          totalDiscount: { $sum: "$couponAmount" },
          totalPendings: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] },
          },
        },
      },
    ]);

    return {
      allOrders,
      sales: sales[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalPendings: 0,
      },
    };
  } catch (error) {
    console.error("Error in getSalesService:", error);
    return false;
  }
};
