import React, { useState, useEffect, useCallback, useContext } from "react";
import { platformDetails } from "../../platformApi/api";
import loadingGif from '../../../assets/loading.gif';
import dualRingGif from '../../../assets/dualring.gif'
import { GlobalContext } from "../../../index";
import './addPlatform.css'
const AddPlatform = () => {
    const [loading, setLoading] = useState({});
    const {postDataToDB,rightPaneLoading,userInfo}=useContext(GlobalContext)
    const [validUsername, setValidUsername] = useState({});
    const [usernames, setUsernames] = useState({}); 

    const [pName, setPName] = useState('');
    const [username, setUsername] = useState('')

    const userPlatformDetails=userInfo?.userData?.platformDetails;

    // console.log('platform detauls here in add platforms',platformDetails)

    // Debounce effect for API call
    useEffect(() => {
        const debounce = setTimeout(() => {
                if(username.trim().length===0){
                    setLoading((prev)=>({...prev,[pName]:false}))
                    setValidUsername((prev) => ({ ...prev, [pName]: '' }));
                }
                if (username.length && pName.length) {
                    handleUsernameChange(username,pName);
                }

        }, 900);

        return () => clearTimeout(debounce);
    }, [username,pName]);

    const handleUsernameChange = async (pUsername, pName) => {
        setLoading((prev) => ({ ...prev, [pName]: true }));

        if (pName.toLowerCase().trim() === "leetcode") {
            try {
                const res = await fetch(`${import.meta.env.VITE_LEETCODE_SCRAP_URL}/scrape/leetcode?username=${pUsername}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    const response = await res.json();
                    const isValid = response?.userPublicProfile?.matchedUser !== null;
                    setValidUsername((prev) => ({ ...prev, [pName]: isValid }));
                    setUsernames((prev)=>({...prev,[pName]:username}))
                } else {
                    setValidUsername((prev) => ({ ...prev, [pName]: false }));
                }
            } catch (error) {
                console.error("API Error:", error);
                setValidUsername((prev) => ({ ...prev, [pName]: false }));
            } finally {
                setLoading((prev) => ({ ...prev, [pName]: false }));
                
            }
        }
        if (pName.toLowerCase().trim() === "geeksforgeeks") {
            try {
                const today=new Date;
                const year=today.getFullYear();
                const handle=username;
                const requestType='getYearwiseUserSubmissions'
                const res = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/api/gfg-user/submission/${year}/${handle}/${requestType}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    
                    setValidUsername((prev) => ({ ...prev, [pName]: true }));
                    setUsernames((prev)=>({...prev,[pName]:username}))
                } else {
                    setValidUsername((prev) => ({ ...prev, [pName]: false }));
                }
            } catch (error) {
                console.error("API Error:", error);
                setValidUsername((prev) => ({ ...prev, [pName]: false }));
            } finally {
                setLoading((prev) => ({ ...prev, [pName]: false }));
                
            }
        }
        if (pName.toLowerCase().trim() ==="coding ninjas") {
            console.log('validating coding ninjas')
            try {
                const res = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/api/ninja-user/${username}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                console.log(res);

                if (res.ok) {
                    
                    setValidUsername((prev) => ({ ...prev, [pName]: true }));
                    setUsernames((prev)=>({...prev,[pName]:username}))
                } else {
                    setValidUsername((prev) => ({ ...prev, [pName]: false }));
                }
            } catch (error) {
                console.error("API Error:", error);
                setValidUsername((prev) => ({ ...prev, [pName]: false }));
            } finally {
                setLoading((prev) => ({ ...prev, [pName]: false }));
                
            }
        }
        if (pName.toLowerCase().trim() ==="codeforces") {
            console.log('validating coding ninjas')
            try {
                const res = await fetch(`${import.meta.env.VITE_CODEFORCES_API_URL}=${username}`);
                console.log(res);

                if (res.ok) {
                    
                    setValidUsername((prev) => ({ ...prev, [pName]: true }));
                    setUsernames((prev)=>({...prev,[pName]:username}))
                } else {
                    setValidUsername((prev) => ({ ...prev, [pName]: false }));
                }
            } catch (error) {
                console.error("API Error:", error);
                setValidUsername((prev) => ({ ...prev, [pName]: false }));
            } finally {
                setLoading((prev) => ({ ...prev, [pName]: false }));
                
            }
        }
    };

    return (
        <div className="addPlatformWrapper w-full flex flex-col justify-center h-screen items-center bg-gray-100 mt-[2%] gap-10">
            <h1 className="text-4xl font-bold text-blue-600">Make Your CodeForYou Dashboard 🚀</h1>
            <div className="addPlatformContainer w-[70%] shadow-md hover:shadow-lg transition bg-white rounded-2xl p-6">
                <div className="platformCards flex flex-col justify-center items-center gap-6">
                    {platformDetails.map(({ platformName,logo, link }, index) => {
                        const platformData=userPlatformDetails.find(data=>data.platformName===platformName);
                        return(
                        <div key={index} className="individualCard flex justify-between items-center w-[90%] bg-gray-50 p-4 rounded-lg shadow-sm">
                            
                            <div className="flex gap-4 items-center w-[30%]">
                                <div className="platformLogo w-10 h-10 rounded-full overflow-hidden">
                                    <img src={logo} alt={platformName} className="w-full h-full object-cover" />
                                </div>
                                <div className="platformName font-medium">{platformName}</div>
                            </div>
                            <div className="urlContainer w-[50%]">
                                <input
                                   defaultValue={platformData?.platformUsername}
                                    placeholder="Enter Respective Username Here"
                                    type="text"
                                    onChange={(e) => {setUsername(e.target.value),setPName(platformName)}}
                                    className="border px-2 py-1 rounded-lg text-black w-full outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {loading[platformName] ? (
                                <img src={loadingGif} className="w-10 h-10" alt="loading" />
                            ) : validUsername[platformName] ? (
                                <i className="fa-solid fa-check-circle text-green-500"></i>
                            ) : validUsername[platformName] === false ? (
                                <i className="fa-solid fa-circle-exclamation text-red-500"></i>
                            ) : null}
                             <button
                            onClick={()=>{setUsername(
                                            prevUsername=>{
                                                const updatedUsername=prevUsername || platformData?.platformUsername;
                                                postDataToDB(platformName,updatedUsername);})}}

                            className="verifyAndUpdateButton bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                {rightPaneLoading[platformName] ? <img src={dualRingGif} className="w-8 h-7  text-white font-bold" alt="loading" />: 'Update' }
                            </button>
                        </div>)
                    }
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddPlatform;
