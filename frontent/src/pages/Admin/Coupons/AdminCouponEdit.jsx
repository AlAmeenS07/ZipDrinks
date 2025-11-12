import React, { useEffect, useState } from 'react'
import AdminMain from '../../../Components/Admin/AdminMain'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../Helper/AxiosInstance'
import { toast } from 'react-toastify'
import CouponForm from '../../../Components/Admin/CouponForm'

const AdminCouponEdit = () => {

    const { couponId } = useParams()

    const navigate = useNavigate()
    const [coupon , setCoupon] = useState({})

    useEffect(()=>{
        async function getSingleCoupon(){
            try {

                let { data } = await axiosInstance.get(`/api/admin/coupons/${couponId}`)

                if(data.success){
                    setCoupon(data.coupon)
                }
                else{
                    toast.error(data.message)
                }
                
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
        getSingleCoupon()
    },[])


    async function editCoupon(data){
        try {

            let res = await axiosInstance.put(`/api/admin/coupons/${couponId}` , {...data})

            if(res.data.success){
                toast.success("Coupon updated succssfully")
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
                        <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
                        <span className="mx-2">&gt;</span>
                        <span className="text-gray-400">coupons</span>
                    </div>
                </div>
                <CouponForm couponSubmit={editCoupon} coupon={coupon}/>
            </div>
    </AdminMain>
  )
}

export default AdminCouponEdit
