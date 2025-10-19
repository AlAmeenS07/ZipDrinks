// import React from 'react'

// const AdminTable = () => {


//     const paginate = (pageNumber) => {
//         // setCurrentPage(pageNumber);
//         // In real app: API call to backend to fetch page data
//         // await fetchProducts(pageNumber, productsPerPage, sortBy, filterBy, searchTerm);
//     };

//     return (
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//                 <table className="w-full">
//                     <thead className="bg-green-600 text-white">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-sm font-semibold">Product Name</th>
//                             <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
//                             <th className="px-6 py-3 text-center text-sm font-semibold">Variants</th>
//                             <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
//                             <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {items.map((item, index) => {
//                             return (
//                                 <tr
//                                     key={item._id}
//                                     className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                                         }`}
//                                 >
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center gap-3">
//                                             <span className="font-medium text-gray-800">{item.name}</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 text-gray-600">{product.category}</td>
//                                     <td className="px-6 py-4 text-center">
//                                         <button
//                                             onClick={() => openVariantModal(product)}
//                                             className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                                             title="View Variants"
//                                         >
//                                             <Eye className="w-5 h-5" />
//                                         </button>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center justify-center gap-3">
//                                             <button
//                                                 onClick={() => toggleProductStatus(product.id)}
//                                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.isListed ? 'bg-green-600' : 'bg-red-500'
//                                                     }`}
//                                             >
//                                                 <span
//                                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isListed ? 'translate-x-6' : 'translate-x-1'
//                                                         }`}
//                                                 />
//                                             </button>
//                                             <span className={`text-sm font-medium ${product.isListed ? 'text-green-600' : 'text-gray-500'
//                                                 }`}>
//                                                 {product.isListed ? 'Listed' : 'Unlisted'}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center justify-center gap-2">
//                                             <button
//                                                 className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
//                                                 title="View Product"
//                                             >
//                                                 View
//                                             </button>
//                                             <button
//                                                 className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
//                                                 title="Edit"
//                                             >
//                                                 <Edit className="w-5 h-5" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
//                 <span className="text-sm text-gray-600">
//                     Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
//                 </span>

//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={() => paginate(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className={`p-2 rounded-lg transition ${currentPage === 1
//                             ? 'text-gray-400 cursor-not-allowed'
//                             : 'text-gray-700 hover:bg-gray-100'
//                             }`}
//                     >
//                         <ChevronLeft className="w-5 h-5" />
//                     </button>

//                     {[...Array(totalPages)].map((_, index) => {
//                         const pageNumber = index + 1;
//                         if (
//                             pageNumber === 1 ||
//                             pageNumber === totalPages ||
//                             (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
//                         ) {
//                             return (
//                                 <button
//                                     key={pageNumber}
//                                     onClick={() => paginate(pageNumber)}
//                                     className={`px-3 py-1 rounded-lg transition ${currentPage === pageNumber
//                                         ? 'bg-green-600 text-white'
//                                         : 'text-gray-700 hover:bg-gray-100'
//                                         }`}
//                                 >
//                                     {pageNumber}
//                                 </button>
//                             );
//                         } else if (
//                             pageNumber === currentPage - 2 ||
//                             pageNumber === currentPage + 2
//                         ) {
//                             return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
//                         }
//                         return null;
//                     })}

//                     <button
//                         onClick={() => paginate(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className={`p-2 rounded-lg transition ${currentPage === totalPages
//                             ? 'text-gray-400 cursor-not-allowed'
//                             : 'text-gray-700 hover:bg-gray-100'
//                             }`}
//                     >
//                         <ChevronRight className="w-5 h-5" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AdminTable
