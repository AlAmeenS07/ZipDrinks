import React, { useEffect, useState } from 'react'
import Images from '../../Components/Images'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../../Helper/AxiosInstance'
import { Heart, Loader, ShoppingCart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../../Components/Card'
import { productFetch } from '../../Store/user/Products'
import Footer from '../../Components/Footer'
import { fetchWishList } from '../../Store/user/wishlist'
import { fetchCart } from '../../Store/user/cartSlice'

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState()
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [activeTab, setActiveTab] = useState('description')
    // const [loading, setLoading] = useState(false)
    const user = useSelector(state => state.user.userData)
    const wishlist = useSelector(state => state.wishlist?.wishlistData)
    const cart = useSelector(state => state.cart?.cartData);

    const cartItem = cart?.items?.find(item => item?.productId?._id == id && item?.sku == selectedVariant?.sku)

    const dispatch = useDispatch()
    const products = useSelector(state => state.product.productData)

    const inWishlist = wishlist?.items?.some(item => item.productId?._id.toString() == id)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        dispatch(productFetch())
    }, [])

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchWishList())
        }
    }, [user])

    useEffect(() => {
        async function getProduct() {
            // setLoading(true)
            try {
                let { data } = await axiosInstance.get(`/api/products/${id}`)
                if (data.success) {
                    setProduct(data.product)

                    if (selectedVariant) {
                        const updatedVariant = data.product.variants.find(variant => variant.sku == selectedVariant.sku)
                        setSelectedVariant(updatedVariant || data.product.variants[0])
                    }
                    else {
                        setSelectedVariant(data.product.variants[0])
                    }
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
            finally {
                // setLoading(false)
            }
        }
        getProduct()
    }, [id, cart])

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant)
    }

    const handleAddToCart = async () => {
        let selectedProduct = { productId: product._id, sku: selectedVariant.sku }
        try {

            const { data } = await axiosInstance.post('/api/cart', selectedProduct)

            if (data.success) {
                dispatch(fetchCart())
                dispatch(fetchWishList())
                toast.success("Added to cart")
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    const handleWishlistClick = () => {
        if (!user) {
            toast.error("You are not LoggedIn");
            return;
        }

        if (inWishlist) {
            removeWishlist(product._id);
        } else {
            addToWishlist(product._id, selectedVariant.sku);
        }
    };

    const removeWishlist = async (id) => {
        try {
            let { data } = await axiosInstance.delete(`/api/wishlist/${id}`)

            if (data.success) {
                toast.success("Removed from wishlist")
                dispatch(fetchWishList())
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const addToWishlist = async (id) => {
        try {
            let { data } = await axiosInstance.post('/api/wishlist', { productId: id })

            if (data.success) {
                toast.success("Added to wishlist")
                dispatch(fetchWishList())
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data.message)
        }
    }

    const decrementCart = async () => {
        try {

            let { data } = await axiosInstance.patch('/api/cart', { productId: id, sku: selectedVariant.sku })

            if (data.success) {
                dispatch(fetchCart())
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error?.response?.data.message)
        }
    }

    return (
        <>
            <div className="max-w-6xl mx-auto px-2 md:px-8 py-4">
                <div className="flex flex-col md:flex-row gap-4 md:gap-10">

                    <div className="md:w-1/2 w-full mb-4 md:mb-0">
                        <Images images={product?.images || []} productName={product?.name || ""} />
                    </div>

                    <div className="md:w-1/2 w-full bg-white rounded border border-gray-200 p-3 md:p-6 flex flex-col">
                        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{product?.name}</h1>
                        {product?.description && (
                            <p className="mb-2 md:mb-4 text-gray-700 text-sm md:text-base">{product.description}</p>
                        )}

                        <div className="mb-4">
                            <p className="text-xs md:text-sm font-medium mb-2">Select Size:</p>
                            <div className="flex flex-wrap gap-2">
                                {product?.variants?.map((val) => (
                                    <button
                                        key={val.sku}
                                        onClick={() => handleVariantSelect(val)}
                                        className={`px-3 py-2 border rounded text-xs md:text-base w-[80px] md:w-auto 
                                        ${selectedVariant?.sku === val.sku ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-300 hover:border-gray-400'}`}>
                                        {val.size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedVariant && (
                            <div className="border-t border-b border-gray-200 py-3 mb-4">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-lg md:text-2xl font-bold">₹{selectedVariant.salePrice.toFixed(2)}</span>
                                    {selectedVariant.price > selectedVariant.salePrice ? (
                                        <span className="text-black line-through text-sm md:text-lg">
                                            ₹{selectedVariant.price || selectedVariant.price}
                                        </span>
                                    ) : ""}
                                    <span className={selectedVariant.quantity <= 0 ? `text-red-600 text-sm` : selectedVariant.quantity <= 10 ? `text-orange-600 text-sm` : `text-green-600 text-sm`}>
                                        {selectedVariant?.quantity <= 0 ? "Stock out" : `Stock left : ${selectedVariant.quantity}`}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-auto">
                            {cartItem ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        className="px-3 py-1 bg-gray-200 hover:bg-red-400 text-xl rounded"
                                        onClick={() => decrementCart()}
                                    >
                                        -
                                    </button>
                                    <span className="px-3 py-1 border rounded">{cartItem.quantity}</span>
                                    <button
                                        className={`px-3 py-1 bg-gray-800 text-white text-xl hover:bg-gray-900 rounded 
                                        ${selectedVariant?.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'}`}
                                        disabled={selectedVariant?.quantity <= 0}
                                        onClick={() => handleAddToCart()}
                                    >
                                        +
                                    </button>

                                </div>
                            ) : (
                                <button
                                    className={`w-full py-2 md:py-3 rounded font-medium flex items-center justify-center gap-2 
                                            ${selectedVariant?.quantity <= 0
                                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-gray-900'}`}
                                    disabled={selectedVariant?.quantity <= 0}
                                    onClick={() => {
                                        if (!user) toast.error("You are not LoggedIn");
                                        else if (selectedVariant.quantity <= 0) toast.error("Stock out");
                                        else handleAddToCart();
                                    }}
                                >
                                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                    Add to Cart
                                </button>

                            )}

                            <button
                                className={`w-full py-2 md:py-3 rounded font-medium flex items-center justify-center gap-2
                                        ${inWishlist
                                        ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                                        : 'bg-white border border-gray-900 text-gray-900 hover:bg-gray-100'}`}
                                onClick={handleWishlistClick}
                            >
                                <Heart className={`w-4 h-4 md:w-5 md:h-5 ${inWishlist ? 'text-white' : ''}`} />
                                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 my-6">
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            {/* <button
                                onClick={() => setActiveTab('reviews')}
                                className={`w-1/2 px-3 md:px-8 py-2 md:py-4 font-medium border-b-2 transition-colors 
                                    ${activeTab === 'reviews' ? 'border-gray-900 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                All Reviews
                            </button> */}
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`w-1/2 px-3 md:px-8 py-2 md:py-4 font-medium border-b-2 transition-colors 
                                ${activeTab === 'description' ? 'border-gray-900 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                Description
                            </button>
                        </div>
                    </div>
                    <div className="p-2 md:p-6">
                        {activeTab === 'reviews' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                                No review yet
                            </div>
                        )}
                        {activeTab === 'description' && (
                            <>
                                <div className="prose prose-sm md:prose max-w-full md:max-w-none mb-2">
                                    <h2 className='text-lg md:text-2xl font-bold text-black'>Description</h2>
                                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed">{product?.description}</p>
                                </div>
                                <div className="prose prose-sm md:prose max-w-full md:max-w-none my-2">
                                    <h2 className='text-lg md:text-2xl font-bold text-black'>Brand</h2>
                                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed">{product?.brand}</p>
                                </div>
                                <div className="prose prose-sm md:prose max-w-full md:max-w-none my-2">
                                    <h2 className='text-lg md:text-2xl font-bold text-black'>Ingredients</h2>
                                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed">{product?.ingredients}</p>
                                </div>
                                <div className="prose prose-sm md:prose max-w-full md:max-w-none my-2">
                                    <h2 className='text-lg md:text-2xl font-bold text-black'>Store</h2>
                                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed">{product?.store}</p>
                                </div>
                                <div className="prose prose-sm md:prose max-w-full md:max-w-none my-2">
                                    <h2 className='text-lg md:text-2xl font-bold text-black'>Serve Amount</h2>
                                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed">{product?.serve}</p>
                                </div>
                                <div className="prose prose-sm md:prose max-w-full md:max-w-none my-2">
                                    <h2 className='text-lg md:text-2xl font-bold text-black'>Expiry</h2>
                                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed">{product?.life}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="min-h-screen bg-gray-100 p-4 my-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl text-center font-bold text-gray-900 mb-2">Recommended Drinks</h1>
                        <p className="text-gray-600 text-center mb-8">Check out our recommended Drinks</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                            {products?.filter((prd) => prd?.category == product?.category && prd?._id !== product?._id).slice(0, 4)?.map((product) => (
                                <Card
                                    key={product._id}
                                    id={product._id}
                                    image={product.images[0]}
                                    name={product.name}
                                    category={product.category}
                                    price={product.variants[0].price}
                                    salePrice={product.variants[0].salePrice}
                                    appliedOffer={product?.appliedOffer}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetail
