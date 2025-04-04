import React, { useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GlobalContext } from "../../../index";
import { platformDetails } from "../../platformApi/api";

const MinimizedSidebar = () => {
    const {
        selectedPlatform,
        setSelectedPlatform,
        handleSideBar,
        handlePlatformSelection,
        setPlatformNameToDisplay,
        fetchDataFromDB,
        platformDetailsofUser,
        setPlatformDetailsofUser,
        postDataToDB,
        userInfo
    } = useContext(GlobalContext);

    const location = useLocation();
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/dashboard') {
            buttonRef.current.click();
        }
    }, [location]);

    useEffect(() => {
        const details = userInfo?.userData?.platformDetails.map((dt) => {
            const platformData = platformDetails.find(data => data.platformName === dt.platformName);
            return { ...dt, platformLogo: platformData?.logo };
        });
        setPlatformDetailsofUser(details);
    }, [userInfo]);

    const handleEditPlatforms = () => {
        navigate('/add-platform');
    };

    return (
        <div className="minimizedSideBar flex flex-col gap-10 items-center ">
            <i
                onClick={handleSideBar}
                className="text-4xl fa-solid fa-bars cursor-pointer"
            ></i>

            {/* Profile Icon */}
            <div
                onClick={() => setSelectedPlatform("profile")}
                className={`merge-container flex items-center justify-center 
                    ${selectedPlatform === "profile" ? "bg-[#6A64FD] text-white" : "bg-white text-gray-800"} 
                    cursor-pointer rounded-2xl w-14 h-14 text-3xl shadow-md transition hover:shadow-lg`}
            >
                <i className="text-4xl fa-solid fa-user cursor-pointer"></i>
            </div>

            {/* Overall Stats Icon */}
            <div
                ref={buttonRef}
                onClick={() => {
                    setSelectedPlatform('overall');
                    setPlatformNameToDisplay('Overall Coding Stats');
                    fetchDataFromDB('overall');
                }}
                className={`merge-container flex items-center justify-center 
                    ${selectedPlatform === "overall" ? "bg-[#6A64FD] text-white" : "bg-white text-gray-800"} 
                    cursor-pointer rounded-2xl w-14 h-14 text-3xl shadow-md transition hover:shadow-lg`}
            >
                <i className="fa-solid fa-layer-group"></i>
            </div>

            {/* Individual Platforms */}
            <div className="individualPlatformWrapper w-full mt-4 space-y-3 flex flex-col gap-10">
                {platformDetailsofUser?.map(({ platformName, platformUsername, platformLogo }) => (
                    <div
                        key={`platform${platformName}`}
                        onClick={() => {
                            handlePlatformSelection(platformName);
                            fetchDataFromDB(platformName, platformUsername);
                        }}
                        className={`leetcodeStats flex items-center justify-center p-4 
                            ${selectedPlatform === platformName ? "bg-[#6A64FD] text-white" : "bg-white text-gray-800"} 
                            rounded-xl shadow-md transition hover:shadow-lg`}
                    >
                        <img className="w-7 h-7 bg-white rounded-2xl" src={platformLogo} alt={platformName} />
                        <i
                            onClick={() => postDataToDB(platformName, platformUsername)}
                            className="fa-solid fa-arrows-rotate text-gray-500 hover:text-gray-700 transition ml-2 cursor-pointer"
                        ></i>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MinimizedSidebar;
