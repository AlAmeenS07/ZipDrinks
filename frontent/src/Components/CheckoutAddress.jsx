import { Edit2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutAddress = ({ addresses, selectedAddress, setSelectedAddress , setShowAddressForm , setEditAddress}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
      {addresses?.map((address) => {
        const isSelected = selectedAddress?._id === address?._id;

        return (
          <div
            key={address?._id}
            onClick={() => setSelectedAddress(address)}
            className={`bg-gray-50 border-2 rounded-2xl p-5 sm:p-6 transition-all duration-300 relative cursor-pointer
              ${isSelected ? 'border-blue-500 shadow-md bg-blue-50' : 'border-gray-200 hover:shadow-lg hover:border-purple-400 hover:-translate-y-1'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                  {address?.fullname}
                </h2>
              </div>
              <button

                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                aria-label="Edit address"
                onClick={(e) => {
                    e.stopPropagation()
                    setShowAddressForm(true)
                    setEditAddress({ id : address?._id , address})
                }}
              >
                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>

            <div className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              <p>{address?.address}</p>
              <p>{address?.district}</p>
              <p>Landmark : {address?.landmark}</p>
              <p>Phone : {address?.phone}</p>
              <p>Pincode : {address?.pincode}</p>
              <p className="font-medium">{address?.state}</p>
            </div>

            {isSelected && (
              <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                Selected
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CheckoutAddress
