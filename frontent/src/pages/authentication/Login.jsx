import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { loadingEnd, loginStart, loginSuccess } from '../../Store/user/UserSlice'
import { Loader } from "react-feather"
import axiosInstance from '../../Helper/AxiosInstance'

const Login = () => {

    const [googleError] = useSearchParams()

    const queryError = googleError.get("error");

    const navigate = useNavigate()

    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const loading = useSelector(state => state.user.loading)
    const dispatch = useDispatch()

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    async function loginSubmit(data) {
        dispatch(loginStart())
        try {
            let res = await axiosInstance.post(backendurl + '/api/auth/login', { email: data.email, password: data.password })

            if (res.data.success) {
                let user = await axiosInstance.get(backendurl + '/api/user/data');
                dispatch(loginSuccess(user.data.userData))
                navigate('/')
            } else {
                dispatch(loadingEnd())
                toast.error(res.data.message || "Something wrong !")
            }

        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            dispatch(loadingEnd())
        }
        reset()
    }

    function googleSignup() {
        window.location.href = backendurl + '/api/auth/google'
    }

    return (
        <div>
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

                    <div className="space-y-6">
                        <form onSubmit={handleSubmit(loginSubmit)} noValidate>
                            { queryError && <p className='text-red-500 text-center'>Error : {queryError}</p> }
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <input className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                                        type="email" placeholder="name@gmail.com" {...register("email", {
                                            required: { value: true, message: "Email is required !" },
                                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email !" }
                                        })} />
                                </div>
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2 mt-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent" type="password"
                                        placeholder="••••••••" {...register("password", { required: { value: true, message: "Password is required !" }, minLength: { value: 8, message: "Password must be 8 letters !" } })} />
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                            </div>

                            <div className="flex items-center justify-between text-sm my-4">
                                <Link to="/forgot-password" className="text-gray-900 hover:text-gray-700 hover:underline">
                                    Forgot Password?
                                </Link>
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
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>

                        </form>

                        <div className="text-center space-y-2">
                            <Link to="/signup" className="text-sm text-gray-900 hover:text-gray-700 block">
                                Don't have an account? <span className='text-teal-700 hover:text-teal-800 hover:underline'>Sign up</span>
                            </Link>
                            <div className="flex items-center justify-center">
                                <span className="text-sm text-neutral-600 mr-2">Or Login with</span>
                            </div>
                        </div>

                        <button className="w-full border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium py-2.5 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                            type="button" onClick={googleSignup}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
