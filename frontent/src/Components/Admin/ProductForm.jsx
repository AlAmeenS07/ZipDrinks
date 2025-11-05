
import React, { useEffect, useState } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm, Watch } from 'react-hook-form';
import axios from 'axios';
import axiosInstance from '../../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import ImageCropperModal from './ImageCropperModal';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'react-feather';

const ProductForm = ({ productEditSubmit, product }) => {

    const [categories, setCategories] = useState([])
    const [images, setImages] = useState([]);
    const [imgLoad, setImgLoad] = useState({})
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [inputKey, setInputKey] = useState(Date.now())
    const [cropModal, setCropModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);


    useEffect(() => {
        async function getCategories() {
            try {
                const { data } = await axiosInstance.get('/api/admin/categories');

                if (data.success) {
                    setCategories(data.categories);
                } else {
                    setCategories([]);
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message);
            }
        }

        getCategories();
    }, []);

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: product?.name || "",
            category: product?.category || "",
            offer: product?.offer || "",
            maxRedeem: product?.maxRedeem || "",
            description: product?.description || "",
            variants: product?.variants?.map((val) => {
                return { size: val.size, quantity: val.quantity, price: val.price, salePrice: val.salePrice }
            }) || [{ size: "", quantity: "", price: "", salePrice: "" }],
            brand: product?.brand || "",
            ingredients: product?.ingredients || "",
            store: product?.store || "",
            serve: product?.serve || "",
            life: product?.life || ""
        },
    });

    useEffect(() => {
        if (product && Object.keys(product).length > 0) {
            reset({
                name: product?.name || "",
                category: product?.category || "",
                offer: product?.offer || "",
                maxRedeem: product?.maxRedeem || "",
                description: product?.description || "",
                variants: product?.variants?.map((val) => {
                    return { size: val.size, quantity: val.quantity, price: val.price, salePrice: val.salePrice }
                }) || [{ size: "", quantity: "", price: "", salePrice: "" }],
                brand: product?.brand || "",
                ingredients: product?.ingredients || "",
                store: product?.store || "",
                serve: product?.serve || "",
                life: product?.life || ""
            })
        }
        if (product?.coverImage) {
            setMainImageIndex(product.images.indexOf(product.coverImage))
        }
        if (product?.images?.length > 0) {
            setImages([...product.images])
        }
    }, [reset, product, categories])

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const handleImageUpload = (e, i) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setCurrentIndex(i);
        setCropModal(true);

        setInputKey(Date.now())

    };

    const handleCropDone = async (croppedImageBlob) => {
        setCropModal(false);
        setImgLoad({ ...imgLoad, [currentIndex]: true });

        const data = new FormData();
        data.append('file', croppedImageBlob);
        data.append('upload_preset', 'First_Time_Cloudinary');
        data.append('cloud_name', 'dlpiwweof');

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dlpiwweof/image/upload',
                data
            );

            setImages((prev) => {
                const updated = [...prev];
                updated[currentIndex] = response.data.url;
                return updated;
            });

            setImgLoad({ ...imgLoad, [currentIndex]: false });
        } catch (err) {
            toast.error('Image upload failed', err.message);
            setImgLoad({ ...imgLoad, [currentIndex]: false });
        }
    };


    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        if (mainImageIndex === index) {
            setMainImageIndex(0);
        } else if (mainImageIndex > index) {
            setMainImageIndex(mainImageIndex - 1);
        }
    };

    const productAdd = async (data) => {
        if (images.length < 4) {
            return toast.error("4 images is required !")
        }
        data.images = images
        data.coverImage = images[mainImageIndex]
        setLoading(true)

        if (productEditSubmit) {
            await productEditSubmit(data)
            return setLoading(false)
        }

        try {
            let res = await axiosInstance.post('/api/admin/products/add-product', data)

            if (res.data.success) {
                toast.success("Product added successfully")
                navigate("/admin/products")
            }

        } catch (error) {
            toast.error(error.message)
        }
        finally {
            setLoading(false)
            reset()
        }
    };

    return (

        <form onSubmit={handleSubmit(productAdd)} className="space-y-6" noValidate>

            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h2>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            {...register("name", {
                                required: "Product name is required!",
                                maxLength: { value: 50, message: "Maximum 50 characters allowed!" },
                                minLength: { value: 3, message: "Minimum 3 characters required!" }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                {...register("category", { required: { value: true, message: "Category is required !" } })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => {
                                    return <option key={cat._id} value={cat.name}>{cat.name}</option>
                                })}
                            </select>
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}

                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Offer:
                            </label>
                            <input
                                type="text"
                                placeholder="20% or 50/-"
                                {...register("offer", {
                                    pattern: {
                                        value: /^(\d{1,2}(\.\d+)?%|\d{1,5})$/,
                                        message: "Enter valid offer (e.g., 20 or 20%)"
                                    }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            {errors.offer && <p className="text-red-500 text-sm mt-1">{errors.offer.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Redeemable:
                            </label>
                            <input
                                type="number"
                                placeholder="Maximum redeem amount"
                                {...register("maxRedeem", {
                                    min: { value: 0, message: "Cannot be negative!" },
                                    max: { value: 100000, message: "Too high!" }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            {...register("description", {
                                required: "Description is required!",
                                minLength: { value: 10, message: "Minimum 10 characters required!" },
                                maxLength: { value: 500, message: "Maximum 500 characters allowed!" }
                            })}
                            placeholder="Enter product description"
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}

                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`relative border-2 rounded-lg p-8 transition-colors ${mainImageIndex === index ? "border-green-500" : "border-dashed border-gray-300"
                            }`}
                    >
                        {imgLoad[index] ? (
                            <div className="flex justify-center items-center h-[100px] text-gray-500">
                                Uploading...
                            </div>
                        ) : img ? (
                            <>
                                <img
                                    src={img}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMainImageIndex(index)}
                                    className={`absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 text-xs rounded ${mainImageIndex === index ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {mainImageIndex === index ? "Cover" : "Set Cover"}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-600 mb-3">
                                    Upload an image for this product
                                </p>
                                <label className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2 justify-center">
                                    <Upload className="w-5 h-5 text-blue-600" />
                                    Upload Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, index)}
                                        key={inputKey + index}
                                        className="hidden"
                                    />
                                </label>
                            </>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => setImages((prev) => [...prev, null])}
                    className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition"
                >
                    <Plus className="w-5 h-5" /> Add Image
                </button>
            </div>


            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Size Variants</h2>
                    <button
                        type="button"
                        onClick={() => append({ size: "", quantity: "", price: "", salePrice: "" })}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                    >
                        <Plus className="w-4 h-4" />
                        Add Variant
                    </button>
                </div>

                <div className="space-y-4">
                    {fields.map((item, index) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg"
                        >
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                                <input
                                    type="text"
                                    {...register(`variants.${index}.size`, {
                                        required: "Size is required!",
                                        pattern: { value: /^\d+(\.\d+)?\s*(ml|ML|l|L)$/, message: "Use valid format (e.g., 500ml or 1L)" }
                                    })}
                                    placeholder="e.g., 500ml or 1L"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                />
                                {errors?.variants?.[index]?.size && <p className="text-red-500 text-sm mt-1">{errors?.variants?.[index].size.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    {...register(`variants.${index}.quantity`, {
                                        required: "Quantity is required!",
                                        // min: { value: 0, message: "Minimum quantity must be > 0" },
                                        max: { value: 100000, message: "Too large quantity!" }
                                    })}
                                    placeholder="120"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                />
                                {errors?.variants?.[index]?.quantity && <p className="text-red-500 text-sm mt-1">{errors?.variants?.[index].quantity.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    {...register(`variants.${index}.price`, {
                                        required: "Price is required!",
                                        min: { value: 0, message: "Price must be >= 0" },
                                        max: { value: 100000, message: "Maximum 100000 allowed!" }
                                    })}
                                    placeholder="50"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                />
                                {errors?.variants?.[index]?.price && <p className="text-red-500 text-sm mt-1">{errors?.variants?.[index].price.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Sale Price</label>
                                <input
                                    type="number"
                                    {...register(`variants.${index}.salePrice`, {
                                        required: "Sale price is required!",
                                        min: { value: 0, message: "Sale price must be >= 0!" },
                                        max: { value: 100000, message: "Maximum 100000 allowed!" }
                                    })}
                                    placeholder="45"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                />
                                {errors?.variants?.[index]?.salePrice && <p className="text-red-500 text-sm mt-1">{errors?.variants?.[index].salePrice.message}</p>}
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    className={`w-full py-2 rounded-lg transition flex items-center justify-center gap-2 ${fields.length === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-red-50 text-red-600 hover:bg-red-100"
                                        }`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm">Remove</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Description</h2>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brand
                        </label>
                        <input
                            type="text"
                            placeholder="e.g, Pepsico"
                            {...register("brand", { required: { value: true, message: "Brand is required !" } })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ingredients
                        </label>
                        <textarea
                            placeholder="List all ingredients"
                            rows="3"
                            {...register("ingredients", { required: { value: true, message: "ingredients is required !" }, minLength: { value: 5, message: "Atleast 5 charecters !" } })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Storage Instructions
                        </label>
                        <textarea
                            placeholder="How to store this product"
                            rows="3"
                            {...register("store", { required: { value: true, message: "Store Instruction is required !" } })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.store && <p className="text-red-500 text-sm mt-1">{errors.store.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Serve Amount
                        </label>
                        <input
                            type="text"
                            placeholder="e.g, 300ml"
                            {...register("serve", { required: { value: true, message: "Server amount is required !" } })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.serve && <p className="text-red-500 text-sm mt-1">{errors.serve.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shelf Life
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., 12 months"
                            {...register("life", { required: { value: true, message: "Product Life is required !" } })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.life && <p className="text-red-500 text-sm mt-1">{errors.life.message}</p>}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={`relative w-full flex items-center justify-center gap-2 mt-4 
                                    py-2.5 rounded-lg font-medium text-white transition-all duration-300
                                    ${loading
                            ? "bg-green-600 cursor-not-allowed opacity-90"
                            : "bg-green-700 hover:bg-green-800 active:scale-95"
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader className="animate-spin text-white" size={18} />
                            <span>Loading...</span>
                        </>
                    ) : (
                        `${product ? "Edit Product" : "Add Product"}`
                    )}
                </button>

            </div>
            {cropModal && (
                <ImageCropperModal
                    image={selectedImage}
                    onCropDone={handleCropDone}
                    onClose={() => setCropModal(false)}
                />
            )}
        </form>
    );
}

export default ProductForm