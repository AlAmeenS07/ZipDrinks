import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWishList } from '../../Store/user/wishlist'
import Card from '../../Components/Card'
import { Heart } from 'lucide-react'
import axiosInstance from '../../Helper/AxiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Wishlist = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  let wishlist = useSelector((state) => state.wishlist?.wishlistData)
  const [selectedVariant, setSelectedVariant] = useState({})

  useEffect(() => {
    dispatch(fetchWishList())
  }, [dispatch])


  const handleRemoveWishlist = async (productId) => {
    try {
      let { data } = await axiosInstance.delete(`/api/wishlist/${productId}`)

      if (data.success) {
        toast.success("Removed from wishlist")
        dispatch(fetchWishList())
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const handleEmptyWishlist = async () => {
    try {
      let { data } = await axiosInstance.delete(`/api/wishlist`)

      if (data.success) {
        toast.success("Removed from wishlist")
        dispatch(fetchWishList())
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddToCart = async (productId , sku) => {
    let selectedProduct = { productId , sku }
    try {

      const { data } = await axiosInstance.post('/api/cart', selectedProduct)

      if (data.success) {
        toast.success("Added to cart")
        navigate('/cart')
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Wishlist - {wishlist?.items?.filter(item => item.productId.isListed == true).length || 0}
        </h1>
        <div className="flex gap-3 mt-4 sm:mt-0">
          {wishlist?.items?.length > 0 ? (
            <button
              onClick={handleEmptyWishlist}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
            >
              Empty my Wishlist
            </button>
          ) : ""}
        </div>
      </div>

      {wishlist?.items?.length === 0 || !wishlist ? (
        <p className="text-center text-gray-600 text-lg">No Products Found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {wishlist?.items?.filter(item => item.productId.isListed == true).map((product) => {
            const p = product?.productId
            const selected = selectedVariant[p._id] ?? 0
            const variant = p?.variants[selected]
            return (
              <div
                key={p?._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col items-center"
              >
                <Card
                  id={p?._id}
                  image={p?.coverImage || p?.images?.[0]}
                  name={p?.name}
                  category={p?.category}
                  price={variant?.price}
                  salePrice={variant?.salePrice}
                  quantity={variant?.quantity}
                  appliedOffer={p?.appliedOffer}
                />

                <div className="w-full mt-3 flex flex-col gap-2">
                  <select
                    className="border w-full py-1 px-2 rounded"
                    onChange={(e) =>
                      setSelectedVariant((v) => ({
                        ...v,
                        [p._id]: e.target.selectedIndex
                      }))
                    }
                  >
                    {p?.variants?.map((item) => (
                      <option key={item.sku} value={item.sku}>
                        {item.size}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleAddToCart(p._id, variant.sku)}
                    disabled={variant?.quantity <= 0}
                    className={`w-full ${variant?.quantity <= 0 ? `bg-gray-600 cursor-not-allowed` : `bg-gray-800 hover:bg-gray-900`} text-white py-2 rounded-md font-medium  flex items-center justify-center gap-2`}
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveWishlist(p?._id)}
                    className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default Wishlist
