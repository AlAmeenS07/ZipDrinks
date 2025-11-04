import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import CheckoutAddress from '../../Components/CheckoutAddress';
import AddressForm from '../../Components/AddressForm';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { fetchCart } from '../../Store/user/cartSlice';

const Checkout = () => {
  const cart = useSelector(state => state.cart.cartData);
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const taxRate = 0.18;
  const subTotal = cart?.totalAmount || 0;
  const deliveryFee = subTotal < 100 ? 70 : 0;
  const taxAmount = Number(Math.round((subTotal + deliveryFee) * taxRate).toFixed(2));
  const totalAmount = Number((subTotal + deliveryFee + taxAmount).toFixed(2));

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
      toast.error(error.message);
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
      toast.error(error.message);
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

    if(!selectedAddress){
      toast.error("Select an Address")
      return
    }

    const orderData = {
      address: {fullname : selectedAddress.fullname , 
                phone : selectedAddress.phone , 
                address : selectedAddress.address ,
                district : selectedAddress.district,
                state : selectedAddress.state,
                landmark : selectedAddress.landmark , 
                pincode : selectedAddress.pincode },
      products: cart?.items.map((item)=>{
        let productVariant = item.productId.variants.find(v => v.sku == item.sku)
        return {...item , price : productVariant.price , salePrice : productVariant.salePrice , category : item.productId.category , 
                size : productVariant.size , appliedOffer : item.productId.appliedOffer , name : item.productId.name , 
                coverImage : item.productId.coverImage , productId : item.productId._id }
      }),
      subTotal : subTotal,
      deliveryFee : deliveryFee,
      taxAmount : taxAmount,
      totalAmount : totalAmount,
      paymentMethod,
    };

    try {
        let {data} = await axiosInstance.post('/api/order/place-order' , orderData)

        if(data.success){
            toast.success("Order Successfull")
            dispatch(fetchCart())
            navigate("/order-success", { state: { fromCheckout: true } });
        }
        else{
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error?.response?.data.message)
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

              <button className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800">
                Apply Coupon
              </button>
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
                  <span className="font-medium">₹ {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">₹ {taxAmount}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="w-full bg-black text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition mt-6 text-sm"
                onClick={placeOrder}
              >
                Place Order
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
    </div>
  );
};

export default Checkout;
