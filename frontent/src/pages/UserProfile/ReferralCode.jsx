import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import UserProfileMain from '../../Components/UserProfileMain';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function ReferralCode() {
    const [copied, setCopied] = useState(false);
    const referralCode = useSelector(state => state.user?.userData?.referralCode)

    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <UserProfileMain>
            <nav className="text-sm text-gray-500 mb-4" aria-label="breadcrumb">
                <ol className="list-reset flex">
                    <li>
                        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
                    </li>
                    <li><span className="mx-2">/</span></li>
                    <li>
                        <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
                    </li>
                    <li><span className="mx-2">/</span></li>
                    <li className="text-gray-700">Referral Code</li>
                </ol>
            </nav>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                        {/* Header */}
                        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
                            My Referral Code
                        </h1>

                        {/* Card Container */}
                        <div className="border-4 border-gray-900 rounded-2xl p-6 md:p-8">
                            {/* Instructions Text */}
                            <p className="text-sm md:text-base text-gray-600 text-center mb-6 leading-relaxed">
                                "Invite your friends and earn rewards! Share your unique referral code
                                to get ₹100 credited to your wallet when they join, and your friend receives ₹50 too.
                                Spread the referral code and start earning together!"
                            </p>

                            {/* Code Display Box */}
                            <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 md:p-8 flex items-center justify-between group hover:shadow-2xl transition-shadow duration-300">
                                <div className="flex-1 text-center">
                                    <p className="text-white text-2xl md:text-3xl font-bold tracking-widest">
                                        {referralCode}
                                    </p>
                                </div>

                                {/* Copy Button */}
                                <button
                                    onClick={handleCopy}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                                    aria-label="Copy referral code"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {/* Copied Notification */}
                            {copied && (
                                <p className="text-green-600 text-center mt-4 text-sm font-medium animate-pulse">
                                    ✓ Copied to clipboard!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserProfileMain>
    );
}