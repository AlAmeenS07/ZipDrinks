import React from 'react'
import AdminMain from '../../../Components/Admin/AdminMain'
import CouponForm from '../../../Components/Admin/CouponForm'
import axiosInstance from '../../../Helper/AxiosInstance'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

const AdminCouponAdd = () => {

    const navigate = useNavigate()

    async function addCoupon(data) {
        try {

            const res = await axiosInstance.post('/api/admin/coupons/add-coupon', { data })

            if (res.data.success) {
                toast.success("coupon created successfully")
                navigate("/admin/coupons")
            }
            else{
                toast.error(res.data.message)
            }

        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <AdminMain>
            <div className='p-8'>
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mt-2">Coupons</h1>
                    <div className="flex items-center text-sm text-gray-600">
                        <Link to="/admin/coupons" className="hover:text-gray-900 cursor-pointer">Coupons</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-400">Add coupons</span>
                    </div>
                </div>
                <CouponForm couponSubmit={addCoupon} />
            </div>
        </AdminMain>
    )
}

export default AdminCouponAdd
