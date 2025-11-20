import razorpay from "../../confiq/razorpay.js";
import logger from "../../utils/logger.js";
import cartModel from "../../models/cartModel.js"
import orderModel from "../../models/orderModel.js"
import productModel from "../../models/productModel.js"
import PDFDocument from "pdfkit";
import crypto from "crypto"
import walletModel from "../../models/wallet.js";
import { transactionIdCreator } from "./authServices.js";
import couponModel from "../../models/coupon.js";
import { BAD_REQUEST, MAX_COD_AMOUNT, NOT_FOUND, SERVER_ERROR, SEVEN_DIGIT_MIN_VALUE, SEVEN_DIGIT_RANGE_VALUE, SUCCESS, TAX_PERCENT, UNAUTHORIZED } from "../../utils/constants.js";


const orderTransactionIdCreator = async () => {
    let transactionId;
    let exist = true;

    while (exist) {
        const num = String(Math.floor(SEVEN_DIGIT_MIN_VALUE + Math.random() * SEVEN_DIGIT_RANGE_VALUE));
        transactionId = `#${num}`;

        const transactionIdExist = await orderModel.findOne({ "transactions.transactionId": transactionId });

        if (!transactionIdExist) {
            exist = false;
        }
    }

    return transactionId;
};


export const placeOrderService = async (req, res) => {
    const { address, products, subTotal, taxAmount, totalAmount, paymentMethod, userId, couponId, couponAmount } = req.body

    if (!userId) {
        return res.status(UNAUTHORIZED).json({ success: false, message: "Not Authorized !" })
    }

    try {

        if (Object.keys(address).length == 0 || products.length == 0 || !subTotal || !taxAmount || !totalAmount || !paymentMethod) {
            return res.status(BAD_REQUEST).json({ success: false, message: "Something wrong ! Missing fields !" })
        }

        if(totalAmount > MAX_COD_AMOUNT && paymentMethod == "COD"){
            return res.status(BAD_REQUEST).json({success : false , message : "COD is not available for orders above 1000 !"})
        }

        for (let product of products) {
            let isProduct = await productModel.findOne({ _id: product.productId, isListed: true })
            if (!isProduct) {
                return res.status(NOT_FOUND).json({ success: false, message: `${product.name} is not found !` })
            }

            let productVariant = isProduct.variants.find(prd => prd.sku == product.sku)
            if (!productVariant) {
                return res.status(NOT_FOUND).json({ success: false, message: `${product.sku} size is not found !` })
            }

            if (productVariant.quantity < product.quantity) {
                return res.status(NOT_FOUND).json({ success: false, message: `${product.name} is just sold out !` })
            }
        }

        const orderId = `ORD-${new Date().getFullYear()}${(new Date().getMonth() + 1)
            .toString().padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-${Date.now()}`;


        if (paymentMethod == "Razorpay") {
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: orderId
            })

            return res.status(SUCCESS).json({
                success: true,
                message: "Razorpay order created successfully",
                razorpayOrder,
                key: process.env.RAZOR_PAY_API_KEY,
                orderId,
            });

        }

        let order;

        if (paymentMethod == "COD") {
            order = orderModel({
                userId, orderId, address, items: products, subTotal, taxAmount, totalAmount, paymentMethod,
                transactions: [{ amount: totalAmount, paymentMethod, transactionId: await orderTransactionIdCreator() }]
            })
        }
        else if (paymentMethod == "Wallet") {

            let wallet = await walletModel.findOne({ userId })

            if (!wallet) {
                wallet = new walletModel.create({ userId: order.userId, balance: 0, payments: [] });
            }

            if (wallet.balance < totalAmount) {
                return res.status(BAD_REQUEST).json({ success: false, message: "Insufficient amount in wallet !" })
            }

            let transactionId = await transactionIdCreator()

            wallet.balance -= totalAmount
            wallet.payments.push({
                amount: totalAmount,
                type: "debit",
                description: `Amount for ${orderId} order.`,
                transactionId
            })

            order = orderModel({
                userId, orderId, address, items: products, subTotal,
                taxAmount, totalAmount, paymentMethod, transactions: [{ amount: totalAmount, paymentMethod, status: "paid", transactionId }]
            })
            await wallet.save()
        }

        for (let product of products) {
            await productModel.updateOne(
                { _id: product.productId, "variants.sku": product.sku },
                { $inc: { "variants.$.quantity": -product.quantity } }
            );
        }

        let cart = await cartModel.findOne({ userId })

        cart.items = [];
        cart.totalAmount = 0
        await cart.save()

        if (couponId) {
            order.couponId = couponId
            order.couponAmount = couponAmount
        }

        await order.save();

        res.status(SUCCESS).json({ success: true, message: "Order successfull", order })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const getUserOrderService = async (req, res) => {

    const { userId } = req
    const { search, page, limit } = req.query

    const limitPerPage = parseInt(limit) || 5
    const pageNum = parseInt(page) || 1
    const skipItems = (pageNum - 1) * limitPerPage

    try {

        let query = { userId };

        if (search) {
            query["items.sku"] = { $regex: `^${search}`, $options: "i" };
        }

        if (!userId) {
            return res.status(UNAUTHORIZED).json({ success: false, message: "Not authorized !" })
        }

        const totalOrders = await orderModel.countDocuments(query);

        let orders = await orderModel.find(query).sort({ createdAt: -1 }).skip(skipItems).limit(limitPerPage)

        if (!orders) {
            return res.status(NOT_FOUND).json({ success: false, message: "Orders not found !" })
        }

        res.status(SUCCESS).json({
            success: true, message: "Orders fetched successfully", orders, totalOrders,
            currentPage: pageNum, totalPages: Math.ceil(totalOrders / limitPerPage)
        })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const getSingleOrderService = async (req, res) => {
    const { userId } = req
    const { orderId } = req.params;

    try {

        if (!userId) {
            return res.status(UNAUTHORIZED).json({ success: false, message: "Not authorized !" })
        }

        if (!orderId) {
            return res.status(BAD_REQUEST).json({ success: false, message: "Something went wrong !" })
        }

        let orderDetail = await orderModel.findById(orderId)

        if (!orderDetail) {
            return res.status(NOT_FOUND).json({ success: false, message: "Order not found !" })
        }

        res.status(SUCCESS).json({ success: true, message: "Order fetched Successfully !", orderDetail })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const cancelOrderService = async (req, res) => {

    const { reason, status, userId } = req.body;
    const { orderId } = req.params;

    try {
        if (!userId) {
            return res.status(UNAUTHORIZED).json({ success: false, message: "Not authorized!" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(NOT_FOUND).json({ success: false, message: "Order not found!" });
        }

        if (order.orderStatus !== "pending" && order.orderStatus !== "processing") {
            return res.status(BAD_REQUEST).json({ success: false, message: "This order cannot be cancelled now!" });
        }

        for (const item of order.items) {
            const product = await productModel.findById(item.productId);
            if (!product) continue;

            const variant = product.variants.find(v => v.sku === item.sku);
            if (variant) {
                variant.quantity += item.quantity;
            }
            await product.save();
        }

        order.items.forEach(item => {
            item.cancelReason = reason;
            item.status = status || "cancelled";
        });

        order.orderStatus = status || "cancelled";


        if (order.paymentMethod != "COD") {

            let wallet = await walletModel.findOne({ userId })

            if (!wallet) {
                wallet = new walletModel({ userId: order.userId, balance: 0, payments: [] });
            }

            let transactionId = await transactionIdCreator()

            wallet.balance += order.totalAmount
            wallet.payments.push({
                amount: order.totalAmount,
                type: "credit",
                description: `Refund amount of cancel order of ${order.orderId}`,
                transactionId
            })
            order.transactions.push({
                amound: order.totalAmount,
                paymentMethod: "Wallet",
                status: "refunded",
                transactionId
            })

            await wallet.save()
        }

        order.paymentStatus = "refunded"

        await order.save();

        res.status(SUCCESS).json({
            success: true,
            message: "Order cancelled successfully!",
            order,
        });

    } catch (error) {
        res.status(SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};


export const cancelOrderitemService = async (req, res) => {
    const { userId, reason, sku, status } = req.body;
    const { orderId } = req.params;

    try {
        if (!userId) {
            return res.status(UNAUTHORIZED).json({ success: false, message: "Not authorized!" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(NOT_FOUND).json({ success: false, message: "Order not found!" });
        }

        const item = order.items.find((item) => item.sku === sku);
        if (!item) {
            return res.status(NOT_FOUND).json({ success: false, message: "Order item not found!" });
        }

        const product = await productModel.findById(item.productId);
        if (!product) {
            return res.status(NOT_FOUND).json({ success: false, message: "Product not found!" });
        }

        const variant = product.variants.find((v) => v.sku === sku);
        if (variant) {
            variant.quantity += item.quantity;
            await product.save();
        }

        let orderFullAmount = order.totalAmount

        item.status = status || "cancelled";
        item.cancelReason = reason;

        const allCancelled = order.items.every((i) => i.status === "cancelled");
        if (allCancelled) {
            order.orderStatus = "cancelled";
            order.subTotal = order.items.reduce((sum, item) => sum + item.quantity * item.salePrice, 0)
            order.taxAmount = Math.floor((order.subTotal) * TAX_PERCENT)
            order.totalAmount = order.subTotal + order.taxAmount + order.deliveryFee
        }
        else {
            let activeItems = order.items.filter((item) => item.status !== "cancelled")
            order.subTotal = activeItems.reduce((sum, item) => sum + item.quantity * item.salePrice, 0)
            order.taxAmount = Math.floor((order.subTotal) * TAX_PERCENT)
            order.totalAmount = order.subTotal + order.taxAmount + order.deliveryFee
        }

        if (order.paymentMethod != "COD") {

            let refundAmount;
            if (allCancelled) {
                refundAmount = orderFullAmount
            }
            else {
                refundAmount = item.subTotal + (item.subTotal * TAX_PERCENT)

                if (order.couponId && order.couponAmount > 0) {
                    const coupon = await couponModel.findById(order.couponId);

                    if (coupon) {
                        if (order.subTotal < coupon.minPurchase) {
                            refundAmount -= order.couponAmount;
                            order.couponId = null;
                            order.couponAmount = 0;
                        } else {
                            const itemSubTotal = item.quantity * item.salePrice;

                            let discountValue = 0;
                            if (typeof coupon.discount === "string" && coupon.discount.includes("%")) {
                                discountValue = parseFloat(coupon.discount.replace("%", "")) / 100;
                            } else {
                                discountValue = Number(coupon.discount);
                            }
                            const couponShare = order.couponAmount / order.items.length

                            refundAmount -= couponShare;
                        }
                    }
                }
            }

            refundAmount = Math.round(refundAmount);

            let wallet = await walletModel.findOne({ userId })

            if (!wallet) {
                wallet = new walletModel({ userId: order.userId, balance: 0, payments: [] });
            }

            let transactionId = await transactionIdCreator()

            wallet.balance += refundAmount
            wallet.payments.push({
                amount: refundAmount,
                type: "credit",
                description: `Refund amount of cancel item ${item.sku} of order ${order.orderId} `,
                transactionId
            })
            order.transactions.push({
                amount: refundAmount,
                paymentMethod: "Wallet",
                status: "refunded",
                transactionId
            })

            await wallet.save()

        }
        else {
            if (order.transactions) {
                order.transactions[0].amount = order.totalAmount
            }
        }

        await order.save();

        return res.status(SUCCESS).json({
            success: true,
            message: "Order item cancelled!",
            order,
        });

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
};


export const returnOrderService = async (req, res) => {
    const { orderId } = req.params;
    const { reason, status } = req.body;

    try {

        let order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(NOT_FOUND).json({ success: false, message: "Order not found !" })
        }

        order.orderStatus = status || "return-requested";
        order.items.forEach(item => {
            if (item.status == "delivered") {
                item.returnReason = reason
                item.status = status || "return-requested"
            }
        })

        await order.save()

        res.status(SUCCESS).json({ success: true, message: "Order return requsted", order })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const returnOrderItemService = async (req, res) => {
    const { orderId } = req.params;
    const { sku, reason, status } = req.body;

    try {

        let order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(NOT_FOUND).json({ success: false, message: "Order not found !" })
        }

        const item = order.items.find((i) => i.sku === sku);
        if (!item) {
            return res.status(NOT_FOUND).json({ success: false, message: "Item not found in order!" });
        }

        item.status = status || "return-requested"
        item.returnReason = reason

        let allReturned = order.items.every(i => i.status == "return-requested")

        if (allReturned) {
            order.orderStatus = status || "return-requested"
            for (let item of order.items) {
                item.status = status || "return-requested"
                item.returnReason = reason
            }
        }

        await order.save()

        res.status(SUCCESS).json({ success: true, message: "Return requested successfully !", order })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}


export const downloadOrderInvoiceService = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orderModel.findById(orderId).populate("userId");
    if (!order) {
      return res.status(NOT_FOUND).json({ success: false, message: "Order not found!" });
    }

    // Split items by status
    const deliveredItems = order.items.filter(i => i.status !== "cancelled" && i.status !== "returned");
    const cancelledItems = order.items.filter(i => i.status === "cancelled");
    const returnedItems = order.items.filter(i => i.status === "returned");

    // Compute dynamic subtotals
    const deliveredSubtotal = deliveredItems.reduce((sum, i) => sum + i.quantity * i.salePrice, 0);
    const cancelledSubtotal = cancelledItems.reduce((sum, i) => sum + i.quantity * i.salePrice, 0);
    const returnedSubtotal = returnedItems.reduce((sum, i) => sum + i.quantity * i.salePrice, 0);

    const couponDiscount = order.couponAmount || 0;
    const deliveryFee = order.deliveryFee || 0;

    // Base subtotal (before tax)
    const baseSubtotal = deliveredSubtotal - couponDiscount + deliveryFee;

    // Tax 18%
    const taxAmount = Math.floor(Math.max(0, baseSubtotal) * TAX_PERCENT);

    // Final payable total
    let totalPayable = Math.max(0, baseSubtotal + taxAmount);
    totalPayable = Math.round(totalPayable)    

    //GENERATE PDF 
    const doc = new PDFDocument({ margin: 50 });
    const filename = `Invoice_${order.orderId}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    doc.pipe(res);

    // HEADER
    doc.fontSize(20).text("Order Invoice", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Order ID: ${order.orderId}`);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${order.userId?.fullname || "N/A"}`);
    doc.text(`Email: ${order.userId?.email || "N/A"}`);
    doc.text(`Address: ${order?.address?.address || "N/A"}`);
    doc.text(`${order?.address?.pincode || "N/A"}`);
    doc.text(`${order?.address?.district || "N/A"}`);
    doc.text(`${order?.address?.state || "N/A"}`);
    doc.moveDown(1.5);

    // ITEMS
    doc.fontSize(14).text("Order Items", { underline: true });
    doc.moveDown(0.5);

    order.items.forEach((item, index) => {
      const subTotal = item.quantity * item.salePrice;
      doc
        .fontSize(12)
        .text(`${index + 1}. ${item.sku}`)
        .text(`   Quantity: ${item.quantity}`)
        .text(`   Price: Rs ${item.salePrice}`)
        .text(`   Subtotal: Rs ${subTotal}`)
        .text(`   Status: ${item.status.toUpperCase()}`)
        .moveDown(0.5);
    });

    //  SUMMARY 
    doc.moveDown(1);
    doc.fontSize(14).text("Payment Summary", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`Subtotal (Delivered Items): Rs ${deliveredSubtotal.toFixed(2)}`);
    if (cancelledSubtotal > 0)
      doc.text(`Cancelled Items Amount: - Rs ${cancelledSubtotal.toFixed(2)}`);
    if (returnedSubtotal > 0)
      doc.text(`Returned Items Amount: - Rs ${returnedSubtotal.toFixed(2)}`);
    if (couponDiscount > 0)
      doc.text(`Coupon Discount: - Rs ${couponDiscount.toFixed(2)}`);
    doc.text(`Delivery Fee: Rs ${deliveryFee.toFixed(2)}`);
    doc.text(`Tax (18%): Rs ${taxAmount.toFixed(2)}`);
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold")
      .fontSize(13)
      .text(`Total Payable: Rs ${totalPayable.toFixed(2)}`, { align: "left" });
    doc.font("Helvetica");

    // FOOTER 
    doc.moveDown(2);
    doc.fontSize(10).text("Thank you for shopping with us!", { align: "center" });
    doc.fontSize(9).text("This is a system-generated invoice.", { align: "center" });

    doc.end();

  } catch (error) {
    res.status(SERVER_ERROR).json({ success: false, message: error.message });
  }
};




export const verifyPaymentService = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId, address, products, subTotal, deliveryFee,
            taxAmount, totalAmount, couponId, couponAmount } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZOR_PAY_API_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(BAD_REQUEST).json({
                success: false,
                message: "Invalid payment signature — Payment not verified!"
            });
        }

        for (let product of products) {
            await productModel.updateOne(
                { _id: product.productId, "variants.sku": product.sku },
                { $inc: { "variants.$.quantity": -product.quantity } }
            );
        }

        const cart = await cartModel.findOne({ userId });
        if (cart) {
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();
        }

        const order = new orderModel({ userId, orderId, address, items: products, subTotal, deliveryFee, taxAmount, totalAmount, 
            paymentMethod: "Razorpay",
            paymentStatus: "paid",
            transactions: [
                {
                    amount: totalAmount,
                    paymentMethod: "Razorpay",
                    transactionId: razorpay_payment_id,
                    status: "paid"
                },
            ],
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        });

        if (couponId) {
            order.couponId = couponId;
            order.couponAmount = couponAmount;
        }

        await order.save();

        return res.status(SUCCESS).json({
            success: true,
            message: "Payment verified & order placed successfully!",
            order,
        });

    } catch (error) {
        return res.status(SERVER_ERROR).json({ success: false, message: error.message });
    }
}