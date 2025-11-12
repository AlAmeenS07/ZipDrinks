import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronDown, X, Loader } from 'lucide-react';
import AdminMain from '../../../Components/Admin/AdminMain';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../Helper/AxiosInstance';
import Pagination from '../../../Components/pagination';
import Swal from "sweetalert2"

export default function AdminCoupon() {

  const [query, setQuery] = useSearchParams()

  const [activeFilter, setActiveFilter] = useState(query.get('filter') || "");
  const [searchTerm, setSearchTerm] = useState(query.get('search') || "")
  const [currentPage, setCurrentPage] = useState(query.get('page') || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setQuery({
      search: searchTerm,
      filter: activeFilter,
      page: currentPage
    })

  }, [searchTerm, currentPage, activeFilter, setQuery])

  const limitPerPage = 5;

  const [coupons, setCoupons] = useState([])

  useEffect(() => {
    async function getCoupons() {
      setLoading(true)
      try {
        const params = {
          search: searchTerm,
          filter: activeFilter,
          page: currentPage,
          limit: limitPerPage
        }

        let { data } = await axiosInstance.get('/api/admin/coupons', { params })

        if (data.success) {
          setCoupons(data.coupon)
          setCurrentPage(data.currentPage)
          setTotalPages(data.totalPages)
        }
        else {
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.response.data.message)
      }
      finally {
        setLoading(false)
      }
    }
    getCoupons()
  }, [searchTerm, currentPage, activeFilter])

  async function couponListUnlist(couponId) {
    try {

      let { data } = await axiosInstance.patch(`/api/admin/coupons/${couponId}/status`)

      if (data.success) {
        setCoupons((coupon) => (
          coupon.map(c => c._id == couponId ? data.coupon : c)
        ))
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response.data.message)
    }
  }


  async function handleDelete(couponId) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the coupon!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {

        const { data } = await axiosInstance.patch(`/api/admin/coupons/${couponId}`)

        if (data.success) {
          toast.success("Coupon deleted successfully")
          setCoupons((coupon) => (
            coupon.filter(c => c._id !== couponId)
          ))
        }
        else {
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.response.data.message)
      }
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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-0">Coupons</h1>
            <span className="text-gray-800 text-sm">coupons</span>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative">
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    <option value="">Filter</option>
                    <option value="active">Active</option>
                    <option value="inactive">InActive</option>
                  </select>
                </div>
                <Link to={"/admin/coupons/add-coupon"} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Coupon</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Code</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Min purchase</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">limit</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Discount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">max redeemable</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Active</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupons?.length == 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-6 text-gray-500">
                        No Coupons found
                      </td>
                    </tr>
                  ) : (
                    coupons?.map((coupon, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{coupon?.couponCode}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">₹ {coupon?.minPurchase}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{coupon?.limit}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{coupon?.discount}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">₹ {coupon?.maxRedeem}</td>
                        <td className="px-6 py-4">
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${coupon?.isActive ? 'bg-green-600' : 'bg-red-500'
                              }`}
                            onClick={() => couponListUnlist(coupon._id)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon?.isActive ? 'translate-x-1' : 'translate-x-6'
                                }`}
                            />
                          </button>
                          <span
                            className={`inline-flex items-center px-3 py-1  rounded-full text-xs font-semibold ${coupon.isActive
                              ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(coupon?.expiryDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link to={`/admin/coupons/${coupon._id}`} className="p-1 hover:bg-gray-100 rounded">
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </Link>
                            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleDelete(coupon._id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {coupons?.map((coupon, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{coupon.couponCode}</h3>
                    <p className="text-sm text-gray-600">{coupon.minPurchase}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Discount:</span>
                    <span className="ml-2 font-medium text-gray-900">{coupon?.discount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Limit:</span>
                    <span className="ml-2 font-medium text-gray-900">{coupon?.limit}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Redeem:</span>
                    <span className="ml-2 font-medium text-gray-900">{coupon?.maxRedeemable}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expiry:</span>
                    <span className="ml-2 font-medium text-gray-900">{new Date(coupon?.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Status</span>
                  <div className="flex items-center gap-2">
                    {!coupon.active && (
                      <span className="text-xs text-gray-600">INACTIVE</span>
                    )}
                    <button
                      // onClick={() => toggleCouponStatus(index)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${coupon.isActive ? 'bg-red-500' : 'bg-green-500'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center mt-4 gap-2">
            <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
          </div>

        </div>
      </div>
    </AdminMain>
  );
}