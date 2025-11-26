import React, { useState } from 'react'
import { Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useNavigate , NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { logout } from '../Store/user/UserSlice';
import axiosInstance from '../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { clearCart, fetchCart } from '../Store/user/cartSlice';

const Navbar = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropDown, setDropDown] = useState(false)
    const dispatch = useDispatch()
    const isLoggedIn = useSelector(state => state.user.isLoggedIn)
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate()

    const cartCount = useSelector(state => state.cart?.cartData?.items);

    useEffect(()=>{
        dispatch(fetchCart())
    },[dispatch])

    function handleAccountClick() {
        if (!isLoggedIn) {
            navigate("/login")
        } else {
            setDropDown(!dropDown)
        }
    }

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
                        dispatch(clearCart())
                        toast.success("logout Successfully")
                        navigate('/');
                    }
                } catch (error) {
                    console.log(error.message);
                    toast.error('Error!', 'Something went wrong during logout.', error?.response?.data?.message);
                }
                finally{
                    setDropDown(false)
                }
            }
        });
    }

    return (
        <div>
            <div className="border-b bg-gray-50 border-neutral-700 py-2 text-center text-xs sm:text-sm text-black">
                <span className="sm:inline">Get Free delivery for all !</span>
            </div>
            <header className="bg-black text-white">
                <div className="container mx-auto px-4">

                    <div className="flex items-center justify-between py-1 sm:py-2">
                        <div className="flex items-center">
                            <NavLink to="/">
                                <img src="/ZipLogo-New.png" alt="Zip Logo" className='h-10 w-20 m-2' />
                            </NavLink>
                            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
                                <NavLink to="/" className={({ isActive })=> isActive?"text-white hover:text-blue-400 transition text-sm xl:text-base":"text-neutral-400 hover:text-white transition text-sm xl:text-base"}>Home</NavLink>
                                <NavLink to="/shop" className={({ isActive })=> isActive?"text-white hover:text-blue-400 transition text-sm xl:text-base":"text-neutral-400 hover:text-white transition text-sm xl:text-base"}>Shop</NavLink>
                                <NavLink to="/about" className={({ isActive })=> isActive?"text-white hover:text-blue-400 transition text-sm xl:text-base":"text-neutral-400 hover:text-white transition text-sm xl:text-base"}>About</NavLink>
                                <NavLink to="/contact" className={({ isActive })=> isActive?"text-white hover:text-blue-400 transition text-sm xl:text-base":"text-neutral-400 hover:text-white transition text-sm xl:text-base"}>Contact</NavLink>
                            </nav>
                        </div>

                        <div className="flex items-center space-x-3 sm:space-x-6">
                            <Link to={"/wishlist"} className="hidden sm:block text-neutral-400 hover:text-white transition">
                                <Heart size={20} />
                            </Link>
                            <Link to={"/cart"} className="text-neutral-400 hover:text-white transition relative">
                                <ShoppingCart size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount?.reduce((count , item)=> count + item.quantity , 0) || 0}
                                </span>
                            </Link>
                            <button
                                onClick={handleAccountClick}
                                className={`hidden sm:flex items-center justify-center gap-1 px-3 py-1 border border-white rounded-md text-sm transition 
                                ${isLoggedIn
                                        ? 'text-white hover:text-blue-400 hover:border-blue-400'
                                        : 'text-white hover:text-blue-400 hover:border-blue-400'
                                    }`}
                            >
                                {isLoggedIn ? <User size={18} /> : "Login"}
                            </button>

                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-neutral-400 hover:text-white transition">
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="lg:hidden border-t border-neutral-700 py-4 space-y-3">
                            <Link to="/" className="block text-white hover:text-blue-400 transition py-2 px-2">
                                Home
                            </Link>
                            <Link to="/shop" className="block text-neutral-400 hover:text-white transition py-2 px-2">
                                Shop
                            </Link>
                            <Link to="/about" className="block text-neutral-400 hover:text-white transition py-2 px-2">
                                About
                            </Link>
                            <Link to="/contact" className="block text-neutral-400 hover:text-white transition py-2 px-2">
                                Contact
                            </Link>

                            <div className="flex items-center space-x-4 pt-3 border-t border-neutral-700 px-2">
                                <button className="flex items-center space-x-2 text-neutral-400 hover:text-white transition">
                                    <Heart size={20} />
                                    <span className="text-sm">Wishlist</span>
                                </button>
                                <button className="flex items-center space-x-2 text-neutral-400 hover:text-white transition"
                                    onClick={handleAccountClick}>
                                    <User size={20} />
                                    <span className="text-sm">Account</span>
                                </button>
                            </div>
                        </div>
                    )}
                    {dropDown && isLoggedIn && (
                        <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded-lg shadow-lg z-[100] overflow-hidden">
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                                onClick={() => setDropDown(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                to="/orders"
                                className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                                onClick={() => setDropDown(false)}
                            >
                                My Orders
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    )}

                </div>
            </header>
        </div>
    )
}

export default Navbar
