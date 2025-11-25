import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import UserProfileMain from '../../Components/UserProfileMain';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../Helper/AxiosInstance';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../Components/Pagination';

export default function Wallet() {

    const [query, setQuery] = useSearchParams()

    const [currentPage, setCurrentPage] = useState(Number(query.get("page")) || 1)
    const [totalPages, setTotalPages] = useState(1)
    const itemsPerPage = 5

    const [wallet, setWallet] = useState([])

    useEffect(() => {
        setQuery({
            page: currentPage
        })
    }, [currentPage, setQuery])

    useEffect(() => {
        async function getWallet() {
            try {

                const params = {
                    page: currentPage,
                    limit: itemsPerPage
                }

                let { data } = await axiosInstance.get('/api/wallet', { params })

                if (data.success) {
                    setWallet(data.wallet)
                    setCurrentPage(data.currentPage)
                    setTotalPages(data.totalPages)
                }
                else {
                    toast.error(data.message)
                }

            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
        getWallet()
    }, [currentPage])

    return (
        <UserProfileMain>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <span className="hover:text-gray-900 cursor-pointer">profile</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="hover:text-gray-900 cursor-pointer">wallet</span>
                        <ChevronRight className="w-4 h-4" />
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10">
                        {/* Header */}
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
                            My Wallet
                        </h1>

                        {/* Balance Card */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                            <p className="text-base md:text-lg text-gray-700">
                                Available wallet balance : <span className="font-semibold">₹ {wallet[0]?.balance?.toFixed(2) || 0}</span>
                            </p>
                        </div>

                        {/* Transaction Table */}
                        <div className="overflow-x-auto mb-8">
                            <div className="min-w-full inline-block align-middle">
                                {/* Table Header */}
                                <div className="bg-gray-200 rounded-lg grid grid-cols-5 gap-4 p-4 mb-2 text-sm font-medium text-gray-700">
                                    <div>Transaction ID</div>
                                    <div>Transaction Date</div>
                                    <div>Amount</div>
                                    <div>Description</div>
                                    <div>Debit / Credit</div>
                                </div>

                                {/* Table Rows */}
                                <div className="space-y-1">
                                    {wallet?.map((w, index) => (
                                        <div
                                            key={index}
                                            className="bg-white hover:bg-gray-50 rounded-lg grid grid-cols-5 gap-4 p-4 text-sm border border-gray-100 transition-colors"
                                        >
                                            <div className="text-gray-700">{w?.payments?.transactionId || ""}</div>
                                            <div className="text-gray-700">{new Date(w?.payments?.time).toLocaleDateString()}</div>
                                            <div className="text-gray-700">{w?.payments?.amount}</div>
                                            <div className="text-gray-700">{w?.payments?.description}</div>
                                            <div className={w?.payments?.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                                {w?.payments?.type === 'credit' ? 'Amount Credited' : 'Amount Debited'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
                        </div>
                    </div>
                </div>
            </div>
        </UserProfileMain>
    );
}