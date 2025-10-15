import React from 'react'
import { loadingEnd, loginFail, loginStart } from '../Store/user/UserSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Otp from './Otp';
import axiosInstance from '../Helper/AxiosInstance';

const ForgotPasswordOtp = ({setFpOtp , setNewPassword }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;    
    const dispatch = useDispatch()

    async function handleVerify(otp) {
        dispatch(loginStart())
        try {
            let fullOtp = otp.join('')
            let {data} = await axiosInstance.post(backendUrl + '/api/auth/verify-reset-password-otp' , {otp : fullOtp})

            if(data.success){
                toast.success("Verified")
                setFpOtp(false)
                setNewPassword(true)
            }else{
                toast.error("Invalid Otp")
            }
            
        } catch (error) {
            toast.error(error.message)
            dispatch(loginFail())
        }
        finally{
            dispatch(loadingEnd())
        }
    }

    async function resendOtp(){
        try {
            let {data} = await axiosInstance.post(backendUrl + '/api/auth/resend-reset-password-otp' , {},{ headers: { 'Content-Type': 'application/json' }});
            if(data.success){
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <Otp verifyOtp={handleVerify} resendOtp={resendOtp}/>
        </div>
    )
}

export default ForgotPasswordOtp
