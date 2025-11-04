import React from 'react'
import UserProfileMain from '../../Components/UserProfileMain'
import AddressForm from '../../Components/AddressForm'
import { toast } from 'react-toastify'
import axiosInstance from '../../Helper/AxiosInstance'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadingEnd, loginStart } from '../../Store/user/UserSlice'

const AddAddress = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function addAddressSubmit(data){
        data.phone = `+91 ${data.phone}`
        dispatch(loginStart())
        try {
            
            let res = await axiosInstance.post('/api/user/address' , data)

            if(res.data.success){
                toast.success("Address added succssfully")
                navigate("/profile/address")
            }
            else{
                toast.error(res.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        finally{
            dispatch(loadingEnd())
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
                    <span className="text-black font-medium">Add Address</span>
                </div>

                <AddressForm addressSubmit={addAddressSubmit}/>
            </div>
        </UserProfileMain>
    )
}

export default AddAddress
