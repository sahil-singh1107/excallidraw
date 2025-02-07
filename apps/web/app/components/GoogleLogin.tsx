import {GoogleOAuthProvider,GoogleLogin} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {useRouter} from "next/navigation";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GoogleLoginButton = () => {

    const router = useRouter()

    const handelLogin = async (googleData : any) => {
        const userData = jwtDecode(googleData);
        console.log(userData);
        const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/google/signin`, {
            email : userData.email,
            name : userData.name
        })
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("photourl", userData.picture)
        router.push("/");
    };

    return <button>
        <GoogleOAuthProvider clientId={CLIENT_ID!}>
            <div className="relative group">
                <div className="-inset-0.5 absolute animate-tilt bg-gradient-to-r from-orange-500 via-red-400 to-yellow-400 blur transition duration-1000 rounded-3xl opacity-75 group-hover:opacity-100"></div>
            <div className="rounded-3xl">
            <GoogleLogin shape="pill" theme="filled_black" logo_alignment="center"  onSuccess={(credentialResponse) => {
                handelLogin(credentialResponse.credential)
            }} />
            </div>
            </div>
        </GoogleOAuthProvider>
    </button>
}

export default GoogleLoginButton