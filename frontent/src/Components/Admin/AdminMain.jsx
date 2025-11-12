
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, ShoppingCart, Package, DollarSign, BarChart3, ChevronDown, Box, Ticket } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { adminOut } from '../../Store/Admin/AdminSlice';
import { toast } from 'react-toastify';
import axiosInstance from '../../Helper/AxiosInstance';


const AdminMain = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  async function handleLogout() {
    try {

      let { data } = await axiosInstance.post(backendUrl + '/api/admin/logout');

      if (data.success) {
        dispatch(adminOut())
        navigate("/admin/login")
        setUserDropdownOpen(!userDropdownOpen)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Box, label: 'Category', path: '/admin/categories' },
    { icon: BarChart3, label: 'Reports', path: '/admin/sales' },
    { icon: Ticket, label: 'Coupons', path: '/admin/coupons' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 ms-4 bg-black text-white font-bold flex items-center justify-center text-sm">
                Zip
              </div>
            </Link>
          </div>

          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">Al Ameen S</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <ChevronDown size={16} className="text-gray-400 hidden md:block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Profile
                </Link>
                <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Settings
                </Link>
                <hr className="my-2 border-gray-200" />
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40">
        <nav className="p-4 space-y-2 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                  ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50' }`}>
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-transperant bg-opacity-50 z-40 top-16" onClick={() => setSidebarOpen(false)} >
          <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} to={item.path} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50' }`}>
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <main className="lg:ml-64 pt-16">
        {children}
      </main>
    </div>
  );
};

export default AdminMain