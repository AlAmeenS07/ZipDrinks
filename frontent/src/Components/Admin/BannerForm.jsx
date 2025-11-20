import React, { useEffect, useState } from 'react';
import { Image, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

const BannerForm = ({ bannerSubmit, banner }) => {

    const [image, setImage] = useState(null);
    const [imgLoad, setImgLoad] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            title: banner?.title || "",
            description: banner?.description || ""
        },
    })

    useEffect(() => {
        if (banner && Object.keys(banner).length > 0) {
            reset({
                title: banner?.title || "",
                description: banner?.description || ""
            })
            setImage(banner?.image || "")
        }
    }, [banner, reset])

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
        setImgLoad(false);
    };

    const removeImage = () => {
        setImage("")
    }

    const submitBanner = (data) => {
        if (!image) {
            toast.error("Image is required !")
        }
        data.image = image
        bannerSubmit(data)
        reset()
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

            {/* Form Container */}
            <form onSubmit={handleSubmit(submitBanner)} className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-6">{banner ? "Edit Banner" : "ADD NEW BANNER"}</h2>

                    {/* Image Upload Area */}
                    <div className="mb-6">
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-4 md:p-8 text-center transition-colors`}
                        >
                            {image ? (
                                <div className="relative">
                                    <img
                                        src={image}
                                        alt="Preview"
                                        className="max-h-64 mx-auto rounded-lg object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : imgLoad ? (
                                <div className='flex justify-center items-center'>
                                    <h4>Uploading...</h4>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-indigo-100 p-4 rounded-full">
                                            <Image className="w-8 h-8 text-indigo-600" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Drag and drop image here, or click add image
                                    </p>
                                    <label htmlFor="image-upload">
                                        <span className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                                            Add Image
                                        </span>
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title and Description Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                {...register("title", {
                                    required: { value: true, message: "Title is required !" },
                                    validate: (val) => val.trim() != "" || "Enter valid title !",
                                    maxLength: { value: 25, message: "Title must be lessthan 25" },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z]).+$/,
                                        message: "Title must include at least one alphabet !"
                                    },
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter banner title"
                            />
                            {errors.title && <p className='text-center mt-2 text-red-500'>{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <input
                                id="description"
                                type="text"
                                {...register("description", {
                                    required: { value: true, message: "Description is required !" },
                                    minLength: { value: 10, message: "Description must be atleast 10 letters !" },
                                    validate: (val) => val.trim() != "" || "Enter valid description !",
                                    maxLength: { value: 75, message: "Description must be lessthan 75" },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z]).+$/,
                                        message: "Description must include at least one alphabet !"
                                    },
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter banner description"
                            />
                            {errors.description && <p className='text-center mt-2 text-red-500'>{errors.description.message}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type='submit'
                            className="px-12 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors w-full md:w-auto"
                        >
                            {banner ? "Update" : "Add"}
                        </button>
                    </div>
                </div>
            </form>

        </div>
    );
};

export default BannerForm;