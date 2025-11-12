import express from "express"
import { getUserId, userAuth } from "../middlewares/User/userAuth.js"
import { cancelOrder, cancelOrderitem, downloadOrderInvoice, getSingleOrder, getUserOrder, placeOrder, returnOrder, returnOrderItem, verifyPayment } from "../controllers/User/orderController.js"

const orderRouter = express.Router()

orderRouter.post('/place-order' , userAuth , placeOrder)
orderRouter.get('/' , getUserId , getUserOrder)
orderRouter.get('/:orderId' , getUserId , getSingleOrder)
orderRouter.put('/:orderId/cancel' , userAuth , cancelOrder)
orderRouter.put('/:orderId/cancel-item' , userAuth , cancelOrderitem)
orderRouter.patch('/:orderId/return' , returnOrder)
orderRouter.patch('/:orderId/return-item' , returnOrderItem)
orderRouter.get('/invoice/:orderId' , downloadOrderInvoice)
orderRouter.post('/verify-payment' , verifyPayment)

export default orderRouter