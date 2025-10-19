import React, { useEffect, useState } from 'react'
import AdminMain from '../../../Components/Admin/AdminMain'
import ProductForm from '../../../Components/Admin/ProductForm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../../../Helper/AxiosInstance'

const AdminEditProduct = () => {
    const { id } = useParams()

    const [product , setProduct] = useState({})
    const navigate = useNavigate()

    useEffect(()=>{
        async function getProduct() {
            try {

                const {data} = await axiosInstance.get(`/api/admin/products/${id}`);

                if(data.success){
                    setProduct(data.product)
                }else{
                    toast.error(data.message)
                }                
            } catch (error) {
                toast.error(error.message)
            }
        }
        getProduct()
    },[id])

    async function productEditSubmit(data){
        try {
            
            let res = await axiosInstance.put(`/api/admin/products/${id}`, data)

            if(res.data.success){
                toast.success("product updated successfully")
                navigate("/admin/products")
            }else{
                toast.error(res.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <AdminMain>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Edit Product</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to={"/admin/products"}>Products</Link>
                            <span>›</span>
                            <Link>Edit Product</Link>
                        </div>
                    </div>
                    <ProductForm productEditSubmit={productEditSubmit} product={product} />
                </div>
            </div >
        </AdminMain>
    )
}

export default AdminEditProduct
