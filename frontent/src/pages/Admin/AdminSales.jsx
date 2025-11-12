import React, { useState } from 'react';
import { Download, Filter, Calendar, TrendingUp, ShoppingCart, DollarSign, Tag, TimerIcon, Loader } from 'lucide-react';
import AdminMain from '../../Components/Admin/AdminMain';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../Helper/AxiosInstance';
import { useSearchParams } from 'react-router-dom';

const AdminSales = () => {

  const [query, setQuery] = useSearchParams()

  const [sales, setSales] = useState([]);
  const [salesData, setSalesData] = useState({})
  const [loading, setLoading] = useState(false)

  const [filterType, setFilterType] = useState(query.get('filter') || 'all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    setQuery({
      filter: filterType,
      startDate: customStartDate,
      endDate: customEndDate
    })
  }, [filterType, customStartDate, customEndDate, setQuery])

  useEffect(() => {
    async function getSales() {
      setLoading(true)
      try {

        const params = {
          filter: filterType,
          startDate: customStartDate,
          endDate: customEndDate
        }

        let { data } = await axiosInstance.get('/api/admin/sales', { params })

        if (data.success) {
          setSales(data.allOrders)
          setSalesData(data.sales)
        }
        else {
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error?.response?.data?.message)
      }
      finally {
        setLoading(false)
      }
    }
    getSales()
  }, [filterType, customStartDate, customEndDate])


  const downloadPDF = async () => {
    try {
      const params = {
        filter: filterType,
        startDate: customStartDate,
        endDate: customEndDate,
      };

      const response = await axiosInstance.get("/api/admin/sales/download-pdf", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Sales_Report_${filterType}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      link.click();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to download PDF");
    }
  };


  const downloadExcel = async () => {
    try {
      const params = {
        filter: filterType,
        startDate: customStartDate,
        endDate: customEndDate,
      };

      const response = await axiosInstance.get("/api/admin/sales/download-excel", {
        params,
        responseType: "blob", // Important
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Sales_Report_${filterType}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel download failed:", error);
      toast.error("Failed to download Excel");
    }
  };


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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales Report</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard / Sales Report</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData?.totalOrders}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <ShoppingCart className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{salesData?.totalRevenue}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Discount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{salesData?.totalDiscount}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <Tag className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Pendings</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData?.totalPendings}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TimerIcon className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>

            {/* Filters and Download Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 mb-4">
              {/* Filter Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Period
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'daily', 'weekly', 'monthly', 'yearly', 'custom'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type)
                        setCustomStartDate('')
                        setCustomEndDate('')
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Buttons (aligned to end) */}
              <div className="flex flex-wrap gap-3 items-center justify-end w-full lg:w-auto">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={downloadPDF}>
                  <Download size={18} />
                  <span className="text-sm font-medium">Download PDF</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={downloadExcel}>
                  <Download size={18} />
                  <span className="text-sm font-medium">Download Excel</span>
                </button>
              </div>
            </div>


            {/* Custom Date Range */}
            {filterType === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coupon
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales?.slice(0, 50).map((order, index) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order?.orderId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order?.items?.length}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order?.address?.fullname}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {new Date(order?.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{order?.totalAmount + (order?.couponAmount ? order.couponAmount : 0)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">
                        {order?.couponAmount}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.couponId ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            {order.couponId.couponCode}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                        ₹{order.totalAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </AdminMain>
  );
};

export default AdminSales;