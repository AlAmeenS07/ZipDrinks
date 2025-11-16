import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loadingEnd, loginFail, loginStart } from '../../Store/user/UserSlice'
import { toast } from 'react-toastify'
import { Loader } from 'react-feather'
import axiosInstance from '../../Helper/AxiosInstance'

const Signup = () => {

    const dispatch = useDispatch()
    const loading = useSelector(state => state.user.loading);

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm()

    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate()

    async function signupSubmit(data) {
        data.phone = `+91 ${data.phone}`

        try {

            dispatch(loginStart())

            let res = await axiosInstance.post(backendurl + '/api/auth/register', {
                fullname: data.fullname, email: data.email,
                phone: data.phone, password: data.password , referredBy : data.referredBy
            })

            if (res.data.success) {
                dispatch(loadingEnd())
                navigate("/email-verify" , {state : {email : data.email}})
            } else {
                toast.error(res.data.message || "Something went wrong !")
                console.log(res.data)
                dispatch(loginFail())
            }

        } catch (error) {
            dispatch(loginFail())
            toast.error(error.response.data.message || "Signup Fail")
            console.log(error.message)
        }

        reset()
    }

    function googleSignup(){
        window.location.href = backendurl + '/api/auth/google'
    }

    return (
        <div>
            <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Sign up</h2>

                    <div className="space-y-4">
                        <form onSubmit={handleSubmit(signupSubmit)} noValidate>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Full Name
                                </label>
                                <input className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                    type="text" placeholder="Bonnie Green" {...register('fullname', {
                                        required: { value: true, message: "Full name is requried !" },
                                        minLength: { value: 4, message: "Minimum 4 letters !" }, validate: (value) => value.trim() !== "" || "Name cannot be whitespace !"
                                    })} />
                                {errors.fullname && <p className='text-red-500 text-sm mt-1'>{errors.fullname.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Email
                                </label>
                                <input className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                    type="email" placeholder="name@company.com" {...register("email", {
                                        required: { value: true, message: "Email is required !" },
                                        pattern: { value: /^\S+@\S+$/i, message: "Invalid Email !" }
                                    })} />
                                {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="flex gap-2">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-neutral-300 bg-gray-100 text-gray-600 select-none">+91</span>
                                    <input className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                        type="tel" placeholder="123-456-7890" {...register("phone", {
                                            required: { value: true, message: "Phone Number is required !" },
                                            pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid number !" }, minLength: { value: 10, message: "Phone Number must be 10" }
                                        })} />
                                    {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 my-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                            placeholder="••••••••" type="password" {...register("password", {
                                                required: { value: true, message: "password is required !" },
                                                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' }
                                            })} />
                                        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                                    </div>
                                </div>

                                <div className='mt-2'>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                            placeholder="•••••••" type="password" {...register("confirmPassword", {
                                                required: { value: true, message: "password is required !" },
                                                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' },
                                                validate: (value) => value === watch('password') || "Password must be match !"
                                            })} />
                                        {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message}</p>}
                                    </div>
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-neutral-700 my-2 text-center">
                                    Anyone Referred ?
                                </label>
                                <input className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                    type="text" placeholder="ref1234" {...register("referredBy")} />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`relative w-full flex items-center justify-center gap-2 mt-4 
                                            py-2.5 rounded-lg font-medium text-white transition-all duration-300
                                            ${loading ? "bg-teal-600 cursor-not-allowed opacity-90"
                                            : "bg-teal-700 hover:bg-teal-800 active:scale-95" }`}>
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin text-white" size={18} />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    "Signup"
                                )}
                            </button>
                        </form>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-neutral-600">
                                Or Sign up with
                            </p>
                        </div>

                        <button
                            onClick={googleSignup}
                            type="button"
                            className="w-full border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium py-2.5 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Google</span>
                        </button>

                        <p className="text-center text-sm text-neutral-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
