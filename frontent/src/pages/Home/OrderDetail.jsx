
import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, CreditCard, Package, Printer } from 'lucide-react';
import UserProfileMain from '../../Components/UserProfileMain';
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../../Helper/AxiosInstance'
import OrderStatus from '../../Components/Admin/OrderStatus';
import Swal from 'sweetalert2';


const OrderDetail = () => {

    const { orderId } = useParams()
    const [order, setOrder] = useState({})

    useEffect(() => {
        async function getOrder() {
            try {

                let { data } = await axiosInstance.get(`/api/order/${orderId}`)
                if (data.success) {
                    setOrder(data.orderDetail)
                }
                else {
                    toast.error(data.message)
                }

            } catch (error) {
                toast.error(error.message)
            }
        }
        getOrder()
    }, [])

    async function handleItemCancel(orderId, sku, status) {
        const { value: reason } = await Swal.fire({
            title: 'Cancel Order',
            input: 'text',
            inputLabel: 'Please enter a reason for cancellation:',
            inputPlaceholder: 'Type your reason here...',
            inputValidator: (value) => {
                if (!value.trim()) {
                    return 'Reason is required!';
                }
                if(value.length > 25){
                    return 'Reason must be lessthan 25 letters !'
                }
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Close',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
        });

        if (reason) {
            try {
                const { data } = await axiosInstance.put(`/api/order/${orderId}/cancel-item`, { sku, reason, status });
                if (data.success) {
                    toast.success('Order item cancelled successfully');
                    setOrder(data.order)
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error?.response?.data.message);
            }
        }
    }


    async function handleItemReturn(orderId, sku, status) {
        const { value: reason } = await Swal.fire({
            title: 'Return Order item',
            text: 'Note: Only one return is possible item/order',
            input: 'select',
            inputOptions: {
                damage: 'damage',
                "mind-changed": 'mind-changed',
                other: 'other',
            },
            inputPlaceholder: 'Select a reason',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Close',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please select a reason!';
                }
            },
        });

        if (reason) {
            try {
                const { data } = await axiosInstance.patch(`/api/order/${orderId}/return-item`, { sku, reason, status });
                if (data.success) {
                    toast.success('Order item return requested successfully');
                    setOrder(data.order)
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message);
            }
        }
    }

    const isReturn = order?.items?.some(i => i.status == "return-requested" || i.status == "returned")

    async function downloadInvoice() {
        try {
            const response = await axiosInstance.get(`/api/order/invoice/${orderId}`, {
                responseType: "blob",
            });
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Invoice_${orderId}.pdf`;
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to download invoice", error.message);
        }
    };


    return (
        <UserProfileMain>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">

                    <nav className="text-sm text-gray-500 mb-4" aria-label="breadcrumb">
                        <ol className="list-reset flex">
                            <li>
                                <Link to="/" className="text-blue-600 hover:underline">Home</Link>
                            </li>
                            <li><span className="mx-2">/</span></li>
                            <li>
                                <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
                            </li>
                            <li><span className="mx-2">/</span></li>
                            <li>
                                <Link to="/orders" className="text-blue-600 hover:underline">My Orders</Link>
                            </li>
                            <li><span className="mx-2">/</span></li>
                            <li className="text-gray-700">Order Detail</li>
                        </ol>
                    </nav>

                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8">
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">Order Details</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <div className="lg:col-span-2 space-y-6">

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm text-gray-600">Order ID: <span className="font-medium text-gray-900">{order?.orderId}</span></p>
                                            <p className="text-sm text-gray-600">Placed on: <span className="font-medium text-gray-900">{`${new Date(order?.orderDate).toLocaleDateString()} - ${new Date(order?.orderDate).toLocaleTimeString()}`}</span></p>
                                        </div>
                                        <div>
                                            <span className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                                {order?.orderStatus}
                                            </span>
                                            {order?.items?.every(item => item.cancelReason == "none") && order?.orderStatus == "cancelled" ?
                                                <p className='text-red-500'>Your order cancelled by admin</p>
                                                : ""
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Order Items
                                    </h2>

                                    {order?.items?.map((product) => (
                                        <div
                                            key={product?.sku}
                                            className={`border rounded-lg p-4 ${product.status === "cancelled" ? "bg-gray-50 opacity-60" : "bg-white"
                                                }`}
                                        >
                                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">

                                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">

                                                    <div className="w-24 h-24 flex-shrink-0">
                                                        <img
                                                            src={product?.coverImage}
                                                            alt={product?.sku}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                                                            {product?.sku}
                                                        </h3>
                                                        <div className="space-y-1 text-sm text-gray-600">
                                                            <p>
                                                                Quantity:{" "}
                                                                <span className="font-medium text-gray-900">{product?.quantity}</span>
                                                            </p>
                                                            <p>
                                                                Price:{" "}
                                                                <span className="font-medium text-gray-900">
                                                                    ₹ {product?.salePrice}
                                                                </span>
                                                            </p>
                                                            {product.status === "cancelled" && (
                                                                <p className="text-red-600 font-medium">Status: {product.status}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                                    {order.orderStatus === "delivered" &&
                                                        !isReturn &&
                                                        product.status === "delivered" &&
                                                        order.deliveryDate &&
                                                        (() => {
                                                            const now = new Date();
                                                            const deliveryDate = new Date(order.deliveryDate);
                                                            const diffHours = (now - deliveryDate) / (1000 * 60 * 60);

                                                            if (diffHours <= 12) {
                                                                return (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleItemReturn(orderId, product.sku, "return-requested")
                                                                        }
                                                                        className="w-auto px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded hover:bg-yellow-600 transition-all shadow-sm"
                                                                    >
                                                                        Return Item
                                                                    </button>
                                                                );
                                                            }

                                                            return null;
                                                        })()}

                                                    {product.status == "return-requested" ? (
                                                        <span className="w-auto px-4 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded cursor-not-allowed">
                                                            Return requested
                                                        </span>
                                                    ) : product.status == "returned" ? (
                                                        <span className="w-auto px-4 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded cursor-not-allowed">
                                                            Returned
                                                        </span>
                                                    ) : null}

                                                    {product.status === "processing" || product.status === "pending" ? (
                                                        <button
                                                            className="w-auto px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors whitespace-nowrap"
                                                            onClick={() => handleItemCancel(orderId, product.sku, "cancelled")}
                                                        >
                                                            Cancel Item
                                                        </button>
                                                    ) : product.status === "cancelled" ? (
                                                        <span className="w-auto px-4 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded cursor-not-allowed">
                                                            Cancelled
                                                        </span>
                                                    ) : null}
                                                </div>

                                            </div>
                                        </div>
                                    ))}

                                </div>
                                <OrderStatus order={order} />

                            </div>

                            <div className="space-y-6">

                                <div className="border rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Shipping Address
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <p className="font-medium text-gray-900">{order?.address?.fullname}</p>
                                        <p>{order?.address?.address}</p>
                                        <p>{order?.address?.district}, {order?.address?.state}</p>
                                        <p>Landmark: {order?.address?.landmark}</p>
                                        <p>PIN: {order?.address?.pincode}</p>
                                        <p className="pt-2">Phone: <span className="font-medium">{order?.address?.phone}</span></p>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Payment Method
                                    </h3>
                                    <p className="text-sm text-gray-700 font-medium">{order?.paymentMethod}</p>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium text-gray-900">₹ {(order?.subTotal)?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Delivery Fee</span>
                                            <span className="font-medium text-gray-900">₹ {order?.deliveryFee?.toFixed(2)}</span>
                                        </div>
                                        {order?.couponAmount ? (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Coupon Discount</span>
                                                <span className="font-medium text-gray-900">₹ {order?.couponAmount?.toFixed(2)}</span>
                                            </div>
                                        ) : ""}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tax Amount</span>
                                            <span className="font-medium text-gray-900">₹ {order?.taxAmount?.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between">
                                            <span className="font-semibold text-gray-900">Total</span>
                                            <span className="font-semibold text-gray-900 text-lg">₹ {order?.totalAmount?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                                        onClick={downloadInvoice}>
                                        <Printer className="w-4 h-4" />
                                        <span>Download Invoice</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserProfileMain>
    );
};

export default OrderDetail;