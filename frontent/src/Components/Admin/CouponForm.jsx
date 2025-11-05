import React, { useState } from 'react';

export default function CouponForm() {
  const [formData, setFormData] = useState({
    couponCode: '',
    discount: '',
    description: '',
    expiryDate: '',
    limit: '',
    minimumPurchase: '',
    active: true,
    maxRedeemablePrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mt-2">Coupons</h1>
          <div className="flex items-center text-sm text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-400">coupons</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Add coupon</h2>
          
          <div className="space-y-6">
            {/* Row 1: Coupon Code & Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32 text-left">
                  Coupon Code
                </label>
                <span className="text-gray-700">:</span>
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32 text-left">
                  Discount
                </label>
                <span className="text-gray-700">:</span>
                <input
                  type="text"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 2: Description & Expiry Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32 text-left">
                  Description
                </label>
                <span className="text-gray-700">:</span>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32 text-left">
                  Expiry Date
                </label>
                <span className="text-gray-700">:</span>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 3: Limit & Minimum Purchase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32 text-left">
                  Limit
                </label>
                <span className="text-gray-700">:</span>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32 text-left">
                  Minimum purchase
                </label>
                <span className="text-gray-700">:</span>
                <input
                  type="number"
                  name="minimumPurchase"
                  value={formData.minimumPurchase}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 4: Active Toggle & Max Redeemable Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32 text-left">
                  Max redeemable price
                </label>
                <span className="text-gray-700">:</span>
                <input
                  type="number"
                  name="maxRedeemablePrice"
                  value={formData.maxRedeemablePrice}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12">
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
            >
              Add Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}