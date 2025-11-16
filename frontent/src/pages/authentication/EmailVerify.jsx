import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginFail, loginStart, loginSuccess, otpVerified } from '../../Store/user/UserSlice';
import { useDispatch } from 'react-redux';
import { Loader } from "react-feather"
import Otp from '../../Components/Otp';
import axiosInstance from '../../Helper/AxiosInstance';

const EmailVerify = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const email = location.state.email
    const dispatch = useDispatch()

    // useEffect(() => {
    //     async function getUser() {
    //         dispatch(loginStart())
    //         try {

    //             let user = await axiosInstance.get(backendUrl + '/api/user/data')

    //             if (user.data.success) {
    //                 dispatch(loginSuccess(user.data.userData))
    //             }

    //         } catch (error) {
    //             toast.error(error?.response?.data.message)
    //         }
    //         finally {
    //             dispatch(loadingEnd())
    //         }
    //     }
    //     getUser()
    // }, [])

    async function verifyOtp(otp , email) {
        try {
            dispatch(loginStart())
            let fullOtp = otp.join("")

            const { data } = await axiosInstance.post(backendUrl + '/api/auth/verify-otp', { otp: fullOtp , email });

            if (data.success) {
                console.log(data.accessToken)
                dispatch(loginSuccess({userData : data.user} , {accessToken : data.accessToken}))
                dispatch(otpVerified())
                toast.success("Verified Successfully")
                navigate("/")
            } else {
                toast.error(data.message)
                dispatch(loginFail())
            }

        } catch (error) {
            dispatch(loginFail())
            toast.error(error.response.data.message)
        }
    }

    async function resendOtp(email) {
        try {
            let { data } = await axiosInstance.post(backendUrl + '/api/auth/resend-otp', {email}, { headers: { 'Content-Type': 'application/json' } });
            if (data.success) {
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <div>
            <Otp verifyOtp={verifyOtp} resendOtp={resendOtp} email={email} />
        </div>
    )
}

export default EmailVerify
