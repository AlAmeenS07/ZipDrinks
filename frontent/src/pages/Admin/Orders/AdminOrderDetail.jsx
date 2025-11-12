import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../Helper/AxiosInstance";
import AdminMain from "../../../Components/Admin/AdminMain";
import OrderDetailsInfo from "../../../Components/Admin/OrderDetailsInfo";
import OrderStatus from "../../../Components/Admin/OrderStatus";
import Swal from "sweetalert2"

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  useEffect(() => {
    const getSingleOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/api/admin/orders/${orderId}`);
        if (data.success) setOrder(data.order);
        else toast.error(data.message);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getSingleOrder();
  }, [orderId]);

  const handleCancel = async (orderId, newStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to mark this order as ${newStatus}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${newStatus} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosInstance.put(
            `/api/admin/orders/${orderId}/status`,
            { status: newStatus }
          );

          if (data.success) {
            toast.success(`Order has been ${newStatus}`)
            setOrder(data.order)
          } else {
            toast.error("Error!", data.message, "error");
          }
        } catch (error) {
          toast.error("Error!", error.message, "error");
        }
      }
    });
  };

  async function approveOrderReturn(orderId, status) {
    try {

      let { data } = await axiosInstance.patch(`/api/admin/orders/${orderId}/return`, { status })

      if (data.success) {
        toast.success("Return approved successfully")
        setOrder(data.order)
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally {
      setShowStatusModal(false)
    }
  }

  async function approveOrderItemReturn(orderId, sku, status) {
    try {

      let { data } = await axiosInstance.patch(`/api/admin/orders/${orderId}/return-item`, { sku, status })

      if (data.success) {
        toast.success("Order item returned successfully")
        setOrder(data.order)
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
    finally {
      setShowStatusModal(false)
    }
  }


  if (loading) {
    return (
      <AdminMain>
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin text-gray-600" size={40} />
        </div>
      </AdminMain>
    );
  }

  return (
    <AdminMain>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Details</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Dashboard</span>/<span>Order List</span>/<span>Order Details</span>
            </div>
          </div>

          <OrderDetailsInfo order={order} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Order List</h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  {order?.items?.length || 0} Products
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QTY</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order?.items?.map((item) => (
                      <tr key={item.sku}>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                          <img
                            className="w-12 h-12 rounded flex-shrink-0"
                            src={item.coverImage}
                            alt={item.name}
                          />
                          <span className="text-sm text-gray-900">{item.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600">{item.sku}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            className={`px-3 py-1 rounded-full text-xs font-medium ${item?.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : item.status === "return_requested"
                                ? "bg-yellow-100 text-yellow-700"
                                : item.status === "return_approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            onClick={() => {
                              if (item.status === "cancelled" || item.status === "return-requested" || item.status == "returned") {
                                setSelectedItem(item);
                                setShowStatusModal(true);
                              }
                            }}
                          >
                            {item.status}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm">{item.salePrice}</td>
                        <td className="px-6 py-4 text-sm font-medium">{item.subTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {showStatusModal && selectedItem && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
                      <h2 className="text-lg font-semibold mb-3 capitalize">
                        {selectedItem.status === "cancelled" ? "Cancelled Item" : selectedItem.status === "returned" ? "Returned Item" : "Return Request"}
                      </h2>

                      <p className="text-sm mb-3 bg-gray-50 p-3 rounded">
                        <strong>Reason:</strong>{" "}
                        {selectedItem.status === "cancelled" ? selectedItem.cancelReason : selectedItem.status == "returned" ? selectedItem.returnReason : selectedItem.returnReason || "No reason provided."}
                      </p>

                      {selectedItem.status === "return-requested" && (
                        <div className="flex justify-end gap-3">
                          <button
                            className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={() => approveOrderItemReturn(orderId, selectedItem.sku, "returned")}
                          >
                            Approve
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end mt-4">
                        <button
                          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => setShowStatusModal(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="max-w-xs ml-auto space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{order.subTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Charge</span>
                    <span>{order.deliveryFee}</span>
                  </div>
                  {order?.couponAmount ? (
                    <div className="flex justify-between text-sm">
                      <span>Coupon Discount</span>
                      <span>{order?.couponAmount}</span>
                    </div>
                  ) : ""}
                  <div className="flex justify-between text-sm">
                    <span>Tax (18%)</span>
                    <span>{order.taxAmount}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold">
                    <span>Grand Total</span>
                    <span>₹ {order.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 flex items-center justify-center gap-2"
                  onClick={() => navigate("/admin/orders")}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
                {order.orderStatus == "pending" || order.orderStatus == "processing" ? (

                  <button className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => handleCancel(orderId, "cancelled")}>
                    Cancel Order
                  </button>
                )
                  : ""}
              </div>
            </div>

            <OrderStatus order={order} />

            {order.orderStatus == "return-requested" ?
              (
                <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
                  <h2 className="text-lg font-semibold mb-3 capitalize">
                    Return Request
                  </h2>

                  <p className="text-sm mb-3 bg-gray-50 p-3 rounded">
                    <strong>Reason:</strong>{" "}
                    {order?.items.find(i => i.status == "return-requested")?.returnReason || "No reason provided."}
                  </p>

                  <button
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => approveOrderReturn(orderId, "returned")}>
                    Approve
                  </button>
                </div>
              )
              :
              ""
            }
          </div>
        </div>
      </div>
    </AdminMain>
  );
}
