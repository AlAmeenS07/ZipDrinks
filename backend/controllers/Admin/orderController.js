import { approveOrderItemReturnService, approveOrderReturnService, changeOrderStatusService, getOrdersService, getSingleOrderService } from "../../Services/Admin/orderService.js"

// get orders
export const getOrders = async(req , res)=>{
    await getOrdersService(req , res)
}

// get single order
export const getSingleOrder = async(req , res)=>{
    await getSingleOrderService(req , res)   
}

// change order status
export const changeOrderStatus = async(req , res)=>{
    await changeOrderStatusService(req , res)
}

// approve order return
export const approveOrderReturn = async(req , res)=>{
    await approveOrderReturnService(req , res)
}

// approve order item return
export const approveOrderItemReturn = async(req , res)=>{
    await approveOrderItemReturnService(req , res)   
}