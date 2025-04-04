import React, { useContext, useEffect,useRef } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import { GlobalContext } from "../../../index";
import { platformDetails } from "../../platformApi/api";
import Avatar from "react-avatar";
import './leftPane.css'

const MaximizedSidebar = () => {
   
    const { selectedPlatform, setSelectedPlatform, handleSideBar,handlePlatformSelection ,setPlatformNameToDisplay,fetchDataFromDB,
      platformDetailsofUser,setPlatformDetailsofUser
      ,postDataToDB,userInfo} = useContext(GlobalContext);
    

    const fetchedData = userInfo?.userData || {};
    const fetchedprofilePic = fetchedData.profilePic?.[0]?.profileURL || '';

    const fullname=fetchedData?.name || '';
    const username=fetchedData?.username || '';
    const bio=fetchedData?.userBio|| '';
    const education=fetchedData?.userEducation || '';
    const userLocation=fetchedData?.userLocation || '';
    const linkedlnURL=fetchedData?.linkedlnURL || '';
    const githubURL=fetchedData?.githubURL || '';
    const otherURL=fetchedData?.otherURL || '';
    const xURL=fetchedData.xURL || '';

    const buttonRef=useRef(null);

    const location=useLocation();

    useEffect(()=>{
      if(location.pathname==='/dashboard')
        buttonRef.current.click();
    },[location])

    const navigate=useNavigate();
    const handleEditPlatforms =()=>{
      navigate('/add-platform')
    }
    console.log("in max sidebar js",userInfo)

    useEffect(()=>{
      const details=userInfo?.userData?.platformDetails.map((dt)=>{
        const platformData=platformDetails.find((data=>data.platformName===dt.platformName));
        return {...dt,platformLogo:platformData.logo}
        }) 
        setPlatformDetailsofUser(details);
        console.log("details",details);

    },[userInfo])
   
    
    console.log('indide sidebat mac',platformDetailsofUser)

    return (
        <div className="leftProfilePane relative flex flex-col h-fit items-center w-[30%]  bg-white rounded-2xl p-5 shadow-lg gap-6 ">
        {/* Profile Summary */}
        <i 
        onClick={handleSideBar}
        className="fa-solid fa-bars absolute right-3 cursor-pointer"></i>

        <div className="profileSummary flex flex-col items-center text-center w-full"

        >
          { fetchedprofilePic? <img src={fetchedprofilePic} alt=""  className="w-42 h-42 rounded-full"/> :<Avatar name={fullname} size="128" round={true} textSizeRatio={1.8} maxInitials={2} />}
          <div className="userName font-bold text-2xl mt-2">{fullname}</div>
          <div className="userUniqueName text-blue-500 font-light">@{username}</div>
          <p className="userBio text-gray-600 text-sm w-[80%] mt-2">
            {bio}
          </p>
          <button className="codeForYouCard border-2 bg-[#6A64FD] text-white border-transparent px-4 py-2 rounded-2xl mt-3 hover:bg-white hover:text-[#6A64FD] hover:border-[#6A64FD] transition shadow-md">
            Get Your Card
          </button>
        </div>

        {/* Social Media Links */}
        <div className="socialMediaLinks flex justify-center items-center gap-5">
          <a href={otherURL} className="text-gray-500 hover:text-blue-600 transition"><i className="fa-solid fa-envelope text-xl"></i></a>
          <a href={linkedlnURL} className="text-gray-500 hover:text-blue-500 transition"><i className="fa-brands fa-linkedin-in text-xl"></i></a>
          <a href={xURL} className="text-gray-500 hover:text-black transition"><i className="fa-brands fa-x-twitter text-xl"></i></a>
          <a href={githubURL} className="text-gray-500 hover:text-gray-800 transition"><i className="fa-brands fa-github text-xl"></i></a>
        </div>

        {/* Personal Information */}
        <div className="personalInfo flex flex-col w-full p-4 rounded-xl bg-gray-50 shadow-md">
          <div className="location flex items-center gap-2 text-gray-700">
            <i className="fa-solid fa-location-dot"></i>
            <p>{userLocation}</p>
          </div>
          <div className="education flex items-center gap-2 text-gray-700 mt-2">
            <i className="fa-solid fa-graduation-cap"></i>
            <p>{education}</p>
          </div>
        </div>

        {/* Platform Stats */}
        <div  
        className="platformWrapper w-full">
          {/* Overall Stats Card */}
          <div 
          ref={buttonRef}
          onClick={()=>{setSelectedPlatform('overall'),setPlatformNameToDisplay('Overall Coding Stats');
            fetchDataFromDB('overall')
          }}
          // onClick={()=>}
          className={`overallstats flex items-center justify-between w-full ${selectedPlatform==='overall' ? "bg-[#6A64FD]":"bg-white" } p-4 rounded-xl shadow-md`}>
            <div className={`seeOverAllDetails text-sm font-semibold  ${selectedPlatform==='overall' ? "text-white":"text-gray-800"} `}>See OverAll Stats</div>
            <div className="refreshOverAllData cursor-pointer flex gap-5 text-gray-500 hover:text-gray-700 transition">
            <i 
            onClick={handleEditPlatforms}
            className={`fa-solid fa-pen-to-square ${selectedPlatform=='overall' ? "text-white":"text-gray-800"}`}></i>
             
            </div>
          </div>

          {/* Individual Platform Stats */}
          <div className="individualPlatformWrapper w-full mt-4 space-y-3">
            { platformDetailsofUser ? platformDetailsofUser.map(({ platformName, platformUsername,platformLogo }, index) => (
              <div 
                key={`platform${platformName}`}
                onClick={()=>{handlePlatformSelection(platformName);
                  {fetchDataFromDB(platformName,platformUsername)}}}
                className={`leetcodeStats flex items-center justify-between p-4  ${selectedPlatform==platformName ? "bg-[#6A64FD]":"bg-white"} rounded-xl shadow-md transition hover:shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  
                  <img className="w-7 h-7 bg-white rounded-2xl" src={platformLogo} alt={platformName} />
                  <div 
                  
                  className={`leetcodeName ${selectedPlatform==platformName ? "text-white":"text-gray-800"} text-gray-800 font-medium`}>{platformName}</div>
                </div>
                <div className="refreshLeetcode flex gap-5 cursor-pointer text-gray-500 hover:text-gray-700 transition">
                {/* <i className={`fa-solid fa-pen-to-square ${selectedPlatform==name ? "text-white":"text-gray-800"}`}></i> */}
                  <i
                  onClick={()=>postDataToDB(platformName,platformUsername)}
                   className={`fa-solid fa-arrows-rotate  ${selectedPlatform==platformName ? "text-white":"text-gray-800"}` }></i>
                </div>    
                </div>
      
            )):null }
          </div>
        </div>
      </div>
    );
};

export default MaximizedSidebar;