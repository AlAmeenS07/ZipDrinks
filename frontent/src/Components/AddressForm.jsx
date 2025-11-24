import React, { useEffect } from 'react'
import { Loader } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const AddressForm = ({ addressSubmit, address, checkout }) => {

    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            fullname: address?.fullname || "",
            phone: address?.phone?.split(" ")[1] || "",
            address: address?.address || "",
            district: address?.district || "",
            state: address?.state || "",
            landmark: address?.landmark || "",
            pincode: address?.pincode || ""
        }
    })

    useEffect(() => {
        if (address && Object.keys(address).length > 0) {
            reset({
                fullname: address?.fullname || "",
                phone: address?.phone?.split(" ")[1] || "",
                address: address?.address || "",
                district: address?.district || "",
                state: address?.state || "",
                landmark: address?.landmark || "",
                pincode: address?.pincode || ""
            })
        }

    }, [address, reset])

    const loading = useSelector(state => state.user.loading)

    return (
        <div className="w-full bg-gray-50 py-10 px-4 sm:px-6 lg:px-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 border border-gray-100">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">{address ? "Edit Address" : "Add New Address"}</h1>
                    <h2 className="text-lg font-medium text-gray-600 mt-2 sm:mt-0">Personal Information</h2>
                </div>

                <form className="max-w-5xl mx-auto space-y-6" onSubmit={handleSubmit(addressSubmit)} noValidate>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="eg : john Doe"
                            {...register("fullname", {
                                required: { value: true, message: "Full name is required !" },
                                validate: (val) => val.trim() != "" || "Enter valid name !",
                                maxLength: { value: 20, message: "Name must be lessthan 20" },
                                pattern: {
                                    value: /^(?=.*[A-Za-z]).+$/,
                                    message: "Fullname must include at least one alphabet !"
                                },
                            })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition"
                        />
                        {errors.fullname && <p className='text-red-500 text-sm mt-1'>{errors.fullname.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="flex gap-2">
                            <span className="inline-flex items-center px-3 rounded-l-lg border border-gray-300 bg-white text-gray-600 select-none">
                                +91
                            </span>
                            <input
                                type="tel"
                                placeholder="eg : 9847685514"
                                {...register("phone", {
                                    required: { value: true, message: "Phone Number is required !" },
                                    pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid number !" }, 
                                    minLength: { value: 10, message: "Phone Number must be 10" }
                                })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition"
                            />
                            {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea
                            placeholder="eg: House name, House Number, Locality"
                            rows="3"
                            {...register("address", {
                                required: { value: true, message: "Address is required !" },
                                minLength: { value: 5, message: "Address must be 5 letters !" },
                                validate: (val) => val.trim() !== "" || "Enter valid address !",
                                maxLength: { value: 50, message: "Address must be lessthan 50 letters !" },
                                pattern: {
                                    value: /^(?=.*[A-Za-z]).+$/,
                                    message: "Address must include at least one alphabet !"
                                },
                            })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition"
                        />
                        {errors.address && <p className='text-red-500 text-sm mt-1'>{errors.address.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                            <input
                                type="text"
                                placeholder="eg : Ernakulam"
                                {...register("district", {
                                    required: { value: true, message: "District is required !" },
                                    validate: (val) => val.trim() !== "" || "Enter valid District !",
                                    maxLength: { value: 20, message: "District must be lessthan 20 !" },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z]).+$/,
                                        message: "District must include at least one alphabet !"
                                    },
                                })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition"
                            />
                            {errors.district && <p className='text-red-500 text-sm mt-1'>{errors.district.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                            <input
                                type="text"
                                placeholder="eg : Kerala"
                                {...register("state", {
                                    required: { value: true, message: "State is required !" },
                                    validate: (val) => val.trim() !== "" || "Enter valid State !",
                                    maxLength: { value: 20, message: "State must be lessthan 20 letters !" },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z]).+$/,
                                        message: "State must include at least one alphabet !"
                                    },
                                })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition"
                            />
                            {errors.state && <p className='text-red-500 text-sm mt-1'>{errors.state.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                            <input
                                type="text"
                                placeholder="eg : Hospital"
                                {...register("landmark", {
                                    required: { value: true, message: "City is required !" },
                                    validate: (val) => val.trim() !== "" || "Enter valid landmark !",
                                    maxLength: { value: 20, message: "Landmark must be lessthan 20 letters !" },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z]).+$/,
                                        message: "Landmark must include at least one alphabet !"
                                    },
                                })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition"
                            />
                            {errors.landmark && <p className='text-red-500 text-sm mt-1'>{errors.landmark.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                            <input
                                type="number"
                                placeholder="eg : 681244"
                                {...register("pincode", {
                                    required: { value: true, message: "Pincode is required !" },
                                    minLength: { value: 6, message: "Pincode must be 6 digits  !" },
                                    maxLength: { value: 6, message: "Pincode must be 6 digits !" }
                                })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white transition"
                            />
                            {errors.pincode && <p className='text-red-500 text-sm mt-1'>{errors.pincode.message}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        {checkout ? "" : (
                            <Link to={"/profile/address"}
                                type="button"
                                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition"
                            >
                                Cancel
                            </Link>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader className="animate-spin h-5 w-5 text-white" />
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddressForm
