import React from 'react'
import CartCard from '../../Components/CartCard'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCart } from '../../Store/user/cartSlice';
import { Loader, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../Helper/AxiosInstance';

const Cart = () => {

    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart?.cartData)

    useEffect(() => {
        dispatch(fetchCart())
    }, [dispatch])

    const clearCart = async()=>{
        try {

            let {data} = await axiosInstance.delete('/api/cart')

            if(data.success){
                dispatch(fetchCart())
                toast.success("Cart is empty !")
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }


    if (cartItems?.items?.length === 0 || !cartItems) {
        return (
            <div className="flex flex-col justify-center items-center py-20 px-6 rounded-2xl shadow-inner">

                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                    Your cart is empty
                </h2>

                <Link
                    to="/shop"
                    className="px-6 py-3 mt-4 bg-black text-white rounded-full font-medium hover:bg-gray-800"
                >
                    🛍️ Shop Now
                </Link>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-6xl mx-auto bg-white rounded-lg shadow-sm'>

                <div className='flex justify-between items-center px-4 sm:px-6 py-4 border-b'>
                    <h1 className='text-xl sm:text-2xl font-semibold text-gray-800'>CART</h1>
                    <button className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm sm:text-base transition-colors'
                        onClick={clearCart}>
                        Empty my Cart
                    </button>
                </div>

                <CartCard cartItems={cartItems} />

                <div className="px-4 sm:px-6 py-3 bg-gray-50 text-center text-xs sm:text-sm text-gray-600">
                    shipping, taxes, and discount codes calculated at checkout.
                </div>

                <div className="p-4 sm:p-6 space-y-3">
                    <Link to={"/checkout"} className="block w-full bg-gray-900 text-white text-center py-3 rounded hover:bg-black transition-colors text-sm sm:text-base font-medium">
                        Proceed to checkout
                    </Link>
                    <Link to={"/shop"} className="block w-full bg-gray-900 text-white text-center py-3 rounded hover:bg-black transition-colors text-sm sm:text-base font-medium">
                        Continue shopping
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Cart
