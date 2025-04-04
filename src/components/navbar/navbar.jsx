import React, { useContext ,useEffect,useState} from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import logo from "../../assets/logo.png";
import './navbar.css'
import { GlobalContext } from '../..';
import Dashboard from '../Dashboard/Dashboard';
import Avatar from 'react-avatar';
import { FaWindowRestore } from 'react-icons/fa';
// import MobileNavbar from './mobileNavbar';

const Navbar = () => {
  const {loggedIn,setLoggedIn,setAccessToken,setUserInfo,setRedirectionPath,userInfo}=useContext(GlobalContext);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate=useNavigate();
  const [displayNavbar, setdisplayNavbar] = useState()
    const handleNavbarClosing=()=>{
        setdisplayNavbar(!displayNavbar)
    }

  // useEffect(()=>{
  //       setNavB
  // },[window.innerWidth])

  const handleNavBarOpening=()=>{
      setdisplayNavbar(true);
  }
  console.log("window length",window.innerWidth)
  const handleVisitProfile=()=>{
    navigate('/dashboard');
  }
  const navigateToEditProfile=()=>{
    navigate('/edit-profiles')
  }
  const handleShowEditProfile=()=>{
    if(showEditProfile)
    setShowEditProfile(false)
  else 
    setShowEditProfile(true);
  }

  const handleLogout=async()=>{
    await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/user/logout`,{
      method:'POST',
      credentials:"include"
    })
    
    if(userInfo.authProvider==='google'){
    window.google.accounts.id.revoke(userInfo.email,()=>{
      console.log("User Signed out from google")

    })}
    sessionStorage.clear()
    setAccessToken(null)
    setLoggedIn(false);
    navigate('/')
    setUserInfo(null);
  }
  const handleLogin=()=>{
    setRedirectionPath("dashboard")
  }
  console.log(userInfo)
  console.log("profile URL",userInfo?.userData?.profilePic?.[0]?.profileURL)
  const profileURL=userInfo?.userData?.profilePic?.[0]?.profileURL;
  
  return (
    <div className='navbar flex justify-between h-[40px] m-[1%] p-3'>

     {displayNavbar? <div className="absolute w-[50%]  border-2 border-black h-screen bg-black  opacity-80 flex justify-between">
        <div className="navBarLinks border-2 border-black text-2xl text-white flex flex-col gap-10 p-5">
        <ul>
        <li className=''><Link to="/home">Home</Link></li>
        </ul>
        <ul>
        <li><Link to="/about">About</Link></li>
        </ul>
        <ul>
        <li><Link to="/faqs">FAQs</Link></li>
        </ul>
        <ul>
        <li><Link to="/contact">Contact</Link></li>
        </ul>
        {/* <ul>
        <li><Link to="/admin">Admin</Link></li>
        </ul> */}
        </div>
        <div 
            onClick={handleNavbarClosing}
            className="closeNavBar">
        <i className="fa-solid fa-xmark text-white text-4xl"></i>
        </div>
      </div>:null}

    <div className="logo flex items-center">
    <Link to="/"><img src={logo} alt="" className="logo w-[200px]" /></Link>  
    </div>
    <div className="rightNav flex gap-[15%] w-[50%]">
    <div className="navlinks flex justify-between items-center w-[80%] ">
        <ul>
          <li><Link to="/home">Home</Link></li>
        </ul>
        <ul>
          <li><Link to="/about">About</Link></li>
        </ul>
        <ul>
          <li><Link to="/faqs">FAQs</Link></li>
        </ul>
        <ul>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        {/* <ul>
          <li><Link to="/admin">Admin</Link></li>
        </ul> */}
      </div>

      <div 
      onClick={handleNavBarOpening}
      className="mobileViewBar hidden">
        <i className="text-2xl fas fa-bars"></i>
      </div> 
  

    <div className="buttonClass buttons w-[30%] flex justify-evenly items-center">
       { loggedIn ? <div className='flex gap-5'><button className="login" onClick={handleLogout}>Log out</button> 
       {profileURL ? (
  <div className="relative">
    <img
      onClick={handleShowEditProfile}
      src={profileURL}
      alt="Profile"
      className="w-10 h-10 rounded-full cursor-pointer"
    />
    {showEditProfile && (
      <div className="absolute right-[10%] w-[120px] border-2 rounded-2xl p-1 bg-white shadow-md">
        <p
          onClick={navigateToEditProfile}
          className="editProfile text-center cursor-pointer hover:bg-gray-100 p-1 rounded-lg"
        >
          Edit Profile
        </p>
        <div className="w-full border-t border-black my-1"></div>
        <p
          onClick={handleVisitProfile}
          className="visitProfile text-center cursor-pointer hover:bg-gray-100 p-1 rounded-lg"
        >
          Visit Profile
        </p>
      </div>
    )}
  </div>
) : (
  <div className="relative">
    <Avatar
      onClick={handleShowEditProfile}
      name={userInfo?.userData?.username}
      size="32"
      round={true}
      textSizeRatio={1.8}
      maxInitials={2}
      className="cursor-pointer"
    />
    {showEditProfile && (
      <div className="absolute w-[120px] border-2 rounded-2xl p-1 bg-white shadow-md mt-2">
        <p
          onClick={navigateToEditProfile}
          className="editProfile text-center cursor-pointer hover:bg-gray-100 p-1 rounded-lg"
        >
          Edit Profile
        </p>
        <div className="w-full border-t border-black my-1"></div>
        <p
          onClick={handleVisitProfile}
          className="visitProfile text-center cursor-pointer hover:bg-gray-100 p-1 rounded-lg"
        >
          Visit Profile
        </p>
      </div>
    )}
  </div>
)}
       </div>
       :<button className="login"><Link onClick={handleLogin} to="/login">Login</Link></button>}
       { !loggedIn ? <button className="register"><Link to="/register">Register</Link></button> : null}
    </div>

    </div>
    </div>
  )
}

export default Navbar
