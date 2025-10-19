import React, { useEffect, useState } from 'react'
import AdminMain from '../../Components/Admin/AdminMain'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../../Helper/AxiosInstance'
import CategoryForm from '../../Components/Admin/CategoryForm'

const AdminCategoryEdit = () => {

  const navigate = useNavigate()
  const [category , setCategory] = useState({})

  const { id } = useParams()

  useEffect(()=>{
    async function getCategory() {

      try {

        let {data} = await axiosInstance.get(`/api/admin/categories/${id}`);

        if(data.success){
          setCategory(data.category)
        }
        else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }

    }

    getCategory()
  },[id])

  async function categoryEditSubmit(data){

    try {

      let res = await axiosInstance.put(`/api/admin/categories/${id}` , data)

      if(res.data.success){
          toast.success("product updated Successfully")
          navigate('/admin/categories')
      }else{
        toast.error(res.data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }

  }

  return (
     <AdminMain>
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            EDIT CATEGORY</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to={"/admin/categories"}>Category</Link>
            <span>›</span>
            <span>Edit Category</span>
          </div>
        </div>

        <CategoryForm categoryEditSubmit={categoryEditSubmit} category={category}/>
      
      </div>
    </div>
    </AdminMain>
  )
}

export default AdminCategoryEdit
