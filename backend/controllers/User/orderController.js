import { cancelOrderitemService, cancelOrderService, downloadOrderInvoiceService, getSingleOrderService, getUserOrderService, placeOrderService, returnOrderItemService, returnOrderService } from "../../Services/User/orderService.js"


// place order
export const placeOrder = async(req , res)=>{
    await placeOrderService(req , res)
}

// get user order
export const getUserOrder = async(req , res)=>{
    await getUserOrderService(req , res)
}

// get single order
export const getSingleOrder = async(req , res)=>{
    await getSingleOrderService(req , res)
}

// cancel order
export const cancelOrder = async(req , res)=>{
    await cancelOrderService(req , res)
}

// cancel order item
export const cancelOrderitem = async(req , res)=>{
    await cancelOrderitemService(req , res)
}

// return order
export const returnOrder = async(req , res)=>{
    await returnOrderService(req , res)
}

// return order item
export const returnOrderItem = async(req , res)=>{
    await returnOrderItemService(req , res)
}

// invoice download
export const downloadOrderInvoice = async(req , res)=>{
    await downloadOrderInvoiceService(req , res)
}