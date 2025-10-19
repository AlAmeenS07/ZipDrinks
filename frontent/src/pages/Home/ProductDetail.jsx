import React, { useEffect, useState } from 'react'
import Images from '../../Components/Images'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../../Helper/AxiosInstance'
import { Heart, Loader, ShoppingCart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../../Components/Card'
import { productFetch } from '../../Store/user/Products'
import Footer from '../../Components/Footer'

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState()
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [activeTab, setActiveTab] = useState('description')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const products = useSelector(state => state.product.productData)

    useEffect(() => {
        dispatch(productFetch())
    }, [])

    useEffect(() => {
        async function getProduct() {
            setLoading(true)
            try {
                let { data } = await axiosInstance.get(`/api/products/${id}`)
                if (data.success) {
                    setProduct(data.product)
                    if (data.product.variants && data.product.variants.length > 0) {
                        setSelectedVariant(data.product.variants[0])
                    }
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
            finally {
                setLoading(false)
            }
        }
        getProduct()
    }, [id])

    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant)
    }

    const handleAddToCart = () => {
        let selectedProduct = { productID: product._id, sku: selectedVariant.sku }
        console.log(selectedProduct)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="animate-spin text-gray-600" size={30} />
            </div>
        )
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
                                        ${selectedVariant?.sku === val.sku? 'border-gray-900 bg-gray-900 text-white'
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
                                    <span className="text-black line-through text-sm md:text-lg">
                                        ₹{selectedVariant.price || selectedVariant.price}
                                    </span>
                                    <span className='text-red-600 text-sm'>{selectedVariant?.quantity <= 0 ? "Out of stock" : ""}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-auto">
                            <button className="w-full bg-black text-white py-2 md:py-3 rounded font-medium hover:bg-gray-800 flex items-center justify-center gap-2"
                                onClick={() => {
                                    if (selectedVariant.quantity <= 0) {
                                        toast.error("Stock out")
                                        navigate("/shop")
                                    } else {
                                        handleAddToCart()
                                    }
                                }}>
                                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                Add to Cart
                            </button>
                            <button className="w-full bg-white border border-gray-900 text-gray-900 py-2 md:py-3 rounded font-medium hover:bg-gray-100 flex items-center justify-center gap-2">
                                <Heart className="w-4 h-4 md:w-5 md:h-5" />
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews + Description Tabs */}
                <div className="bg-white rounded-lg border border-gray-200 my-6">
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`w-1/2 px-3 md:px-8 py-2 md:py-4 font-medium border-b-2 transition-colors 
                                    ${activeTab === 'reviews'? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                All Reviews
                            </button>
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`w-1/2 px-3 md:px-8 py-2 md:py-4 font-medium border-b-2 transition-colors 
                                ${activeTab === 'description'? 'border-gray-900 text-gray-900'
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

                <div className="min-h-[1000] bg-gray-100 p-4 my-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl text-center font-bold text-gray-900 mb-2">Recommended Drinks</h1>
                        <p className="text-gray-600 text-center mb-8">Check out our recommended Drinks</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                            {products?.filter((prd) => prd?.category == product?.category).slice(0, 4)?.map((product) => (
                                <Card
                                    key={product._id}
                                    id={product._id}
                                    image={product.images[0]}
                                    name={product.name}
                                    category={product.category}
                                    price={product.variants[0].salePrice}
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
