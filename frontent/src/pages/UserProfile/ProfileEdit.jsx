import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserProfileMain from '../../Components/UserProfileMain'
import { Link, useNavigate } from 'react-router-dom'
import { Edit2, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import handleImageUpload from '../../Helper/ImageHelper'
import { toast } from 'react-toastify'
import axiosInstance from '../../Helper/AxiosInstance'
import { loadingEnd, loginStart, loginSuccess } from '../../Store/user/UserSlice'
import { Loader } from 'react-feather'

const ProfileEdit = () => {
    const user = useSelector(state => state.user?.userData)
    const loading = useSelector(state => state.user.loading)
    const [selectedImage, setSelectedImage] = useState(null)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            fullname: user?.fullname,
            email: user?.email,
            phone: user?.phone?.split(" ")[1]
        }
    })

    const handleImageChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            let url = await handleImageUpload(event)
            setSelectedImage(url)
        }
    }

    async function onEditSubmit(data) {
        data.profileImage = selectedImage
        data.phone = `+91 ${data.phone}`

        dispatch(loginStart())
        try {

            let res = await axiosInstance.put('/api/user/edit', data)

            if (res.data.success && res.data.otp) {
                localStorage.setItem("new-email", res.data.email)
                return navigate("/profile/edit/verify")
            }

            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(loginSuccess(res.data.userData))
                navigate("/profile")
            } else {
                toast.error(res.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        finally {
            reset()
            dispatch(loadingEnd())
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
                    <li>
                        <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
                    </li>
                    <li><span className="mx-2">/</span></li>
                    <li className="text-gray-700">Edit</li>
                </ol>
            </nav>

            <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">

                <h2 className="text-center text-2xl font-semibold text-gray-900 mb-6">
                    Edit Profile
                </h2>

                <label
                    htmlFor="profileImageInput"
                    className="mx-auto w-24 h-24 bg-black rounded-full overflow-hidden flex justify-center items-center mb-6 cursor-pointer relative"
                >
                    {(selectedImage || user?.profileImage) ? (
                        <img
                            src={selectedImage || user.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-16 h-16 text-white" />
                    )}

                    <div className="absolute bottom-8 right-0 bg-orange-400 rounded-full p-1">
                        <Edit2 className="w-5 h-5 text-black" />
                    </div>
                </label>

                <input
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />


                <form className="space-y-6 w-full" onSubmit={handleSubmit(onEditSubmit)} noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            {...register('fullname', {
                                required: { value: true, message: "Full name is requried !" },
                                minLength: { value: 4, message: "Minimum 4 letters !" },
                                validate: (value) => value.trim() !== "" || "Name cannot be whitespace !"
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                            placeholder="Enter your full name"
                            defaultValue={user?.fullname || ''}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: { value: true, message: "Email is required !" },
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid Email !" }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                            placeholder="Enter your email"
                            defaultValue={user?.email || ''}
                        />
                    </div>

                    {/* Phone */}
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number
                    </label>
                    <div className="flex gap-2">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-neutral-300 bg-gray-100 text-gray-600 select-none">+91</span>
                        <input className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                            type="tel" placeholder="123-456-7890" defaultValue={user?.phone?.split(' ')[1] || ''} {...register("phone", {
                                required: { value: true, message: "Phone Number is required !" },
                                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid number !" },
                                minLength: { value: 10, message: "Phone Number must be 10" }
                            })} />
                        {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            disabled={loading}
                            className={`w-full flex justify-center items-center gap-2 py-3 rounded-md font-medium transition-colors
                            ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-black hover:bg-gray-800 text-white"}
                            `}>
                            {loading ? (
                                <>
                                    <Loader className="animate-spin w-5 h-5" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </UserProfileMain>
    )
}

export default ProfileEdit
