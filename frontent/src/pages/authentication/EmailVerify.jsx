import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginFail, loginStart, loginSuccess, otpVerified } from '../../Store/user/UserSlice';
import { useDispatch } from 'react-redux';
import { Loader } from "react-feather"
import Otp from '../../Components/Otp';
import axiosInstance from '../../Helper/AxiosInstance';

const EmailVerify = () => {

    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch()

    async function verifyOtp(otp) {
        try {
            dispatch(loginStart())
            let fullOtp = otp.join("")

            const { data } = await axiosInstance.post(backendUrl + '/api/auth/verify-otp', { otp: fullOtp });

            if (data.success) {
                let user = await axiosInstance.get(backendUrl + '/api/user/data');
                dispatch(loginSuccess(user.data.userData))
                dispatch(otpVerified())
                toast.success("Verified Successfully")
                navigate("/")
            } else {
                toast.error(data.message)
                dispatch(loginFail())
            }

        } catch (error) {
            dispatch(loginFail())
            toast.error(error.message)
        }
    }

    async function resendOtp(){
        try {
            let {data} = await axiosInstance.post(backendUrl + '/api/auth/resend-otp' , {},{ headers: { 'Content-Type': 'application/json' }});
            if(data.success){
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <Otp verifyOtp={verifyOtp} resendOtp={resendOtp} />
        </div>
    )
}

export default EmailVerify
