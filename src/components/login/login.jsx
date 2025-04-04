import { useContext, useState } from "react";
import { Link ,useNavigate} from 'react-router-dom';
import loginIllustration from "../../assets/undraw_login_wqkt.svg";
import { GlobalContext } from "../..";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const {loggedIn,setLoggedIn,setAccessToken,userInfo,setUserInfo,redirectionPath}=useContext(GlobalContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate();

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
        console.log(response)
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

    const handleLogin = async (e) => {
      e.preventDefault(); 
      try { 
        if(loggedIn){
        alert('you are already logged in');
        navigate('/');
        return;
      }
      console.log("Logging in with:", email, password);
      
      const response = await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/user/loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify({ email, password }),
      });
      console.log(response);
      const data = await response.json();
      if(!response.ok){
        alert('some trouble occured logging you in you are not registered')
        return
    }
      console.log("Server Response:", data.data.accessToken);

      const userDataResponse=await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/user/fetchuserdata`,{
        method:"GET",
        credentials:"include",
        headers:{
          'x-user-id':data.data.userId,
          'Authorization':`Bearer ${data.data.accessToken}`,
          'Content-Type':"application/json"
        }
      });

      
      const userData=await userDataResponse.json();
      console.log("only data on login",userData)
      console.log("userdata on login",userData)
      setUserInfo(userData);
      console.log("user info in login",userInfo)
      setAccessToken(data.accessToken);

      if (response.ok) {
        alert("Login Successful!");
        
      } else {
        alert(data.message || "Login failed. Please try again.");
      }

      localStorage.setItem('loggedInStatus',JSON.stringify(true));
      setLoggedIn(JSON.parse(localStorage.getItem('loggedInStatus')));
      navigate(`/${redirectionPath}`);


    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
        <img src={loginIllustration} alt="Login Illustration" width={250} height={250} className="mb-6" />
        <h2 className="text-[#6C63FF] text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>
        <form className="w-full flex flex-col space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-transform transform focus:scale-105"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 w-full rounded-lg bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition-transform transform focus:scale-105"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600 hover:text-black"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button
            type="submit"
            className="bg-[#6C63FF] text-white py-3 rounded-lg font-semibold tracking-wide hover:bg-[#5548d9] transition-transform transform hover:scale-105 active:scale-95"
          >
            Login
          </button>
        </form>
        <p className="text-gray-600 text-center mt-4 text-sm">
          Don't have an account? <Link to="/register" className="text-[#6C63FF]">Sign Up</Link>
        </p>
        <div className="googleLogin">
        <div 
         onClick={handleGoogleLogin}
          className="signinbutton p-4 mt-4 bg-[#6C63FF] flex items-center justify-evenly gap-2 text-white py-3 rounded-lg font-semibold tracking-wide hover:bg-[#5548d9] transition-transform transform hover:scale-105 active:scale-95">
        <i className="fa-brands fa-google"></i>
        <span>Continue with Google</span>
        </div>
        </div>
      </div>

      
    </div>
  );
}
