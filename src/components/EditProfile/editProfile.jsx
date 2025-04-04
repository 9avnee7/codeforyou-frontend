import React, { useContext, useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { GlobalContext } from "../..";
import Avatar from "react-avatar";

const EditProfile = () => {
    const { userInfo, setUserInfo } = useContext(GlobalContext);
    
    const fetchedData = userInfo?.userData || {};
    const fetchedprofilePic = fetchedData.profilePic?.[0]?.profileURL || '';

    // Define state
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [bioLen, setBioLen] = useState(0);
    const [location, setLocation] = useState('');
    const [linkedln, setLinkedln] = useState('');
    const [github, setGithub] = useState('');
    const [xtwitter, setXtwitter] = useState('');
    const [others, setOthers] = useState('');
    const [education, setEducation] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Update state when userInfo changes
    useEffect(() => {
        setFullName(fetchedData.name || '');
        setBio(fetchedData.userBio || '');
        setBioLen((fetchedData.userBio || '').length);
        setLocation(fetchedData.userLocation || '');
        setLinkedln(fetchedData.linkedlnURL || '');
        setGithub(fetchedData.githubURL || '');
        setXtwitter(fetchedData.xURL || '');
        setOthers(fetchedData.otherURL || '');
        setEducation(fetchedData.userEducation || '');
    }, [userInfo]); // Runs when userInfo updates

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
        }
    };

    const handleSaveUserInfo = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("userDetails", JSON.stringify({
                name: fullName,
                userBio: bio,
                userEducation: education,
                userLocation: location,
                linkedlnURL: linkedln,
                githubURL: github,
                xURL: xtwitter,
                otherURL: others
            }));

            if (profilePic) {
                formData.append("image", profilePic);
            }

            console.log("Sending Data:", formData);

            const response = await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/user/editprofile`, {
                method: 'POST',
                body: formData,
                credentials: "include"
            });

            if (response.ok) {
                const updatedData = await response.json();
                console.log(updatedData, "after json");
                setUserInfo({ userData: updatedData.updatedData });
            } else {
                console.error("Request failed:", response);
                alert("Failed to update profile.");
            }
        } catch (e) {
            console.error("Error:", e);
            alert("Error updating details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold text-center mb-4">Edit Profile</h2>
                
                <form className="space-y-4" onSubmit={handleSaveUserInfo}>
                    {/* Profile Picture Section */}
                    <div className="flex items-center justify-center flex-col">
                        <div className="relative">
                            {profilePic ? (
                                <img src={URL.createObjectURL(profilePic)} className="w-24 h-24 rounded-full" />
                            ) : fetchedprofilePic ? (
                                <img src={fetchedprofilePic} className="w-24 h-24 rounded-full" />
                            ) : (
                                <Avatar name={fullName} round={true} size="70" />
                            )}
                            
                            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow-md">
                                <FaEdit className="text-gray-700" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    {/* Name & Location Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600">Name</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your name" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="block text-gray-600">Location</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Your city, country" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" />
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <label className="block text-gray-600">Education</label>
                        <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Your highest qualification" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" />
                    </div>

                    {/* Social Media Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600">LinkedIn</label>
                            <input type="text" value={linkedln} onChange={(e) => setLinkedln(e.target.value)} placeholder="LinkedIn profile URL" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="block text-gray-600">GitHub</label>
                            <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="GitHub profile URL" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="block text-gray-600">X/Twitter</label>
                            <input type="text" value={xtwitter} onChange={(e) => setXtwitter(e.target.value)} placeholder="X/twitter profile URL" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="block text-gray-600">Others</label>
                            <input type="text" value={others} onChange={(e) => setOthers(e.target.value)} placeholder="Other profile URL" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" />
                        </div>
                    </div>


                    {/* Bio Section */}
                    <div className="relative">
                        <label className="block text-gray-600">Bio</label>
                        <textarea value={bio} maxLength={60} onChange={(e) => { setBio(e.target.value); setBioLen(e.target.value.length); }} placeholder="Write something about yourself (Max 60 characters)" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" rows={3} />
                        <span className="absolute bottom-0 right-0 p-2">{bioLen}/60</span>
                    </div>

                    {/* Save Button */}
                    <button type="submit" className={`w-full text-white py-2 rounded-md transition ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
