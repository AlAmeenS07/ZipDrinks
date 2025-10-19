import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "../../Helper/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Loader } from "react-feather";

const CategoryForm = ({ categoryEditSubmit, category }) => {

    const navigate = useNavigate()
    const [imgLoad, setImgLoad] = useState(false);
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(category?.image || "");
    const [imagePreview, setImagePreview] = useState(category?.image || "");


    const { register, formState: { errors }, reset, handleSubmit } = useForm({
        defaultValues: {
            name: category?.name || "",
            description: category?.description || "",
            offer: category?.offer || "",
            maxRedeem: category?.maxRedeem || ""
        }
    })

    useEffect(() => {
        if (category && Object.keys(category).length > 0) {
            reset({
                name: category?.name || "",
                description: category?.name || "",
                offer: category?.offer || "",
                maxRedeem: category?.maxRedeem || "",
            })
            setImage(category?.image || "")
            setImagePreview(category?.image || "")
        }
    }, [category, reset])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImgLoad(true);

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "First_Time_Cloudinary");
        data.append("cloud_name", "dlpiwweof");

        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dlpiwweof/image/upload",
            data
        );

        setImage(response.data.url);
        setImagePreview(response.data.url);
        setImgLoad(false);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const categorySubmit = async (data) => {
        if (!image) {
            return toast.error('Image is required !')
        }
        data.image = image

        setLoading(true)

        if (categoryEditSubmit) {
            await categoryEditSubmit(data)
            return
        }

        try {

            let res = await axiosInstance.post('/api/admin/add-category', data)

            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/admin/categories")
            } else {
                toast.error(res.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }

        handleRemoveImage()
        reset()
    };

    return (
        <form className="bg-white rounded-lg shadow-sm p-6 md:p-8" onSubmit={handleSubmit(categorySubmit)}>
            {/* Upload Image Section */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                </label>

                {!imagePreview ? (
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center hover:border-gray-400 transition-colors"
                    >
                        <div className="flex flex-col items-center">
                            {imgLoad ? (
                                <div className="flex justify-center items-center h-[100px] text-gray-500">
                                    Uploading...
                                </div>
                            ) : image ? (
                                <img
                                    src={image}
                                    alt="Uploaded"
                                    className="w-32 h-32 object-cover rounded mb-3"
                                />
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Drop image here or click below
                                    </p>
                                    <label className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2">
                                        <Upload className="w-5 h-8 text-blue-600" />
                                        Upload Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="relative border-2 border-gray-300 rounded-lg p-4">
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            {...register("image")}
                            className="w-full h-48 object-cover rounded"
                        />
                    </div>
                )}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Category Offer */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Offer:
                    </label>
                    <input
                        type="text"
                        placeholder="20% or 50/-"
                        {...register("offer", { pattern: { value: /^(100(\.0+)?%?|[0-9]?\d(\.\d+)?%?)$/, message: "Enter a valid offer (e.g. 20 or 20%)" } })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {errors.offer && <p className="text-red-500 text-sm mt-1">{errors.offer.message}</p>}
                </div>

                {/* Max Redeemable */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Redeemable:
                    </label>
                    <input
                        type="number"
                        placeholder="Maximum redeem amount"
                        {...register("maxRedeem")}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            {/* Category Name */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name:
                </label>
                <input
                    type="text"
                    {...register("name", { required: { value: true, message: "Category name is required !" }, minLength: { value: 4, message: "Name must be 4 charecters !" } })}
                    placeholder="Type category name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description:
                </label>
                <textarea
                    {...register("description", { required: { value: true, message: "Description is required !" }, minLength: { value: 10, message: "Must be 10 charecters" } })}
                    placeholder="Type category description..."
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
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
                        `${category ? "Update" : "Add Category"}`
                    )}
                </button>

            </div>
        </form>
    );
};

export default CategoryForm;
