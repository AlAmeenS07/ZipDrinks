import logger from "../../logger.js";
import cartModel from "../../models/cartModel.js"
import orderModel from "../../models/orderModel.js"
import productModel from "../../models/productModel.js"
import PDFDocument from "pdfkit";


export const placeOrderService = async (req, res) => {
    const { address, products, subTotal, deliveryFee, taxAmount, totalAmount, paymentMethod, userId } = req.body

    if (!userId) {
        return res.status(401).json({ success: false, message: "Not Authorized !" })
    }

    try {

        if (Object.keys(address).length == 0 || products.length == 0 || !subTotal || !taxAmount || !totalAmount || !paymentMethod) {
            return res.status(400).json({ success: false, message: "Something wrong ! Missing fields !" })
        }

        for (let product of products) {
            let isProduct = await productModel.findOne({ _id: product.productId, isListed: true })
            if (!isProduct) {
                return res.status(404).json({ success: false, message: `${product.name} is not found !` })
            }

            let productVariant = isProduct.variants.find(prd => prd.sku == product.sku)
            if (!productVariant) {
                return res.status(404).json({ success: false, message: `${product.sku} size is not found !` })
            }

            if (productVariant.quantity < product.quantity) {
                return res.status(409).json({ success: false, message: `${product.name} is just sold out !` })
            }
        }

        const orderId = `ORD-${new Date().getFullYear()}${(new Date().getMonth() + 1)
            .toString().padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-${Date.now()}`;


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

        let order = orderModel({
            userId, orderId, address, items: products, subTotal, deliveryFee,
            taxAmount, totalAmount, paymentMethod, transactions: [{ amount: totalAmount, paymentMethod }]
        })

        await order.save();

        res.status(200).json({ success: true, message: "Order successfull", order })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
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
            return res.status(401).json({ success: false, message: "Not authorized !" })
        }

        const totalOrders = await orderModel.countDocuments(query);

        let orders = await orderModel.find(query).sort({ createdAt: -1 }).skip(skipItems).limit(limitPerPage)

        if (!orders) {
            return res.status(404).json({ success: false, message: "Orders not found !" })
        }

        res.status(200).json({
            success: true, message: "Orders fetched successfully", orders, totalOrders,
            currentPage: pageNum, totalPages: Math.ceil(totalOrders / limitPerPage)
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const getSingleOrderService = async (req, res) => {
    const { userId } = req
    const { orderId } = req.params;

    try {

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized !" })
        }

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Something went wrong !" })
        }

        let orderDetail = await orderModel.findById(orderId)

        if (!orderDetail) {
            return res.status(404).json({ success: false, message: "Order not found !" })
        }

        res.status(200).json({ success: true, message: "Order fetched Successfully !", orderDetail })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const cancelOrderService = async (req, res) => {

    const { reason, status, userId } = req.body;
    const { orderId } = req.params;

    try {
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized!" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found!" });
        }

        if (order.orderStatus !== "pending" && order.orderStatus !== "processing") {
            return res.status(409).json({ success: false, message: "This order cannot be cancelled now!" });
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

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully!",
            order,
        });

    } catch (error) {
        res.status(500).json({
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
            return res.status(401).json({ success: false, message: "Not authorized!" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found!" });
        }

        const item = order.items.find((item) => item.sku === sku);
        if (!item) {
            return res.status(404).json({ success: false, message: "Order item not found!" });
        }

        const product = await productModel.findById(item.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        const variant = product.variants.find((v) => v.sku === sku);
        if (variant) {
            variant.quantity += item.quantity;
            await product.save();
        }

        item.status = status || "cancelled";
        item.cancelReason = reason;


        const allCancelled = order.items.every((i) => i.status === "cancelled");
        if (allCancelled) {
            order.orderStatus = "cancelled";
            order.subTotal = order.items.reduce((sum, item) => sum + item.quantity * item.salePrice, 0)
            order.deliveryFee = order.subTotal < 100 ? 70 : 0
            order.taxAmount = Math.floor((order.subTotal + order.deliveryFee) * 0.18)
            order.totalAmount = order.subTotal + order.taxAmount + order.deliveryFee
        }
        else {
            let activeItems = order.items.filter((item) => item.status !== "cancelled")
            order.subTotal = activeItems.reduce((sum, item) => sum + item.quantity * item.salePrice, 0)
            order.deliveryFee = order.subTotal < 100 ? 70 : 0
            order.taxAmount = Math.floor((order.subTotal + order.deliveryFee) * 0.18)
            order.totalAmount = order.subTotal + order.taxAmount + order.deliveryFee
        }

        if (order.paymentMethod == "COD") {
            if (order.transactions) {
                order.transactions[0].amount = order.totalAmount
            }
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order item cancelled!",
            order,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const returnOrderService = async (req, res) => {
    const { orderId } = req.params;
    const { reason, status } = req.body;

    try {

        let order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found !" })
        }

        order.orderStatus = status || "return-requested";
        order.items.forEach(item => {
            if (item.status == "delivered") {
                item.returnReason = reason
                item.status = status || "return-requested"
            }
        })

        await order.save()

        res.status(200).json({ success: true, message: "Order return requsted", order })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const returnOrderItemService = async (req, res) => {
    const { orderId } = req.params;
    const { sku, reason, status } = req.body;

    try {

        let order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found !" })
        }

        const item = order.items.find((i) => i.sku === sku);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found in order!" });
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

        res.status(200).json({ success: true, message: "Return requested successfully !", order })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const downloadOrderInvoiceService = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await orderModel.findById(orderId).populate("userId");
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found!" });
        }

        const deliveredItems = order.items.filter(i => i.status != "cancelled" && i.status != "returned");
        const cancelledItems = order.items.filter(i => i.status === "cancelled");
        const returnedItems = order.items.filter(i => i.status === "returned");

        const deliveredSubtotal = deliveredItems.reduce((sum, i) => sum + i.subTotal, 0) || 0;
        const cancelledTotal = cancelledItems.reduce((sum, i) => sum + i.subTotal, 0);
        const returnedTotal = returnedItems.reduce((sum, i) => sum + i.subTotal, 0);

        const preTaxAmount = deliveredSubtotal;
        const safePreTax = Math.max(0, preTaxAmount);

        const deliveryFee = safePreTax < 100 && safePreTax > 0 ? 70 : 0;
        const taxAmount = Math.round((safePreTax + deliveryFee) * 0.18);
        const totalAmount = safePreTax + deliveryFee + taxAmount;

        // ====== GENERATE PDF ======
        const doc = new PDFDocument({ margin: 50 });
        const filename = `Invoice_${order.orderId}.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        doc.pipe(res);

        // ====== HEADER ======
        doc.fontSize(20).text("Order Invoice", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Order ID: ${order.orderId}`);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
        doc.text(`Customer: ${order.userId?.fullname || "N/A"}`);
        doc.text(`Email: ${order.userId?.email || "N/A"}`);
        doc.moveDown(1.5);

        // ====== ITEMS SECTION ======
        doc.fontSize(14).text("Items Summary", { underline: true });
        doc.moveDown(0.5);

        order.items.forEach((item, index) => {
            doc.fontSize(12)
                .text(`${index + 1}. ${item.sku}`)
                .text(`   Quantity: ${item.quantity}`)
                .text(`   Price: Rs. ${item.salePrice}`)
                .text(`   Subtotal: Rs. ${item.subTotal}`)
                .text(`   Status: ${item.status.toUpperCase()}`)
                .moveDown(0.5);
        });

        // ====== PAYMENT SUMMARY ======
        doc.moveDown(1);
        doc.fontSize(14).text("Payment Summary", { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(12).text(`Subtotal (Delivered Items): Rs. ${deliveredSubtotal.toFixed(2)}`);
        if (cancelledTotal > 0) doc.text(`Cancelled Items Amount: - Rs. ${cancelledTotal.toFixed(2)}`);
        if (returnedTotal > 0) doc.text(`Returned Items Amount: - Rs. ${returnedTotal.toFixed(2)}`);
        doc.text(`Tax (18%): Rs. ${taxAmount.toFixed(2)}`);
        doc.text(`Delivery Fee: Rs. ${deliveryFee.toFixed(2)}`);
        doc.moveDown(0.5);
        doc.fontSize(13).text(`Total Payable: Rs. ${totalAmount.toFixed(2)}`, { bold: true });

        // ====== FOOTER ======
        doc.moveDown(2);
        doc.fontSize(10).text("Thank you for shopping with us!", { align: "center" });
        doc.fontSize(9).text("This is a system-generated invoice.", { align: "center" });

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

