import React from 'react';
import { ChevronLeft, ChevronRight, Eye, FileText, Loader, Printer, Search, XCircle } from 'lucide-react';
import UserProfileMain from '../../Components/UserProfileMain';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../Helper/AxiosInstance';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from "sweetalert2"
import Pagination from '../../Components/pagination';

const MyOrders = () => {

    const [query, setQuery] = useSearchParams()

    const navigate = useNavigate()
    const [orders, setOrders] = useState([])

    const [currentPage, setCurrentPage] = useState(query.get('page') || 1)
    const [searchTerm, setSearchTerm] = useState(query.get('search') || '')
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        setQuery({
            search: searchTerm,
            page: currentPage
        })
    }, [currentPage, searchTerm, setQuery])

    useEffect(() => {
        async function getUserOrders() {

            const params = {
                page: currentPage,
                search: searchTerm,
                limit: itemsPerPage
            }

            setLoading(true)
            try {
                let { data } = await axiosInstance.get('/api/order', { params })

                if (data.success) {
                    setOrders(data.orders)
                    setTotalPages(data.totalPages)
                }
                else {
                    toast.error(data.message)
                }

            } catch (error) {
                toast.error(error.message)
            }
            finally {
                setLoading(false)
            }
        }
        getUserOrders()
    }, [searchTerm, currentPage])

    async function handleCancel(orderId, status) {
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
                    return 'Reason must be lessthan 25 charectors !'
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
                const { data } = await axiosInstance.put(`/api/order/${orderId}/cancel`, { reason, status });
                if (data.success) {
                    toast.success('Order cancelled successfully');
                    setOrders((prev) =>
                        prev.map((order) =>
                            order._id == orderId ? { ...order, orderStatus: 'cancelled' } : order
                        )
                    );
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message);
            }
        }
    }

    async function handleReturn(orderId, status) {
        const { value: reason } = await Swal.fire({
            title: 'Return Order',
            text: 'Note: Only one return is possible',
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
                const { data } = await axiosInstance.patch(`/api/order/${orderId}/return`, {
                    reason,
                    status,
                });

                if (data.success) {
                    toast.success('Order return-requested successfully');
                    setOrders((prev) =>
                        prev.map((order) =>
                            order._id === orderId
                                ? { ...order, orderStatus: 'return-requested' }
                                : order
                        )
                    );
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    }


    const downloadInvoice = async (orderId) => {
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



    if (loading) {
        return (
            <UserProfileMain>
                <div className="flex justify-center items-center h-screen">
                    <Loader className="animate-spin text-gray-600" size={40} />
                </div>
            </UserProfileMain>
        );
    }

    return (
        <UserProfileMain>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
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
                            <li className="text-gray-700">My Orders</li>
                        </ol>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">

                        <h1 className="text-3xl font-semibold mb-3 sm:mb-0">My Orders</h1>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

                            <input
                                type="text"
                                placeholder="Search Order..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                            />

                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <div className="space-y-6">
                            {orders?.length == 0 ? <p className='text-center'>No Order Found</p> : orders?.map((order) => {
                                const isReturned = order?.items?.some(i => i.status == "return-requested" || i.status == "returned")
                                return (
                                    <div key={order.orderId} className="border-b last:border-b-0 pb-6 last:pb-0">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                                            <div className="flex -space-x-2">
                                                {order?.items?.map(item => (
                                                    <img
                                                        key={item?.coverImage}
                                                        src={item?.coverImage}
                                                        alt="Product"
                                                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">
                                                    {order?.orderId}
                                                </h3>
                                                <p className="text-gray-700 mb-1">Total Amount : ₹ {order?.totalAmount.toFixed(2)}</p>
                                                <p className="text-gray-600 text-sm mb-1">items: {order?.items?.length}</p>
                                                <p className="text-gray-500 text-sm">order date : {new Date(order?.orderDate).toLocaleDateString()}</p>
                                            </div>

                                            <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[250px]">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600 text-sm">Status:</span>
                                                    <span className={`font-medium ${order?.orderStatus}`}>
                                                        {order?.orderStatus}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-2">

                                                    <button
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors"
                                                        onClick={() => navigate(`/orders/${order._id}`)}
                                                    >
                                                        <Eye size={16} />
                                                        View Details
                                                    </button>

                                                    <button className=" flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                                        onClick={() => downloadInvoice(order._id)}>
                                                        <Printer className="w-4 h-4" />
                                                        <span>Invoice</span>
                                                    </button>

                                                    {(order.orderStatus === "pending" || order.orderStatus === "processing") && (
                                                        <button
                                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                                            onClick={() => handleCancel(order._id, "cancelled")}
                                                        >
                                                            <XCircle size={16} />
                                                            Cancel Order
                                                        </button>
                                                    )}

                                                    {order.orderStatus === "delivered" && (
                                                        <>
                                                            {(() => {
                                                                if (!order.deliveryDate) return null;

                                                                const now = new Date();
                                                                const deliveryDate = new Date(order.deliveryDate);
                                                                const diffHours = (now - deliveryDate) / (1000 * 60 * 60);

                                                                if (diffHours <= 12 && !isReturned) {
                                                                    return (
                                                                        <button
                                                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                                                                            onClick={() => handleReturn(order._id, "return-requested")}
                                                                        >
                                                                            Return Order
                                                                        </button>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}

                                                        </>
                                                    )}

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className='flex justify-center items-center gap-2 mt-8'>
                            <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
                        </div>

                    </div>
                </div>
            </div>
        </UserProfileMain>
    );
};

export default MyOrders;