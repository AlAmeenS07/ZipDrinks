import React, { useEffect, useState } from 'react';
import { Loader, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { productFetch } from '../../Store/user/Products';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../../Helper/AxiosInstance';
import Card from '../../Components/Card';
import Footer from '../../Components/Footer';

const Shop = () => {
    const [searchQuery, setSearchQuery] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchQuery.get('search') || '');
    const [categoryFilter, setCategoryFilter] = useState(searchQuery.get('category') ? searchQuery.get('category').split(',') : []);
    const [sizeFilter, setSizeFilter] = useState(searchQuery.get('size') ? searchQuery.get('size').split(',') : []);
    const [sortBy, setSortBy] = useState(searchQuery.get('sort') || '');
    const [currPage, setCurrPage] = useState(parseInt(searchQuery.get('page')) || 1);

    const { productData, totalPages, currentPage, loading } = useSelector((state) => state.product);

    const [categories, setCategories] = useState([]);
    const itemsPerPage = 12;
    const sizes = ['300ml', '500ml', '750ml', '1L', '1.5L', '2L'];

    const dispatch = useDispatch();

    useEffect(() => {
        const params = {};
        if (searchTerm){
            params.search = searchTerm;
        }
        if (categoryFilter.length){
            params.category = categoryFilter.join(',');
        }
        if (sizeFilter.length){
            params.size = sizeFilter.join(',');
        }
        if (sortBy){
            params.sort = sortBy;
        }
        if (currPage){
            params.page = currPage;
        }
        setSearchQuery(params);
    }, [searchTerm, categoryFilter, sizeFilter, sortBy, currPage, setSearchQuery]);

    useEffect(() => {
        const params = {
            search: searchTerm,
            category: categoryFilter.join(','),
            size: sizeFilter.join(','),
            sort: sortBy,
            page: currPage,
            limit: itemsPerPage,
        };
        dispatch(productFetch(params));
    }, [searchTerm, categoryFilter, sizeFilter, sortBy, currPage, dispatch]);


    useEffect(() => {
        async function getCategories() {
            try {
                const { data } = await axiosInstance.get('/api/categories');

                if (data.success){
                    setCategories(data.categories);
                }
                else{
                    toast.error(data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="animate-spin text-gray-600" size={30} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={() => setSearchTerm('')} className="p-2 text-gray-500 hover:text-red-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">

                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">

                            <div className="mb-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-3">Sort by</h3>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="">Sort</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="AtoZ">Aa-Zz</option>
                                    <option value="ZtoA">Zz-Aa</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <label key={category._id} className="flex items-center cursor-pointer group">

                                            <input type="checkbox" checked={categoryFilter.includes(category.name)}
                                                onChange={() => {
                                                    if (categoryFilter.includes(category.name)) {
                                                        setCategoryFilter(categoryFilter.filter((c) => c !== category.name));
                                                    } else {
                                                        setCategoryFilter([...categoryFilter, category.name]);
                                                    }
                                                }}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                                                {category.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-3">Sizes</h3>
                                <div className="space-y-2">
                                    {sizes.map((size) => (
                                        <label key={size} className="flex items-center cursor-pointer group">
                                            <input type="checkbox" checked={sizeFilter.includes(size)}
                                                onChange={() => {
                                                    if (sizeFilter.includes(size)) {
                                                        setSizeFilter(sizeFilter.filter((s) => s !== size));
                                                    } else {
                                                        setSizeFilter([...sizeFilter, size]);
                                                    }
                                                }}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                                                {size}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                            {productData?.map((product) => (
                                <Card
                                    key={product._id}
                                    id={product._id}
                                    image={product.images[0]}
                                    name={product.name}
                                    category={product.category}
                                    price={product.variants[0].salePrice}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">

                                <button onClick={() => setCurrPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    ‹
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrPage(i + 1)}
                                        className={`w-8 h-8 flex items-center justify-center rounded font-medium ${currentPage === i + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button onClick={() => setCurrPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    ›
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Shop;
