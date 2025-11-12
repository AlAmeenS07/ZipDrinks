import React from 'react';
import { User, Package, MapPin, Wallet, Heart, Lock, LogOut, Ticket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axiosInstance from '../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import { logout } from '../Store/user/UserSlice';

export default function UserProfileMain({ children }) {

  const user = useSelector(state => state.user.userData);
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.post(backendurl + '/api/auth/logout');
          if (res.data.success) {
            dispatch(logout());
            toast.success("Logged out successfully");
            navigate('/');
          }
        } catch (error) {
          toast.error('Something went wrong during logout.', error.message);
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          <aside className="w-full lg:w-64 flex-shrink-0 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-black rounded-full overflow-hidden flex items-center justify-center">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{user?.fullname || "User"}</h2>
              </div>
            </div>

            <nav className="space-y-1">
              <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">My Profile</span>
              </Link>

              <Link to="/profile/address" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">My Address</span>
              </Link>

              <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Package className="w-5 h-5" />
                <span className="text-sm font-medium">My Orders</span>
              </Link>

              <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">My Wishlist</span>
              </Link>

              <Link to="/profile/wallet" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Wallet className="w-5 h-5" />
                <span className="text-sm font-medium">My Wallet</span>
              </Link>

              <Link to="/profile/change-password" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Lock className="w-5 h-5" />
                <span className="text-sm font-medium">Change Password</span>
              </Link>

              <Link to="/profile/referral" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Ticket className="w-5 h-5" />
                <span className="text-sm font-medium">Refferal Code</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
