import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import UserProfileMain from '../../Components/UserProfileMain'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'

const Profile = () => {
    const user = useSelector(state => state.user?.userData)

    useEffect(()=>{
        
    },[user])

    return (
        <UserProfileMain>
            <nav className="text-sm text-gray-500 mb-4" aria-label="breadcrumb">
                <ol className="list-reset flex">
                    <li>
                        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
                    </li>
                    <li><span className="mx-2">/</span></li>
                    <li className="text-gray-700">Profile</li>
                </ol>
            </nav>

            <div className="relative w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">

                <h2 className="relative text-center text-2xl font-semibold text-gray-900 mb-6 z-10">
                    Welcome {user?.fullname} !
                </h2>


                <div className="mx-auto w-24 h-24 bg-black rounded-full overflow-hidden flex justify-center items-center mb-10 z-10 relative">
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-16 h-16 text-white" />
                    )}
                </div>


                <div className="space-y-6 w-full">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                            {user?.fullname || 'N/A'}
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                            {user?.email || 'N/A'}
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                        </label>
                        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                            {user?.phone || 'N/A'}
                        </div>
                    </div>

                    <div className="pt-6">
                        <Link to={"/profile/edit"} className="block w-full bg-black text-center text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
                            EDIT
                        </Link>
                    </div>
                </div>
            </div>
        </UserProfileMain>
    )
}

export default Profile
