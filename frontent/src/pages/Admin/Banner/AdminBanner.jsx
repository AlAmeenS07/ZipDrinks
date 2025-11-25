import React, { useEffect, useState } from 'react';
import { Search, Edit2, Plus, ChevronDown, Trash2, X } from 'lucide-react';
import AdminMain from '../../../Components/Admin/AdminMain';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../Helper/AxiosInstance';
import Swal from 'sweetalert2';
import Pagination from '../../../Components/Pagination';

const AdminBanner = () => {

    const [query, setQuery] = useSearchParams()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState(query.get('search') || '');
    const [filterStatus, setFilterStatus] = useState(query.get('filter') || '');
    const [currentPage, setCurrentPage] = useState(Number(query.get('page')) || 1)
    const [totalPages, setTotalPages] = useState(1)
    const [banners, setBanners] = useState([])

    const itemsPerPage = 5;

    useEffect(() => {
        setQuery({
            search: searchTerm,
            filter: filterStatus,
            page: currentPage
        })
    }, [searchTerm, filterStatus, currentPage, setQuery])

    useEffect(() => {
        async function getBanners() {
            try {

                const params = {
                    search: searchTerm,
                    filter: filterStatus,
                    page: currentPage,
                    limit: itemsPerPage
                }

                const { data } = await axiosInstance.get('/api/admin/banner', { params })

                if (data.success) {
                    setBanners(data.banners)
                    setTotalPages(data.totalPages)
                }
                else {
                    toast.error(data.message)
                }

            } catch (error) {
                toast.error(error?.response?.data.message)
            }
        }
        getBanners()
    }, [searchTerm, filterStatus, currentPage, itemsPerPage])

    const listUnlist = async (id) => {
        try {

            const { data } = await axiosInstance.patch(`/api/admin/banner/${id}/status`)

            if (data.success) {
                toast.success("updated successfull")
                setBanners((banner) => (
                    banner.map(b => {
                        if (b._id == id) {
                            b.isListed = !b.isListed
                        }
                        return b
                    })
                ))
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    async function handleDelete(id) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete the banner!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {

                const { data } = await axiosInstance.delete(`/api/admin/banner/${id}/delete`)

                if (data.success) {
                    setBanners((banner) => (
                        banner.filter(b => b._id != id)
                    ))
                    toast.success("Banner deleted successfully")
                }
                else {
                    toast.error(data.message)
                }

            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }

    return (
        <AdminMain>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Banners</h1>
                    <p className="text-sm text-gray-500">Dashboard › Banners</p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                                type="text"
                                placeholder="Search banner by title..."
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


                        {/* Filter and Add Button */}
                        <div className="flex gap-3">
                            {/* Filter Dropdown */}
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                >
                                    <option value="">Filter</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>


                            {/* Add Banner Button */}
                            <button className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                                onClick={() => navigate("/admin/banner/add-banner")}>
                                <Plus className="w-4 h-4" />
                                <span className="text-sm font-medium">ADD BANNER</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-green-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {banners?.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No banners found</p>
                                    </div>
                                ) :
                                    banners.map((banner, index) => (
                                        <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={banner.image}
                                                    alt={banner.title}
                                                    className="w-24 h-16 object-cover rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{banner.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{banner.description}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${banner.isListed ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {banner.isListed ? "Active" : "Inactive"}
                                                    </span>
                                                    <button
                                                        onClick={() => listUnlist(banner._id)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${banner.isListed ? 'bg-green-600 focus:ring-green-500'
                                                            : 'bg-red-600 focus:ring-red-500'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${banner.isListed ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    onClick={() => navigate(`/admin/banner/${banner._id}/edit`)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded"
                                                    onClick={() => handleDelete(banner._id)}>
                                                    <Trash2 className="w-4 h-4 ml-3 text-red-500" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-200">
                        {banners?.map((banner) => (
                            <div key={banner._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex gap-4">
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className="w-20 h-14 object-cover rounded flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-800 mb-1">{banner.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{banner.description}</p>
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${banner.isListed ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {banner.isListed ? "Active" : "Inactive"}
                                                </span>
                                                <button
                                                    // onClick={() => toggleStatus(banner.id)}
                                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${banner.isListed ? 'bg-green-600'
                                                        : 'bg-red-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${banner.isListed ? 'translate-x-5' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center items-center mt-4 gap-2">
                    <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
                </div>
            </div>
        </AdminMain>
    );
};

export default AdminBanner;