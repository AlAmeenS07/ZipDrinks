import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import UserProfileMain from '../../Components/UserProfileMain';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../Helper/AxiosInstance';
import Swal from 'sweetalert2';

export default function Address() {
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        async function getUserAddress() {
            try {

                let { data } = await axiosInstance.get('/api/user/address')

                if (data.success) {
                    setAddresses(data.address)
                }

            } catch (error) {
                toast.error(error.message)
            }
        }
        getUserAddress()
    }, [])

    const handleDelete = async (id) => {

        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {

                    let { data } = await axiosInstance.patch(`/api/user/address/${id}/delete`);

                    if (data.success) {
                        toast.success("Address deleted successfully");
                        setAddresses(addresses.filter((val) => val._id != id))
                    }
                    else {
                        toast.error(data.message)
                    }

                } catch (error) {
                    toast.error(error.message)
                }
            }
        });
    };

    return (
        <UserProfileMain>
            <div>
                <nav className="text-sm text-gray-500 mb-4" aria-label="breadcrumb">
                    <ol className="list-reset flex">
                        <li>
                            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
                        </li>
                        <li><span className="mx-2">/</span></li>
                        <li>
                            <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
                        </li>
                        <li><span className="mx-2">/</span></li>
                        <li className="text-gray-700">Address</li>
                    </ol>
                </nav>
                <br />

                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-10">
                            Delivery Address
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 mb-8">
                            {addresses?.map((address) => (
                                <div
                                    key={address._id}
                                    className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-purple-400 hover:-translate-y-1 transition-all duration-300 relative"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                                {address.fullname}
                                            </h2>
                                        </div>
                                        <Link to={`/profile/address/${address._id}/edit`}
                                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                            aria-label="Edit address"
                                        >
                                            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        </Link>
                                    </div>

                                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                        <p>{address.address}</p>
                                        <p>{address.district}</p>
                                        <p>Landmark : {address.landmark}</p>
                                        <p>Phone : {address.phone}</p>
                                        <p>Pincode : {address.pincode}</p>
                                        <p className="font-medium">{address.state}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        {!address.isDefault && <div></div>}
                                        <button
                                            onClick={() => handleDelete(address._id)}
                                            className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-600 transition-colors duration-200 uppercase tracking-wide"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <Link to={"/profile/address/add-address"} className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105">
                                <Plus className="w-5 h-5" />
                                Add New Address
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </UserProfileMain>
    );
}