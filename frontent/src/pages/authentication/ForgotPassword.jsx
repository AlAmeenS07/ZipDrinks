import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { loadingEnd, loginStart } from '../../Store/user/UserSlice'
import { toast } from 'react-toastify'
import { Loader } from 'react-feather'
import ForgotPasswordOtp from '../../Components/ForgotPasswordOtp'
import NewPassword from '../../Components/NewPassword'
import axiosInstance from '../../Helper/AxiosInstance'

const ForgotPassword = () => {

    const [fpEmail , setEmail] = useState(true);
    const [fpOtp , setFpOtp] = useState(false);
    const [newPassword , setNewPassword] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const loading = useSelector(state => state.user.loading);
    const dispatch = useDispatch()
    const { register, reset, handleSubmit, formState: { errors } } = useForm()

    async function forgotPasswordEmail(data) {
        dispatch(loginStart())
        try {
            let res = await axiosInstance.post(backendUrl + '/api/auth/reset-password-otp', { email: data.email })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(loadingEnd())
                setEmail(false);
                setFpOtp(true)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        finally {
            dispatch(loadingEnd())
            reset()
        }
    }

    return (
        <>
        { fpEmail &&  (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Forgot Password ?</h2>

                    <form className="space-y-6" onSubmit={handleSubmit(forgotPasswordEmail)} noValidate>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Enter your registered email
                            </label>
                            <input
                                type="email"
                                placeholder="test@email@gmail.com"
                                {...register("email", {
                                    required: { value: true, message: "Email is required !" },
                                    pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email !" }
                                })}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className={`relative w-full flex items-center justify-center gap-2 
                                                                py-2.5 rounded-lg font-medium text-white transition-all duration-300
                                                                ${loading
                                    ? "bg-teal-600 cursor-not-allowed opacity-90"
                                    : "bg-teal-700 hover:bg-teal-800 active:scale-95"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin text-white" size={18} />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                "Send Email"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            )}

            {fpOtp && (
                <ForgotPasswordOtp setFpOtp={setFpOtp} setNewPassword={setNewPassword}/>
            )}

            {newPassword && (
                <NewPassword setNewPassword={setNewPassword} setEmail={setEmail}/>
            )}

        </>
    )
}

export default ForgotPassword
