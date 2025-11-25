import React, { useEffect, useState } from 'react';
import AdminMain from '../../Components/Admin/AdminMain';
import { Search, Plus, Eye, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import axiosInstance from '../../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { Loader } from 'react-feather';
import Pagination from '../../Components/Pagination';
import Swal from "sweetalert2"

const AdminCustomers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    setSearchParams({
      search: searchTerm,
      status: statusFilter,
      page: currentPage,
    });
  }, [searchTerm, statusFilter, currentPage, setSearchParams]);


  useEffect(() => {
    const getCustomers = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchTerm,
          status: statusFilter,
          page: currentPage,
          limit: itemsPerPage,
        };

        const { data } = await axiosInstance.get('/api/admin/customers', { params });

        if (data.success) {
          setCustomers(data.customers);
          setTotalPages(data.totalPages);
          setTotalItems(data.total);
        } else {
          toast.error('Failed to load customers');
        }
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    getCustomers();
  }, [searchTerm, statusFilter, currentPage]);


  const handleToggleStatus = async (customerId) => {

    let res = await Swal.fire({
      title: "Are you sure ?",
      showCancelButton: true
    })

    if (res.isConfirmed) {
      try {
        const { data } = await axiosInstance.patch(`/api/admin/customers/${customerId}/status`);
        if (data.success) {
          toast.success(data.message);
          setCustomers((prev) =>
            prev.map((cust) =>
              cust._id === customerId ? { ...cust, isBlocked: !cust.isBlocked } : cust
            )
          );
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  };


  return (
    <AdminMain>
      <div className="p-4 md:p-6 lg:p-8">

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">CUSTOMER LIST</h1>
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </p>
        </div>

        <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers here..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('')
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-gray-600" size={30} />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-center text-sm font-semibold">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Customer Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Block/Unblock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.map((customer, index) => (
                      <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-gray-900">{customer.fullname}</p>
                              <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm  text-gray-600">{customer.phone || '—'}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${customer.isBlocked
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                              }`}
                          >
                            {customer.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(customer._id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${customer.isBlocked ? 'bg-red-600' : 'bg-green-600'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${customer.isBlocked ? 'translate-x-1' : 'translate-x-6'
                                }`}
                            />
                          </button>
                        </td>
                        {/* <td className="px-6 py-4 text-center">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={18} />
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </p>

              <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />

            </div>
          </>
        )}
      </div>
    </AdminMain>
  );
};

export default AdminCustomers;
