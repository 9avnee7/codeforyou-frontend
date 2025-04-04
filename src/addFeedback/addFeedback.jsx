import { useState, useContext } from "react";
import { GlobalContext } from '../index';

const AddFeedback = () => {
  const { userInfo } = useContext(GlobalContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMessageChange = (e) => {
    const words = e.target.value;
    console.log(words);
    if (words.length <= 40) {
      setMessage(e.target.value);
    }
  };
  console.log("inside add feedback",userInfo?.userData.profilePic[0].profileURL);
  console.log(userInfo)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError(null);

    try {

      const res = await fetch("http://localhost:3002/api/feedback/post-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userInfo?.userData.username,
          profilePic: userInfo?.userData.profilePic[0].profileURL,
          content:message,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-6">
      <div className="bg-gray-100 p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-[#6C63FF] mb-4 text-center">Add Your Feedback</h2>
        <div className="flex items-center gap-4 mb-4">
          <img src={userInfo?.userData.profilePic[0].profileURL|| "https://wallpaper.forfun.com/fetch/9f/9f7ec92717771b778f66961f58cf1e6e.jpeg" } 
               alt="Profile" 
               className="w-12 h-12 rounded-full border-2 border-[#6C63FF]" />
          <span className="text-lg">{userInfo?.username || "Guest"}</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="w-full p-3 rounded-lg bg-white border border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF] focus:outline-none"
            rows="4"
            placeholder="Write your feedback here... (Max 40 words)"
            value={message}
            onChange={handleMessageChange}
          ></textarea>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-[#6C63FF] text-white py-2 rounded-lg font-medium hover:opacity-80 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFeedback;
