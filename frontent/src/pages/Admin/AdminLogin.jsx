import React, { useState } from 'react'
import { Eye, EyeOff, HelpCircle } from 'lucide-react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../Helper/AxiosInstance.js';
import { Loader } from 'react-feather';
import { loadStart , loadEnd, adminLoginSuccess } from '../../Store/Admin/AdminSlice.js';

const AdminLogin = () => {

  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector(state => state.admin.loading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { register, formState: { errors }, handleSubmit, reset } = useForm()

  async function adminLoginSubmit(data) {
    dispatch(loadStart())
    try {

      let res = await axiosInstance.post('/api/admin/login', { email: data.email, password: data.password })

      if (res.data.success) {
        console.log(res.data)
        dispatch(adminLoginSuccess({accessToken : res.data.accessToken , adminData : res.data.adminData}))
        toast.success("Welcome Admin")
        navigate('/admin/dashboard', { replace: true })
      } else {
        toast.error(res.data.message || "Something wrong !")
      }

    } catch (error) {
      toast.error(error?.response?.data.message)
    }
    finally {
      dispatch(loadEnd())
    }
    reset()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black text-white font-bold flex items-center justify-center text-sm">
                Zip
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <HelpCircle size={24} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-10">
            <h2 className="text-2xl font-semibold text-center mb-8">Admin Login</h2>

            <form className="space-y-6" onSubmit={handleSubmit(adminLoginSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder='test@gmail.com'
                  {...register("email", {
                    required: { value: true, message: "Email is required !" },
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email !" }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    {...register("password", { required: { value: true, message: "Password is required !" }, minLength: { value: 8, message: "Password must be 8 letters !" } })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 transition-all"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`relative w-full flex items-center justify-center gap-2 
                          py-2.5 rounded-lg font-medium text-white transition-all duration-300
                          ${loading ? "bg-green-600 cursor-not-allowed opacity-90"
                        : "bg-green-600 hover:bg-green-700 active:scale-95" }`} >
                {loading ? (
                  <>
                    <Loader className="animate-spin text-white" size={18} />
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
