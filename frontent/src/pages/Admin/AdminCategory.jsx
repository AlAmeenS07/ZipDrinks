import React, { useEffect, useState } from 'react';
import { Search, X, Eye, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminMain from '../../Components/Admin/AdminMain';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../Helper/AxiosInstance';
import { Loader } from 'react-feather';

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(query.get('search') || '');
  const [sortBy, setSortBy] = useState(query.get('sort') || '');
  const [currentPage, setCurrentPage] = useState(Number(query.get('page')) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const itemsPerPage = 5;


  const handleToggleListed = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/api/admin/categories/${id}/status`);

      if (data.success) {
        toast.success(data.message);
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === id ? { ...cat, isListed: !cat.isListed } : cat
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Clear search field
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // ✅ Update query params when search/sort changes
  useEffect(() => {
    setQuery({
      search: searchTerm,
      sort: sortBy,
      page: currentPage.toString()
    });
  }, [searchTerm, sortBy, currentPage]);


  // ✅ Fetch categories
  useEffect(() => {
    async function getCategories() {
      try {
        setLoading(true);

        const params = {
          search: searchTerm,
          sort: sortBy,
          page: currentPage,
          limit: itemsPerPage
        };

        const { data } = await axiosInstance.get('/api/admin/categories', { params });

        if (data.success) {
          setCategories(data.categories);
          setTotalPages(data.totalPages)
          setCurrentPage(data.currentPage);
          setTotalItems(data.total)
        } else {
          setCategories([]);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, [searchTerm, sortBy, currentPage]);

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
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">CATEGORY</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Category</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Sort</option>
                <option value="highSale">High Sale</option>
                <option value="lowSale">Low Sale</option>
                <option value="lastAdded">Last Added First</option>
              </select>

              {/* Add Category Button */}
              <Link
                to="/admin/categories/add-category"
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Add Category
              </Link>
            </div>
          </div>

          {/* Table / Loader / Empty State */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              // ✅ Loader
              <div className="flex justify-center items-center py-20">
                <Loader className="animate-spin text-gray-600" size={30} />
              </div>
            ) : categories.length === 0 ? (
              // ✅ Empty State
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg font-medium">No categories found</p>
                <p className="text-sm">Try adjusting your search or sorting options.</p>
              </div>
            ) : (
              <>
                {/* ✅ Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">SI/ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Category Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Added</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">List / Unlist</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Action</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Offer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {categories.map((category, index) => (
                        <tr key={category._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{category.name}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </td>

                          {/* ✅ List/Unlist Toggle */}
                          <td className="px-2 py-4 text-sm flex">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${category.isListed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}
                            >
                              {category.isListed ? 'Listed' : 'Unlisted'}
                            </span>
                            <button
                              onClick={() => handleToggleListed(category._id)}
                              className={`relative inline-flex h-6 w-12 items-center ms-2 rounded-full transition-colors ${category.isListed ? 'bg-green-600' : 'bg-red-600'
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${category.isListed ? 'translate-x-7' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                          </td>

                          {/* ✅ Actions */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-gray-100 rounded">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <Link
                                to={`/admin/categories/${category._id}/edit-category`}
                                className="p-1.5 hover:bg-gray-100 rounded"
                              >
                                <Edit2 className="w-4 h-4 text-gray-600" />
                              </Link>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-900">
                            {category.offer || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
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
                        <span key={i} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page
                            ? 'bg-gray-800 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                            }`}
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

                {/* ✅ Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                  {categories.map((category, index) => (
                    <div key={category._id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">SI: {index + 1}</p>
                        </div>
                        <button
                          onClick={() => handleToggleListed(category._id)}
                          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${category.isListed ? 'bg-green-600' : 'bg-red-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${category.isListed ? 'translate-x-7' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <span className="text-gray-600">Added:</span>
                          <span className="ml-2 font-medium">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Offer:</span>
                          <span className="ml-2 font-medium">{category?.offer || '—'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <button className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">View</span>
                        </button>
                        <Link
                          to={`/admin/categories/${category._id}/edit-category`}
                          className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="text-sm">Edit</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminMain>
  );
}
