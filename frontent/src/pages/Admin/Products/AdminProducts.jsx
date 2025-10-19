import React, { useEffect, useState } from 'react';
import { Search, X, Eye, Edit, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import AdminMain from '../../../Components/Admin/AdminMain';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../Helper/AxiosInstance';
import { toast } from 'react-toastify';

export default function AdminProducts() {

  const [searchQuery, setSearchQuery] = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchQuery.get('search') || '');
  const [sortBy, setSortBy] = useState(searchQuery.get('sort') || '');
  const [filterBy, setFilterBy] = useState(searchQuery.get('filter') || '');
  const [currentPage, setCurrentPage] = useState(searchQuery.get('page') || 1);


  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const itemsPerPage = 5

  useEffect(() => {
    setSearchQuery({
      search: searchTerm,
      filter: filterBy,
      sort: sortBy,
      page: currentPage,
    });
  }, [searchTerm, filterBy, sortBy, currentPage, setSearchQuery]);

  useEffect(() => {
    async function getProducts() {
      setLoading(true);

      const params = {
        search: searchTerm,
        filter: filterBy,
        page: currentPage,
        sort: sortBy,
        limit: itemsPerPage,
      }

      try {
        const { data } = await axiosInstance.get('/api/admin/products', { params });
        const res = await axiosInstance.get('/api/admin/categories');

        if (data.success && res.data.success) {
          setProducts(data.products);
          setCategories(res.data.categories);
          setCurrentPage(data.currentPage)
          setTotalPages(data.totalPages)
          setTotalProducts(data.total)
        } else {
          toast.error(data.message || 'Failed to load data');
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, [searchTerm, filterBy, sortBy, currentPage]);

  const toggleProductStatus = async (productId) => {
    try {

      const { data } = await axiosInstance.patch(`/api/admin/products/${productId}`);

      if (data.success) {
        setProducts(products.map(p =>
          p._id === productId ? { ...p, isListed: !p.isListed } : p
        ));
        toast.success("Product updated successfully")
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleClearSearch = () => setSearchTerm('');
  const openVariantModal = (product) => {
    setSelectedProduct(product);
    setShowVariantModal(true);
  };
  const closeVariantModal = () => {
    setShowVariantModal(false);
    setSelectedProduct(null);
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <AdminMain>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Products</span>
              </div>
            </div>
            <Link to="/admin/products/add-product" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition">
              Add New Product +
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
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

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="lastAdded">Last Added</option>
                  <option value="firstAdded">First Added</option>
                </select>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Filter:</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Products</option>
                  <option value="listed">Listed</option>
                  <option value="unlisted">Unlisted</option>
                  <optgroup label="Categories">
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="animate-spin text-gray-600" size={30} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Product Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Variants</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b hover:bg-gray-50`}>
                        <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                        <td className="px-6 py-4 text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openVariantModal(product)}
                            className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Variants"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleProductStatus(product._id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.isListed ? 'bg-green-600' : 'bg-red-500'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isListed ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                          <span className={`ml-2 text-sm font-medium ${product.isListed ? 'text-green-600' : 'text-gray-500'}`}>
                            {product.isListed ? 'Listed' : 'Unlisted'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link to={`/admin/products/${product._id}/edit-product`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Edit">
                            <Edit className="w-5 h-5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t flex justify-between items-center text-sm text-gray-600">
                <span>
                  Showing page {currentPage} of {totalPages} — Total {totalProducts} products
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`p-2 rounded-lg ${currentPage <= 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-1 rounded-lg ${currentPage === pageNumber ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-800'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`p-2 rounded-lg ${currentPage >= totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Variant Modal */}
      {showVariantModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Product Variants - {selectedProduct.name}</h2>
              <button onClick={closeVariantModal} className="text-white hover:bg-green-700 p-2 rounded-lg transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Size/Variant</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sale Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.variants.map((variant, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{variant.size}</td>
                      <td className="px-6 py-4 text-gray-600">{variant.quantity} units</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">₹{variant.price}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">₹{variant.salePrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeVariantModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminMain>
  );
}
