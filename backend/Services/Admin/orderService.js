import orderModel from "../../models/orderModel.js";
import productModel from "../../models/productModel.js";
import walletModel from "../../models/wallet.js";
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, SUCCESS, TAX_PERCENT } from "../../utils/constants.js";
import { transactionIdCreator } from "../User/authServices.js";

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
      return res.status(NOT_FOUND).json({ success: false, message: "No orders found!" });
    }

    return res.status(SUCCESS).json({
      success: true,
      message: "Orders fetched successfully!",
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNumber),
      currentPage: pageNumber,
      orders,
    });

  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const getSingleOrderService = async (req, res) => {
  const { orderId } = req.params;
  try {
    let order = await orderModel.findById(orderId).populate("userId");

    if (!order) {
      return res.status(NOT_FOUND).json({ success: false, message: "Order not found!" });
    }

    return res.status(SUCCESS).json({ success: true, message: "Order fetched successfully", order });

  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const changeOrderStatusService = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    if (!orderId || !status) {
      return res.status(BAD_REQUEST).json({ success: false, message: "Missing details!" });
    }

    let orderDetail = await orderModel.findById(orderId);
    if (!orderDetail) {
      return res.status(NOT_FOUND).json({ success: false, message: "Order not found!" });
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

    if (status === "delivered" && orderDetail.transactions?.length > 0) {
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

    return res.status(SUCCESS).json({
      success: true,
      message: "Order status updated successfully!",
      order: orderDetail,
    });

  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const approveOrderReturnService = async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  try {
    let order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(NOT_FOUND).json({ success: false, message: "Order not found!" });
    }

    order.orderStatus = status || "returned";
    order.paymentStatus = "refunded"
    order.items.forEach(item => {
      if (item.status === "return-requested") {
        item.status = status || "returned";
        item.returnApprove = true;
      }
    });


    for (const item of order.items) {
      if (item.returnReason == "change-mind") {
        const product = await productModel.findById(item.productId);
        if (!product) continue;

        const variant = product.variants.find(v => v.sku === item.sku);
        if (variant) {
          variant.quantity += item.quantity;
        }
        await product.save();
      }
    }

    let wallet = await walletModel.findOne({ userId: order.userId })

    if (!wallet) {
      wallet = new walletModel({ userId: order.userId, balance: 0, payments: [] });
    }

    let transactionId = await transactionIdCreator()

    wallet.balance += order.totalAmount
    wallet.payments.push({
      amount: order.totalAmount,
      type: "credit",
      description: `Refund Amount of order ${order.orderId}`,
      transactionId
    })
    order.transactions.push({
      amount: order.totalAmount,
      paymentMethod: "Wallet",
      status: "refunded",
      transactionId
    })
    await wallet.save()

    await order.save();

    return res.status(SUCCESS).json({ success: true, message: "Order return approved", order });

  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};


export const approveOrderItemReturnService = async (req, res) => {
  const { orderId } = req.params;
  const { sku, status } = req.body;

  try {
    let order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(NOT_FOUND).json({ success: false, message: "Order not found!" });
    }

    let item = order.items.find(i => i.sku === sku);
    if (!item) {
      return res.status(NOT_FOUND).json({ success: false, message: "Order item not found!" });
    }

    item.status = status || "returned";
    item.returnApprove = true;

    let refundTax = item.subTotal * TAX_PERCENT;
    let refundAmount = item.subTotal + refundTax;

    if (order.couponAmount && order.couponAmount > 0 && order.subTotal > 0) {
      const couponShare = order.couponAmount / order.items.length;
      refundAmount -= couponShare;
    }

    if (item.returnReason === "change-mind") {
      const product = await productModel.findById(item.productId);
      if (product) {
        const variant = product.variants.find(v => v.sku === item.sku);
        if (variant) {
          variant.quantity += item.quantity;
          await product.save();
        }
      }
    }

    if (order.items.every(i => i.status === "returned")) {
      order.orderStatus = "returned";
      refundAmount = order.totalAmount;
    }

    let wallet = await walletModel.findOne({ userId: order.userId });
    if (!wallet) {
      wallet = new walletModel({ userId: order.userId, balance: 0, payments: [] });
    }

    refundAmount = Math.round(refundAmount);
    const transactionId = await transactionIdCreator();

    wallet.balance += refundAmount;
    wallet.payments.push({
      amount: refundAmount,
      type: "credit",
      description: `Refund for return item ${item.sku} of order ${order.orderId}`,
      transactionId
    });

    order.transactions.push({
      amount: refundAmount,
      paymentMethod: "Wallet",
      status: "refunded",
      transactionId
    });

    await wallet.save();
    await order.save();

    return res.status(SUCCESS).json({ success: true, message: "Order item returned successfully", order });

  } catch (error) {
    return res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};
