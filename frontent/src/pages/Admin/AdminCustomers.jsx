import React, { useEffect, useState } from 'react'
import AdminMain from '../../Components/Admin/AdminMain';
import { Search, Plus, Eye, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import axiosInstance from '../../Helper/AxiosInstance';
import { toast } from 'react-toastify';

const AdminCustomers = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('All');
    const [customers, setCustomers] = useState([]);
    const [totalPages , setTotalPages] = useState(1)
    const [totalItems , setTotalItems] = useState(0)

    const itemsPerPage = 5;

    useEffect(() => {
        async function getCustomers() {
            try {

                const params = {
                    search : searchTerm,
                    status : statusFilter,
                    page : currentPage,
                    limit : itemsPerPage
                }


                const { data } = await axiosInstance.get('/api/admin/customers' , {params});
                if (data.success) {
                    setCustomers(data.customers);
                    setTotalPages(data.totalPages)
                    setTotalItems(data.total)
                } else {
                    toast.error("Failed to load customers");
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        getCustomers();
    }, [searchTerm , statusFilter , currentPage ]);

    // Handle toggle status
    const handleToggleStatus = async (customerId) => {
        try {
            const { data } = await axiosInstance.patch(`/api/admin/customers/${customerId}/toggle`);
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
            toast.error(error.message);
        }
    };

    // // Handle view customer
    // const handleViewCustomer = (customerId) => {
    //     console.log('View customer:', customerId);
    //     // navigate(`/admin/customers/${customerId}`);
    // };

    // Utility: Get pagination pages
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
       <AdminMain>
            <div className="p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">CUSTOMER LIST</h1>
                    <p className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                    </p>
                </div>

                {/* Search, Filter */}
                <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64 lg:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search customer here..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset page on search
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                        >
                            <X size={18} /> Clear
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-48">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1); // Reset page on filter change
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <Plus size={20} />
                            <span>Add User</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-green-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Block/Unblock</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {customers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {customer.fullname
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{customer.fullname}</p>
                                                    <p className="text-sm text-gray-500">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${customer.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                                            >
                                                {customer.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(customer._id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${customer.isBlocked ? 'bg-red-600' : 'bg-green-600'}`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${customer.isBlocked ? 'translate-x-1' : 'translate-x-6'}`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        {getPageNumbers().map((page, i) =>
                            page === '...' ? (
                                <span key={i} className="px-3 py-2 text-gray-500">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page ? 'bg-gray-800 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </AdminMain>
    );
};

export default AdminCustomers;
