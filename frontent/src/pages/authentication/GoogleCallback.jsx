import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        const error = params.get('error')

        if(error == 'blocked'){
            toast.error("You are blocked")
            return navigate('/login')
        }

        navigate("/");
    }, []);

    return <div>Loading...</div>;
};

export default GoogleCallback;
