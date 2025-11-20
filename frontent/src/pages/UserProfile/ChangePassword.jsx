import React from 'react'
import UserProfileMain from '../../Components/UserProfileMain'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../../Helper/AxiosInstance'
import { useState } from 'react'
import { Loader } from 'react-feather'

const ChangePassword = () => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.userData)
    const [loading , setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, watch } = useForm()

    async function changePasswordSubmit(data) {
        try {
            setLoading(true)

            let res = await axiosInstance.put('/api/user/edit/change-password', data)

            if (res.data.success) {
                toast.success("Password Updated Successfully")
                navigate("/profile")
            }
            else {
                toast.error(res.data.message)
            }

        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            setLoading(false)
        }  
    }

    return (
        <UserProfileMain>
            <nav className="text-sm text-gray-500 mb-4" aria-label="breadcrumb">
                <ol className="list-reset flex">
                    <li>
                        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
                    </li>
                    <li><span className="mx-2">/</span></li>
                    <li className="text-gray-700">Change Password</li>
                </ol>
            </nav>

            <div className="relative w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">

                <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
                    Change Password for
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">{user?.email ? `${user?.email}` : `example@gmail.com`}</p>

                <form onSubmit={handleSubmit(changePasswordSubmit)} noValidate>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Enter Current Password"
                            {...register("currentPassword", { required: { value: true, message: "Current Password is required !" } })}
                            className="border rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        {errors.currentPassword && <p className='text-red-500 text-sm mt-1'>{errors.currentPassword.message}</p>}
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Enter New Password"
                            {...register("password", {
                                required: { value: true, message: "password is required !" },
                                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/, message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' },
                            })}
                            className="border rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            {...register("confirmPassword", {
                                required: { value: true, message: "password is required !" },
                                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' },
                                validate: (value) => value === watch('password') || "Password must be match !"
                            })}
                            className="border rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex justify-center items-center gap-2 w-full py-3 rounded-md font-medium transition-colors
              ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} text-white`}
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Password"
                        )}
                    </button>
                </form>
            </div>
        </UserProfileMain>
    )
}

export default ChangePassword
