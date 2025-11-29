import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import CheckoutAddress from '../../Components/CheckoutAddress';
import AddressForm from '../../Components/AddressForm';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, X } from 'lucide-react';
import { fetchCart } from '../../Store/user/cartSlice';
import Swal from 'sweetalert2';

const Checkout = () => {
  const cart = useSelector(state => state.cart.cartData);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [couponModal, setCouponModal] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [subTotal, setSubTotal] = useState(cart?.totalAmount || 0)
  const [couponAmount, setCouponAmount] = useState(0)

  const [coupons, setCoupons] = useState([])

  const taxRate = 0.18;
  let taxAmount = Number(Math.round((subTotal) * taxRate).toFixed(2));
  let totalAmount = Number((subTotal + taxAmount).toFixed(2));

  useEffect(() => {
    async function getUserCoupons() {
      try {

        const { data } = await axiosInstance.get('/api/coupons')

        if (data.success) {
          setCoupons(data.coupons)
        }
        else {
          toast.error(data.message)
        }

      } catch (error) {
        toast.error(error.response.data.message)
      }
    }
    getUserCoupons()
  }, [])

  async function getUserAddress() {
    try {
      const { data } = await axiosInstance.get('/api/user/address');
      if (data.success) {
        setAddresses(data.address);
        setSelectedAddress(data.address[0]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    getUserAddress();
  }, []);

  async function addressSubmit(data) {
    data.phone = `+91 ${data.phone}`;

    try {
      let res;
      if (!editAddress) {
        res = await axiosInstance.post('/api/user/address', data);
      } else {
        res = await axiosInstance.put(`/api/user/address/${editAddress.id}`, data);
      }

      if (res.data.success) {
        toast.success(
          editAddress ? 'Address updated successfully' : 'Address added successfully'
        );
        await getUserAddress();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setShowAddressForm(false);
      setEditAddress(null);
    }
  }

  async function placeOrder() {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!selectedAddress) {
      toast.error("Select an Address");
      return;
    }

    const orderData = {
      address: {
        fullname: selectedAddress.fullname,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        district: selectedAddress.district,
        state: selectedAddress.state,
        landmark: selectedAddress.landmark,
        pincode: selectedAddress.pincode
      },
      products: cart?.items.map((item) => {
        let productVariant = item.productId.variants.find(v => v.sku == item.sku);
        return {
          ...item,
          price: productVariant.price,
          salePrice: productVariant.salePrice,
          category: item.productId.category,
          size: productVariant.size,
          appliedOffer: item.productId.appliedOffer,
          name: item.productId.name,
          coverImage: item.productId.coverImage,
          productId: item.productId._id
        };
      }),
      couponAmount: couponAmount || 0,
      couponId: selectedCoupon?._id || "",
      subTotal,
      taxAmount,
      totalAmount,
      paymentMethod,
    };

    setLoading(true)
    try {
      // COD FLOW 
      if (paymentMethod === "COD" || paymentMethod === "Wallet") {
        const { data } = await axiosInstance.post('/api/order/place-order', orderData);
        if (data.success) {
          toast.success("Order Successful");
          dispatch(fetchCart());
          navigate("/order-success", { state: { fromCheckout: true } });
        } else {
          toast.error(data.message);
        }
        return;
      }

      // RAZORPAY FLOW 
      if (paymentMethod === "Razorpay") {
        const { data } = await axiosInstance.post("/api/order/place-order", orderData);

        if (!data.success) {
          toast.error(data.message);
          return;
        }

        const { razorpayOrder, key, orderId } = data;

        const options = {
          key,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: "Zip Drinks",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (response) {
            setLoading(true)
            try {
              const verifyData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
                userId: cart?.userId,
                address: orderData.address,
                products: orderData.products,
                subTotal,
                taxAmount,
                totalAmount,
                couponId: selectedCoupon?._id || "",
                couponAmount: couponAmount || 0,
              };

              const verifyRes = await axiosInstance.post("/api/order/verify-payment", verifyData);

              if (verifyRes.data.success) {
                toast.success("Payment Successful");
                dispatch(fetchCart());
                navigate("/order-success", { state: { fromCheckout: true } });
              } else {
                toast.error("Payment verification failed");
              }
            } catch (err) {
              toast.error(err.response.data.message || "Payment verification failed");
            }
            finally{
              setLoading(false)
            }
          },
          prefill: {
            name: selectedAddress.fullname,
            email: cart?.user?.email || "",
            contact: selectedAddress.phone,
          },
          theme: {
            color: "#000000",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on("payment.failed", function (response) {
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            html: `${response?.error?.description || "Payment verification failed!"}
                  <br/><br/>
                  <strong>Or choose another payment method</strong>`,
            confirmButtonColor: "#000",
          });
        });
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: error?.response?.data?.message,
        confirmButtonColor: "#000",
      });
    }
    finally {
      setLoading(false)
    }
  }


  async function applyCoupon(coupon) {
    try {

      const { data } = await axiosInstance.post('/api/coupons', { couponId: coupon?._id, ...cart })

      if (data.success) {
        toast.success("Couopon applied")
        setSelectedCoupon(coupon)
        setCouponModal(false)
        setSubTotal(cart?.totalAmount - data.couponDiscount)
        setCouponAmount(data.couponDiscount)
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-3xl p-6 border-2 border-blue-400 shadow-sm">
            <div className="bg-gray-100 rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-600 mb-3">
                Order summary - {cart?.items?.length} items
              </p>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  {cart?.items?.map(item => (
                    <img
                      key={item.productId._id}
                      src={item?.productId.coverImage}
                      alt="Product"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <span className="text-lg font-bold ml-auto">₹ {subTotal}</span>
              </div>

              {selectedCoupon ? (
                <div
                  className="bg-green-700 rounded-lg p-4 text-white relative overflow-hidden"
                >
                  {/* Decorative circles */}
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
                  <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>

                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{selectedCoupon?.couponCode}</h3>
                      <p className="text-sm text-gray-300 mb-1">{selectedCoupon?.description}</p>
                      <span className="text-xs text-white">
                        Discount: {selectedCoupon?.discount}
                      </span>&nbsp; <span className='text-xs'>Upto ₹ {selectedCoupon?.maxRedeem}</span>
                      <p className="text-xs text-white">
                        Minimum Purchase: {selectedCoupon?.minPurchase}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCoupon(null)
                        setSubTotal(cart.totalAmount)
                        setCouponAmount(0)
                      }}
                      className={`ml-4 px-6 py-2 rounded font-semibold transition-colors bg-red-500 text-white`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
                : (
                  <button className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800"
                    onClick={() => setCouponModal(true)}>
                    Apply Coupon
                  </button>
                )}
            </div>

            <div className="bg-black rounded-2xl p-12 flex items-center justify-center">
              <img src="/ZipLogo-New.png" alt="Zip Logo" className="h-10 w-20 m-2" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold mb-4 uppercase">Choose Delivery Point</h3>

            <div className="grid grid-cols-1 gap-3 mb-4">
              <CheckoutAddress
                addresses={addresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                setShowAddressForm={setShowAddressForm}
                setEditAddress={setEditAddress}
              />

              <div
                className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition"
                onClick={() => setShowAddressForm(true)}
              >
                <span className="text-sm text-gray-500 font-medium">Add new Address</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold mb-2">Payment Methods</h3>
            <p className="text-lg text-gray-500 mb-4">Select any payment method</p>

            <div className="space-y-2.5">
              {['Razorpay', 'COD', 'Wallet'].map(method => (
                <label key={method} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    className="w-4 h-4"
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-md">
                    {method === 'COD' ? 'Cash on Delivery' : method}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              {cart?.items?.map(product => (
                <div
                  key={product?.productId?._id}
                  className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product?.productId?.coverImage}
                      alt={product?.sku}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-800 leading-tight mb-1">
                        {product?.sku}
                      </p>
                      <p className="text-xs text-gray-500">Quantity: {product?.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">₹ {product?.subTotal}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹ {subTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">₹ {taxAmount}</span>
                </div>
                {couponAmount ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="font-medium">₹ {couponAmount}</span>
                  </div>
                ) : ""}
                <div className="flex justify-between text-base font-semibold pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className={`w-full bg-black text-white py-3.5 rounded-lg font-semibold transition mt-6 text-sm flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
                  }`}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-4 h-4" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
              onClick={() => {
                setShowAddressForm(false);
                setEditAddress(null);
              }}
            >
              &times;
            </button>

            <AddressForm
              addressSubmit={addressSubmit}
              address={editAddress?.address}
              checkout={true}
            />
          </div>
        </div>
      )}

      {couponModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Enter Coupon</h2>
              <button
                onClick={() => setCouponModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <h5 className='px-6 py-2'><span className='text-red-500'>NOTE</span> : In case of RETURN or CANCEL coupon discount may deducted !</h5>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">

              {/* Available Coupons List */}
              <div className="space-y-3">
                {coupons?.length ? (
                  coupons.map((coupon) => (
                    <div
                      key={coupon?._id}
                      className="bg-gray-700 rounded-lg p-4 text-white relative overflow-hidden"
                    >
                      {/* Decorative circles */}
                      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
                      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>

                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{coupon?.couponCode}</h3>
                          <p className="text-sm text-gray-300 mb-1">{coupon?.description}</p>
                          <span className="text-xs text-white">
                            Discount: {coupon?.discount}
                          </span>&nbsp; <span className='text-xs'>Upto ₹ {coupon?.maxRedeem}</span>
                          <p className="text-xs text-white">
                            Minimum Purchase: {coupon?.minPurchase}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            applyCoupon(coupon)
                          }}
                          className={`ml-4 px-6 py-2 rounded font-semibold transition-colors ${selectedCoupon?._id === coupon?._id
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-800 hover:bg-gray-100'
                            }`}
                        >
                          {selectedCoupon?._id === coupon?._id ? 'APPLIED' : 'APPLY'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm">No available coupons.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
