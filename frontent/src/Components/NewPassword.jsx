
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loadingEnd, loginStart } from '../Store/user/UserSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'react-feather';
import axiosInstance from '../Helper/AxiosInstance';

const NewPassword = ({setNewPassword , setEmail}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loading = useSelector(state => state.user.loading);
  const dispatch = useDispatch()
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate()

  const { register, formState: { errors }, reset, watch, handleSubmit } = useForm()

  const newPasswordSubmit = async (data) => {
    dispatch(loginStart())
    try {

      let res = await axiosInstance.post(backendUrl + '/api/auth/reset-password', { newPassword: data.password, confirmNewPassword: data.confirmPassword })

      if (res.data.success) {
        setNewPassword(false);
        setEmail(true);
        toast.success("Password changed Successfully");
        navigate("/login")
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
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Enter new Password</h2>

        <form className="space-y-6" onSubmit={handleSubmit(newPasswordSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Enter new Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("password", {
                  required: { value: true, message: "Password is required !" },
                  pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' }
                })}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
              {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Confirm new password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: { value: true, message: "Confirm password is required !" },
                  validate: (value) => value === watch('password') || "password must be match !"
                })}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
              {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message}</p>}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`relative w-full flex items-center justify-center gap-2 mt-4 
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
              "Verify"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}


export default NewPassword;