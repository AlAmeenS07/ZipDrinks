import { Minus, Plus } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchCart } from '../Store/user/cartSlice'
import axiosInstance from '../Helper/AxiosInstance'

const CartCard = ({ cartItems }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const handleAddToCart = async (productId, sku) => {
        let selectedProduct = { productId, sku }
        try {

            const { data } = await axiosInstance.post('/api/cart', selectedProduct)

            if (data.success) {
                dispatch(fetchCart())
                toast.success("Added to cart")
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    const decrementCart = async (productId , sku) => {
        try {

            let { data } = await axiosInstance.patch('/api/cart', { productId , sku })

            if (data.success) {
                dispatch(fetchCart())
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    const handleRemove = async (productId , sku , quantity)=>{
        try {

            let {data} = await axiosInstance.put('/api/cart' , {productId , sku , quantity})

            if(data.success){
                dispatch(fetchCart())
                toast.success("Removed from cart")
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <div className='divide-y'>
            {cartItems?.items?.map((item) => (
                <div key={item?.productId?._id} className='p-4 sm:p-6'>
                    <div className='flex flex-col sm:flex-row gap-4'>

                        <div className='flex-shrink-0' onClick={() => navigate(`/products/${item?.productId?._id}`)}>
                            <img src={item?.productId?.coverImage} alt={item?.productId?.name}
                                className='w-20 h-20 sm:w-24 object-cover rounded' />
                        </div>

                        <div className='flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                            <div className='flex-1'>

                                <h3 className='text-base sm:text-lg font-medium text-gray-700'>
                                    {item?.sku}
                                </h3>

                                <div className='mt-1 flex items-center gap-2'>
                                    <span className='text-sm sm:text-base text-gray-700'>
                                        Price ₹ {item?.productId?.variants?.find(variant => variant.sku == item.sku).salePrice}
                                    </span>
                                    {item?.productId?.variants.find(variant => variant.sku == item.sku).price > item?.productId?.variants.find(variant => variant.sku == item.sku).salePrice && (
                                        <span className='text-sm text-gray-400 line-through'>
                                            ₹ {item?.productId?.variants.find(variant => variant.sku == item.sku).price}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className='flex items-center gap-3'>
                                <div className='flex items-center border border-gray-300 roudned'>
                                    <button className='p-2 hover:bg-red-500 transition-colors'
                                        aria-label='Decrease quantity' onClick={()=> decrementCart(item?.productId?._id , item?.sku)}>
                                        <Minus size={16} />
                                    </button>

                                    <span className='px-4 py-1 min-w-[3rem] text-center border-x border-gray-300'>
                                        {item.quantity}
                                    </span>

                                    <button className='p-2 bg-gray-800 text-white hover:bg-gray-900 transition-colors'
                                        aria-label='Increase quantity'
                                        onClick={() => handleAddToCart(item?.productId?._id, item?.sku)}>
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button className='bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 transition-colors'
                                    onClick={()=> handleRemove(item?.productId?._id , item?.sku , item?.quantity)}>
                                    Remove
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            ))}
            <div className="px-4 sm:px-6 py-4 border-t">
                <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-600 uppercase">Total Amount</span>
                    <div className="flex gap-4">
                        <span className="text-gray-800 font-medium">₹ {cartItems?.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartCard
