// import React from 'react'
// import AdminMain from '../../../Components/Admin/AdminMain'

// const AdminAddProducts = () => {
//   return (
//     <AdminMain>
//         <h1>Add Products</h1>
//     </AdminMain>
//   )
// }

// export default AdminAddProducts


import React from 'react';
import ProductForm from '../../../Components/Admin/ProductForm';
import AdminMain from '../../../Components/Admin/AdminMain';
import { Link } from 'react-router-dom';

export default function AdminAddProducts() {
  return (
    <AdminMain>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Add Product</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to={"/admin/products"}>Products</Link>
              <span>›</span>
              <Link>Products</Link>
            </div>
          </div>
          <ProductForm />
        </div>
      </div >
    </AdminMain>
  );
}


