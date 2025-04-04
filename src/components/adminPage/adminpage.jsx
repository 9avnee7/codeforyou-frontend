import { useEffect, useState } from "react";


const AdminPanel = () => {
  const [feedbacks, setFeedbacks] = useState([]);
//   const [change,setChange]=useState(false)

  // Fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/feedback/get-allfeedback`).then((result)=>result.json());
      const data = response.data;
      setFeedbacks(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const markAsValid = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/feedback/update-feedbackstatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isValid: true }),
      });
  
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((fb) =>
          fb._id === id ? { ...fb, isValid: true } : fb
        )
      );
  
    } catch (error) {
      console.error("Error updating feedback status:", error);
    }
  };
  
  const markAsInValid = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/feedback/update-feedbackstatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isValid: false }),
      });
  
      // Update state after API call
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((fb) =>
          fb._id === id ? { ...fb, isValid: false } : fb
        )
      );
  
    } catch (error) {
      console.error("Error updating feedback status:", error);
    }
  };
  
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black pt-[10%]">
      <h1 className="text-3xl font-bold text-[#6C63FF] text-center mb-4">Admin Panel - Feedbacks</h1>
      <div className="max-w-4xl mx-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-[#6C63FF] text-white">
              <th className="p-2">Username</th>
              <th className="p-2">Feedback</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
    
              <tr key={feedback._id} className="border-b border-gray-300">
                <td className="p-2">{feedback.username}</td>
                <td className="p-2">{feedback.content}</td>
                <td className="p-2">
                  {feedback.isValid ?  <button
                      onClick={() => markAsInValid(feedback._id)}
                      className="bg-[#d32525] text-white px-3 py-1 rounded-lg hover:bg-white hover:text-black border-2 hover:border-black"
                    >
                      Mark as Invalid
                    </button>:  <button
                      onClick={() => markAsValid(feedback._id)}
                      className="bg-[#37df24] text-white pr-6 px-3 py-1 rounded-lg hover:bg-white hover:text-black border-2 hover:border-black"
                    >
                      Mark as Valid
                    </button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
    </div>
  );
};

export default AdminPanel;
