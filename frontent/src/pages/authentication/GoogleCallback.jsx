import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux"
import { loginSuccess } from "../../Store/user/UserSlice";

const GoogleCallback = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch()

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        const error = params.get('error')
        const accessToken = params.get('accessToken')
        const fullname = params.get('fullname')
        const email = params.get('email')

        if(error == 'blocked'){
            toast.error("You are blocked")
            return navigate('/login')
        }

        if(accessToken){
            dispatch(loginSuccess({userData : {fullname , email} , accessToken}))
        }

        navigate("/");
    }, []);

    return <div>Loading...</div>;
};

export default GoogleCallback;
