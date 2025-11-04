import React, { useEffect, useState } from 'react'
import UserProfileMain from '../../Components/UserProfileMain'
import AddressForm from '../../Components/AddressForm'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../../Helper/AxiosInstance'

const EditAddress = () => {

    const { id } = useParams()

    const [address , setAddress] = useState({})
    const navigate = useNavigate()

    useEffect(()=>{
        async function getAddress() {
            try {

                let {data} = await axiosInstance.get(`/api/user/address/${id}`);

                if(data.success){
                    setAddress(data.address)
                }
                
            } catch (error) {
                toast.error(error.message)
            }
        }
        getAddress()
    },[id])

    async function addressEditSubmit(data){
        data.phone = `+91 ${data.phone}`
        try {
            
            const res = await axiosInstance.put(`/api/user/address/${id}` , data)

            if(res.data.success){
                toast.success("Address updated successfully")
                navigate("/profile/address")
            }
            else{
                toast.error(res.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <UserProfileMain>
            <div className="w-full px-6 sm:px-8 lg:px-10 pt-6">

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-6">
                    <span className="hover:text-black cursor-pointer">Home</span>
                    <span>/</span>
                    <span className="hover:text-black cursor-pointer">Profile</span>
                    <span>/</span>
                    <span className="hover:text-black cursor-pointer">Address</span>
                    <span>/</span>
                    <span className="text-black font-medium">Edit Address</span>
                </div>

                <AddressForm addressSubmit={addressEditSubmit} address={address} />
            </div>
        </UserProfileMain>
    )
}

export default EditAddress
