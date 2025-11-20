import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function CouponForm({ couponSubmit, coupon }) {

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            couponCode: coupon?.couponCode || "",
            discount: coupon?.discount || "",
            description: coupon?.description || "",
            expiryDate: coupon?.expiryDate ? new Date(coupon?.expiryDate).toISOString().split("T")[0] : "",
            limit: coupon?.limit || "",
            minPurchase: coupon?.minPurchase || "",
            maxRedeem: coupon?.maxRedeem || 0
        }
    })

    useEffect(() => {
        if (coupon) {
            reset({
                couponCode: coupon?.couponCode || "",
                discount: coupon?.discount || "",
                description: coupon?.description || "",
                expiryDate: coupon?.expiryDate ? new Date(coupon?.expiryDate).toISOString().split("T")[0] : "",
                limit: coupon?.limit || "",
                minPurchase: coupon?.minPurchase || "",
                maxRedeem: coupon?.maxRedeem || 0
            })
        }
    }, [coupon, reset])

    return (
        <form onSubmit={handleSubmit(couponSubmit)} className="bg-white rounded-lg shadow-sm p-6 sm:p-8" noValidate>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{coupon ? "Edit Coupon" : "Add coupon"}</h2>

            <div className="space-y-6">
                {/* Row 1: Coupon Code & Discount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 w-32 text-left">
                            Coupon Code
                        </label>
                        <span className="text-gray-700">:</span>
                        <div>
                            <input
                                type="text"
                                name="couponCode"
                                {...register("couponCode", {
                                    required: { value: true, message: "Code is required !" },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z]).+$/,
                                        message: "Coupon Code must include at least one alphabet !"
                                    },
                                    maxLength: { value: 20, message: "Coupon code must be lessthan 20 letters !" },
                                    validate: (val) => val.trim() === val || "Enter valid code !"
                                })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.couponCode && <p className='text-center mt-2 text-red-500'>{errors.couponCode.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 w-32 text-left">
                            Discount
                        </label>
                        <span className="text-gray-700">:</span>
                        <div>
                            <input
                                type="text"
                                name="discount"
                                {...register("discount", {
                                    required: { value: true, message: "Discount is required !" },
                                    pattern: {
                                        value: /^(\d{1,2}(\.\d+)?%|\d{1,5})$/,
                                        message: "Enter valid offer (e.g., 20 or 20%)"
                                    }
                                })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.discount && <p className='text-center mt-2 text-red-500'>{errors.discount.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Row 2: Description & Expiry Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 w-32 text-left">
                            Description
                        </label>
                        <span className="text-gray-700">:</span>
                        <div>
                            <input
                                type="text"
                                name="description"
                                {...register("description", {
                                    required: { value: true, message: "Description is required !" },
                                    validate: (val) => val.trim() === val || "Enter valid description !",
                                    minLength: { value: 10, message: "Description aleast 10 letters !" },
                                    maxLength: { value: 50, message: "Description must be lessthan 50 letters !" },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z]).+$/,
                                        message: "Description must include at least one alphabet !"
                                    },
                                })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.description && <p className='text-center mt-2 text-red-500'>{errors.description.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 w-32 text-left">
                            Expiry Date
                        </label>
                        <span className="text-gray-700">:</span>
                        <div>
                            <input
                                type="date"
                                name="expiryDate"
                                {...register("expiryDate", { required: { value: true, message: "Date is required !" } })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.expiryDate && <p className='text-center mt-2 text-red-500'>{errors.expiryDate.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Row 3: Limit & Minimum Purchase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 w-32 text-left">
                            Limit
                        </label>
                        <span className="text-gray-700">:</span>
                        <div>
                            <input
                                type="number"
                                name="limit"
                                {...register("limit", {
                                    required: { value: true, message: "limit is required !" },
                                    min: { value: 1, message: "Minimum limit will be 1" },
                                    max: { value: 1000, message: "Maximum limit is upto 1000" }
                                })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.limit && <p className='text-center mt-2 text-red-500'>{errors.limit.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 w-32 text-left">
                            Minimum purchase
                        </label>
                        <span className="text-gray-700">:</span>
                        <div>
                            <input
                                type="number"
                                name="minimumPurchase"
                                {...register("minPurchase", {
                                    required: { value: true, message: "minimum purchase is required !" },
                                    min: { value: 1, message: "minimum value must be 1" },
                                    validate: (val) => {
                                        if (watch("discount").includes("%")) {
                                            return true
                                        }
                                        return Number(val) > parseInt(watch("discount")) || "Minimum purchase must be greater than discount !";
                                    }
                                })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.minPurchase && <p className='text-center mt-2 text-red-500'>{errors.minPurchase.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Row 4: Active Toggle & Max Redeemable Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 w-32 text-left">
                            Max redeemable price
                        </label>
                        <span className="text-gray-700">:</span>
                        <div>
                            <input
                                type="number"
                                name="maxRedeemablePrice"
                                {...register("maxRedeem", {
                                    required: { value: true, message: "MaxRedeem is required !" },
                                    min: { value: 0, message: "Minimum value must be 0" }
                                })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.maxRedeem && <p className='text-center mt-2 text-red-500'>{errors.maxRedeem.message}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-12">
                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
                >
                    {coupon ? "Update" : "Add Coupon"}
                </button>
            </div>
        </form>
    );
}