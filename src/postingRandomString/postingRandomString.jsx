import { useState } from "react";
import loadingGIF from '../assets/ballLoading.gif';

const PostingRandomString = () => {
  const [randomString, setRandomString] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStringPost = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/fetch-random-string");
      const data = await res.json();
      const fetchedString = data.randomString;  // Temporary variable
      setRandomString(fetchedString);

      const today = new Date();
      const hour = today.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).split(" ")[0];
      const meridiem = today.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).split(" ")[1];

      console.log(`Hour: ${hour}, Meridiem: ${meridiem}`);

      if (hour === "7" && meridiem === "PM") {
        console.log("Entering if condition");

        const postUrl = "http://localhost:3000/string/postOrUpdateRandomString";

        const postRes = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stringId: "67e37978e9e70b69e21a4fc4",
            stringToPost: fetchedString, // Use fetched string directly
          }),
        });

        if (postRes.ok) {
          const postData = await postRes.json();
          console.log(postData);
          alert("GFG String Posted Successfully");
        } else {
          alert("Error Posting GFG String");
        }
      }
    } catch (error) {
      console.error("Error fetching or posting data:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleStringPost}
        className="bg-[#df2424] text-white text-2xl pr-6 px-5 py-3 rounded-lg hover:bg-white hover:text-black border-2 hover:border-red-800 hover:text-red-800 flex items-center gap-2"
      >
        {loading ? <img src={loadingGIF} alt="loading" className="w-12 h-12" /> : "Update GFG String"}
      </button>
    </div>
  );
};

export default PostingRandomString;