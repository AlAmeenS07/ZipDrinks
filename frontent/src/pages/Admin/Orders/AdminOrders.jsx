import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, ChevronDown, Loader } from 'lucide-react';
import AdminMain from "../../../Components/Admin/AdminMain";
import axiosInstance from '../../../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';
import Pagination from '../../../Components/pagination';

export default function AdminOrders() {
  const [query, setQuery] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(query.get('search') || '');
  const [activeTab, setActiveTab] = useState(query.get('range') || 'All Time');
  const [currentPage, setCurrentPage] = useState(Number(query.get('page')) || 1);
  const [orders, setOrders] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedDate, setSelectedDate] = useState(query.get('date') || '');
  const [selectedStatus, setSelectedStatus] = useState(query.get('status') || '');
  const [loading, setLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);


  const itemsPerPage = 20;

  useEffect(() => {
    const delay = setTimeout(() => {
      setQuery({
        search: searchQuery,
        page: currentPage.toString(),
        status: selectedStatus,
        date: selectedDate.toString(),
        range: activeTab,
      });
    }, 200);

    return () => clearTimeout(delay);
  }, [searchQuery, currentPage, selectedStatus, selectedDate, activeTab, setQuery]);

  const tabs = ['All Time', '12 Months', '30 Days', '7 Days', '24 Hours'];
  const statuses = ['pending', 'processing', 'out-for-delivery', 'delivered'];
  const filterStatuses = [
    'pending',
    'processing',
    'out-for-delivery',
    'delivered',
    'cancelled',
    'return-requested',
    'returned',
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    "Out for Delivery": "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    "Return Requested": "bg-purple-100 text-purple-800",
    "out-for-delivey": "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800"
  };

  useEffect(() => {
    async function getOrders() {
      const params = {
        search: searchQuery,
        page: currentPage.toString(),
        status: selectedStatus,
        date: selectedDate.toString(),
        range: activeTab,
        limit: itemsPerPage
      };

      try {
        setLoading(true);
        let { data } = await axiosInstance.get('/api/admin/orders', { params });

        if (data.success) {
          setOrders(data.orders);
          setTotalOrders(data.totalOrders || 0);
          setTotalPages(data.totalPages || 1);
        } else {
          setOrders([]);
          toast.error(data.message);
        }
      } catch (error) {
        setOrders([]);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }

    getOrders();
  }, [searchQuery, currentPage, selectedStatus, selectedDate, activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setOpenDropdown(null);
    }
  };

  return (
    <AdminMain>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Dashboard</span>
              <span>/</span>
              <span>Order List</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm mb-4">
            <div className="border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Order..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Select Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Filter by Status</option>
                  {filterStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader className="animate-spin text-gray-600" size={30} />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <p className="text-lg font-medium">No orders found</p>
                  <p className="text-sm">Try adjusting your search or filter options.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-700 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Order Id</th>
                        <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Payment</th>
                        <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Order Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-blue-600 font-medium text-sm truncate max-w-[120px]">
                            {order.orderId}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {order.userId.fullname}
                            <div className="text-xs text-gray-500">{order.userId.email}</div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            ₹{order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{order.paymentMethod}</td>
                          <td className="px-4 py-4 relative">
                            <button
                              onClick={() =>
                                setOpenDropdown(openDropdown === order._id ? null : order._id)
                              }
                              disabled={order.orderStatus == "delivered" || order.orderStatus == "cancelled" || order.orderStatus == "returned" || order.orderStatus == "return-requested"}
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] ||
                                "bg-gray-100 text-gray-700"
                                } ${order.orderStatus == "cancelled" || order.orderStatus == "delivered" || order.orderStatus == "returned" || order.orderStatus == "return-requested" ? "cursor-not-allowed" : ""}`}
                            >
                              {order.orderStatus}
                              <ChevronDown className="w-4 h-4" />
                            </button>

                            {openDropdown === order._id && (
                              <div className="absolute z-10 mt-2 bg-white border rounded-md shadow-md w-40">
                                {statuses.map((status, index) => {

                                  if (index > statuses.indexOf(order.orderStatus)) {
                                    return (
                                      <button
                                        key={status}
                                        onClick={() => handleStatusChange(order._id, status)}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${order.orderStatus === status
                                          ? "text-green-600 font-semibold"
                                          : "text-gray-700"
                                          }`}
                                      >
                                        {status}
                                      </button>
                                    )
                                  }

                                })}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <Link to={`/admin/orders/${order._id}`} className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {orders.length > 0 && (
                <div className="flex justify-between items-center px-4 py-3 border-t text-sm text-gray-700">
                  <span>
                    Page {currentPage} of {totalPages} — {totalOrders} total orders
                  </span>

                  <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
                  
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </AdminMain>
  );
}
