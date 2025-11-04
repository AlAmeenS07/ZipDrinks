import React from 'react'
import { Printer, User, Mail, Phone, MapPin, Package } from 'lucide-react';


const OrderDetailsInfo = ({ order }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL; 

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-gray-900">Order - {order?.orderId}</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
              {order.orderStatus}
            </span>
            <span className='text-red-400'>{order?.items?.every(item => item.cancelReason == "none" && item.status == "cancelled") ? "cancelled by admin" : ""}</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => window.open(`${backendUrl}/api/order/invoice/${order._id}`, "_blank")}>
          <Printer className="w-4 h-4" />
          Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Order Date</div>
              <div className="text-sm font-medium text-gray-900">{new Date(order?.orderDate).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Payment Method</div>
              <div className="text-sm font-medium text-gray-900">{order?.paymentMethod}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer</h3>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Customer</div>
              <div className="text-sm font-medium text-gray-900">{order?.userId?.fullname}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="text-sm font-medium text-gray-900">{order?.userId?.email}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Phone</div>
              <div className="text-sm font-medium text-gray-900">{order?.userId?.phone}</div>
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Address</h3>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Deliver to</div>
              <div className="text-sm font-medium text-gray-900">
                <p>{order?.address?.address}</p>
                <p>{order?.address?.district}</p>
                <p>Landmark : {order?.address?.landmark}</p>
                <p>Phone : {order?.address?.phone}</p>
                <p>Pincode : {order?.address?.pincode}</p>
                <p className="font-medium">{order?.address?.state}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsInfo
