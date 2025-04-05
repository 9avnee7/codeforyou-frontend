import { useContext, useState } from "react";
import { Link } from "react-router-dom";
// import loginIllustration from "../public/undraw_login_wqkt.svg";/
import registerIllustration from "../../assets/undraw_sign-up_qamz.svg";
import {useNavigate} from 'react-router-dom'
import { GlobalContext } from "../../index";
import { useGoogleLogin } from "@react-oauth/google";

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('')
  const navigate=useNavigate();
  const {setLoggedIn,loggedIn,setAccessToken,setUserInfo}=useContext(GlobalContext);

  const handleGoogleLogin=useGoogleLogin({
    onSuccess:async(tokenResponse)=>{
      if (loggedIn) {
        alert("You are already logged in!");
        return;
    }
      console.log(tokenResponse)
      const fetchUserInfo=await fetch(`${import.meta.env.VITE_GOOGLE_AUTH_API}`,{
        method:'GET',
        headers:{'Authorization':`Bearer ${tokenResponse.access_token}`}
      })
      const userInfo=await fetchUserInfo.json()
      console.log(userInfo);
      
      const username=userInfo.email.split('@')[0];
      console.log(username);
      setEmail(userInfo.email);
      setPassword(userInfo.sub);
      const response = await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/user/googlelogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify({ 
          username,
          name:userInfo.given_name,
           email:userInfo.email,
           googleId:userInfo.googleId,
           profilePic:[
            {
              profileURL:userInfo.picture,
              publicId:""
            }
           ],
           authProvider:'google',
        })
      });
      if(response.ok){
        console.log("response ok")
        const data=await response.json();
        console.log(data);
        setLoggedIn(true);
        setAccessToken(data.token.accessToken);
        setUserInfo({userData:data?.data})
        navigate('/dashboard');
      }

      

      // setLoggedIn(true);
      // setAccessToken(tokenResponse.access_token);
      
    },
    onError:(error)=>{
      console.log('Error occured',error)
    },
    scope:"openid email profile"

  })
  const handleRegister=async(e)=>{
    e.preventDefault();
    console.log("handle register user frontend endpoint hit")
    try{
        const url=`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/user/registerUser`;

        const res=await fetch(url,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          credentials:"include",
          body:JSON.stringify({
            name:fullName,
            username,
            email,
            password
          })
        })
        if(res.ok){
        setLoggedIn(true);
        const data=await res.json();
        setAccessToken(data.data.accessToken);
        setUserInfo({userData:data.userInfo})
        navigate('/dashboard');
        console.log(data);

        }
    }
    catch(e){
      console.log(e);
        alert("error occured while registering the user");
    }
  }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
          <img src={registerIllustration} alt="Register Illustration" width={250} height={250} className="mb-6" />
          <h2 className="text-[#6C63FF] text-2xl font-semibold text-center mb-6">
            Create an Account
          </h2>

          <form className="w-full flex flex-col space-y-4">
          <input
              type="text"
              onChange={(e)=>setFullName(e.target.value)}
              placeholder="Full Name"
              className="p-3 rounded-lg bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-transform transform focus:scale-105"
            />
            <input
              type="text"
              onChange={(e)=>setUsername(e.target.value)}
              placeholder="Username"
              className="p-3 rounded-lg bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-transform transform focus:scale-105"
            />
            <input
              type="email"
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Email"
              className="p-3 rounded-lg bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-transform transform focus:scale-105"
            />
            <input
              type="password"
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Password"
              className="p-3 rounded-lg bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-transform transform focus:scale-105"
            />
            <button
              onClick={(e)=>handleRegister(e)}
              className="bg-[#6C63FF] text-white py-3 rounded-lg font-semibold tracking-wide hover:bg-[#5548d9] transition-transform transform hover:scale-105 active:scale-95"
            >
              Register
            </button>
          </form>
          <p className="text-gray-600 text-center mt-4 text-sm">
            Already have an account? <Link to="/login" className="text-[#6C63FF]">Login</Link>
          </p>
          <div className="googleLogin">
          <div 
         onClick={handleGoogleLogin}
          className="signinbutton p-4 mt-4 bg-[#6C63FF] flex items-center justify-evenly gap-2 text-white py-3 rounded-lg font-semibold tracking-wide hover:bg-[#5548d9] transition-transform transform hover:scale-105 active:scale-95">
        <i className="fa-brands fa-google"></i>
        <span>Continue with Google</span></div>
        </div>
        </div>
      </div>
    );
  }
  