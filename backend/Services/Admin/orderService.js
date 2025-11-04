import orderModel from "../../models/orderModel.js";
import productModel from "../../models/productModel.js";

export const getOrdersService = async (req, res) => {
  const { search, page, status, date, range, limit } = req.query;

  try {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 5;
    const skip = (pageNumber - 1) * limitNumber;

    let query = {};

    if (search) {
      query.$or = [
        { orderId: { $regex: `^${search}`, $options: "i" } },
        { "items.sku": { $regex: `^${search}`, $options: "i" } },
      ];
    }

    if (status) {
      query.$or = [{ orderStatus: status }, { "items.status": status }];
    }

    if (date) {
      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

      query.orderDate = { $gte: startOfDay, $lte: endOfDay };
    }

    if (range) {
      const now = new Date();
      let from;
      switch (range) {
        case "12 Months":
          from = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        case "30 Days":
          from = new Date(now.setDate(now.getDate() - 30));
          break;
        case "7 Days":
          from = new Date(now.setDate(now.getDate() - 7));
          break;
        case "24 Hours":
          from = new Date(now.setHours(now.getHours() - 24));
          break;
        default:
          from = null;
      }
      if (from) {
        query.orderDate = { $gte: from };
      }
    }

    const totalOrders = await orderModel.countDocuments(query);
    const orders = await orderModel
      .find(query)
      .populate("userId")
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limitNumber);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found!" });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully!",
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNumber),
      currentPage: pageNumber,
      orders,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getSingleOrderService = async (req, res) => {
  const { orderId } = req.params;
  try {
    let order = await orderModel.findById(orderId).populate("userId");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    return res.status(200).json({ success: true, message: "Order fetched successfully", order });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const changeOrderStatusService = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Missing details!" });
    }

    let orderDetail = await orderModel.findById(orderId);
    if (!orderDetail) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    if (status === "cancelled") {
      for (let item of orderDetail.items) {
        let product = await productModel.findById(item.productId);
        let variant = product.variants.find(v => v.sku === item.sku);
        if (!variant) continue;
        variant.quantity += item.quantity;
        await product.save();
      }
    }

    if (status === "delivered" && orderDetail.paymentMethod === "COD" && orderDetail.transactions?.length > 0) {
      orderDetail.transactions[0].status = "completed";
      orderDetail.paymentStatus = "completed";
      orderDetail.deliveryDate = new Date();
    }

    orderDetail.orderStatus = status;
    orderDetail.items.forEach(item => {
      if (["pending", "processing", "out-for-delivery"].includes(item.status)) {
        item.status = status;
      }
    });

    await orderDetail.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      order: orderDetail,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const approveOrderReturnService = async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  try {
    let order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    order.orderStatus = status || "returned";
    order.items.forEach(item => {
      if (item.status === "return-requested") {
        item.status = status || "returned";
        item.returnApprove = true;
      }
    });

    await order.save();

    return res.status(200).json({ success: true, message: "Order return approved", order });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const approveOrderItemReturnService = async (req, res) => {
  const { orderId } = req.params;
  const { sku, status } = req.body;

  try {
    let order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }

    let item = order.items.find(i => i.sku == sku);

    if (!item) {
      return res.status(404).json({ success: false, message: "Order item not found!" });
    }

    item.status = status || "returned";
    item.returnApprove = true;

    // order.subTotal = order.items
    //   .filter(i => i.status === "delivered")
    //   .reduce((sum, i) => sum + i.subTotal, 0);

    // order.deliveryFee = order.subTotal < 100 ? 70 : 0;
    // order.taxAmount = Math.floor((order.subTotal + order.deliveryFee) * 0.18);
    // order.totalAmount = order.subTotal + order.deliveryFee + order.taxAmount;

    await order.save();

    return res.status(200).json({ success: true, message: "Order item returned successfully", order });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
