import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWishList } from '../../Store/user/wishlist'
import Card from '../../Components/Card'
import { Heart } from 'lucide-react'
import axiosInstance from '../../Helper/AxiosInstance'
import { toast } from 'react-toastify'

const Wishlist = () => {

  const dispatch = useDispatch()
  let wishlist = useSelector((state) => state.wishlist?.wishlistData)

  useEffect(() => {
    dispatch(fetchWishList())
  }, [dispatch])


  const handleRemoveWishlist = async(productId) => {
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


  const handleEmptyWishlist = async() => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
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
                  price={p?.variants[0].price}
                  salePrice={p?.variants[0].salePrice}
                  appliedOffer={p?.appliedOffer}
                />

                <div className="w-full mt-3 flex flex-col gap-2">
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
