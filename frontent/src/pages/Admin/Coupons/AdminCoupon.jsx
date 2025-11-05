import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
import AdminMain from '../../../Components/Admin/AdminMain';
import { Link } from 'react-router-dom';

export default function AdminCoupon() {

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [coupons, setCoupons] = useState([
    { code: 'FLAT20', minPurchase: 'Above 1000', limit: 1, discount: '20%OFF', maxRedeemable: 700, active: true, expiryDate: '01/07/2024' },
    { code: 'FLAT50', minPurchase: 'Above 100', limit: 1, discount: '10%OFF', maxRedeemable: 700, active: false, expiryDate: '01/07/2024' },
    { code: 'FLAT50', minPurchase: 'Above 1000', limit: 1, discount: '25%OFF', maxRedeemable: 700, active: true, expiryDate: '01/07/2024' },
    { code: 'FLAT50', minPurchase: 'Above 5000', limit: 1, discount: '35%OFF', maxRedeemable: 700, active: false, expiryDate: '01/07/2024' },
    { code: 'FLAT20', minPurchase: 'Above 1000', limit: 1, discount: '20%OFF', maxRedeemable: 700, active: true, expiryDate: '01/07/2024' },
  ]);

  const toggleCouponStatus = (index) => {
    const newCoupons = [...coupons];
    newCoupons[index].active = !newCoupons[index].active;
    setCoupons(newCoupons);
  };

  const filteredCoupons = coupons.filter(coupon => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE') return coupon.active;
    if (activeFilter === 'INACTIVE') return !coupon.active;
    return true;
  });

  return (
    <AdminMain>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Coupons</h1>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search coupon code..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                    <button
                      onClick={() => {
                        setActiveFilter('ALL');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg ${
                        activeFilter === 'ALL' ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      All Coupons
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter('ACTIVE');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        activeFilter === 'ACTIVE' ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      Active Only
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter('INACTIVE');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 last:rounded-b-lg ${
                        activeFilter === 'INACTIVE' ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      Inactive Only
                    </button>
                  </div>
                )}
              </div>
              <Link to={"/admin/coupons/add-coupon"} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Coupon</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Min purchase</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">limit</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">max redeemable</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Active</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCoupons.map((coupon, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{coupon.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{coupon.minPurchase}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{coupon.limit}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{coupon.discount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{coupon.maxRedeemable}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCouponStatus(index)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          coupon.active ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            coupon.active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      {!coupon.active && (
                        <span className="ml-2 text-xs text-gray-600">INACTIVE</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{coupon.expiryDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredCoupons.map((coupon, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{coupon.code}</h3>
                  <p className="text-sm text-gray-600">{coupon.minPurchase}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="text-gray-600">Discount:</span>
                  <span className="ml-2 font-medium text-gray-900">{coupon.discount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Limit:</span>
                  <span className="ml-2 font-medium text-gray-900">{coupon.limit}</span>
                </div>
                <div>
                  <span className="text-gray-600">Max Redeem:</span>
                  <span className="ml-2 font-medium text-gray-900">{coupon.maxRedeemable}</span>
                </div>
                <div>
                  <span className="text-gray-600">Expiry:</span>
                  <span className="ml-2 font-medium text-gray-900">{coupon.expiryDate}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center gap-2">
                  {!coupon.active && (
                    <span className="text-xs text-gray-600">INACTIVE</span>
                  )}
                  <button
                    onClick={() => toggleCouponStatus(index)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      coupon.active ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        coupon.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
            &lt;
          </button>
          <button className="px-3 py-2 bg-black text-white rounded">1</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">2</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">3</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">4</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">5</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">...</button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
            &gt;
          </button>
        </div>
      </div>
    </div>
    </AdminMain>
  );
}