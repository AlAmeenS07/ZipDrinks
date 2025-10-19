import React from 'react';
import AdminMain from '../../Components/Admin/AdminMain';
import { Link } from 'react-router-dom';
import CategoryForm from '../../Components/Admin/CategoryForm';

const AdminCategoryAdd = () => {

  return (
    <AdminMain>
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">ADD A CATEGORY</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to={"/admin/categories"}>Category</Link>
            <span>›</span>
            <span>Add Category</span>
          </div>
        </div>

        <CategoryForm />
      
      </div>
    </div>
    </AdminMain>
  )
}

export default AdminCategoryAdd
