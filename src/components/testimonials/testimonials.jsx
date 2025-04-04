import React, { useContext, useEffect, useState } from "react";
import "./testimonials.css";
import image from "../../assets/image.png";
import { GlobalContext } from '../../index'
import { useNavigate } from "react-router-dom";

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const {loggedIn}=useContext(GlobalContext);

  const navigate=useNavigate();
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/feedback/get-validFeedback`);
        const data = await response.json();
        console.log(data.data); 
        setFeedbacks(data.data); 
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedbacks();
  }, []); 

  const handleYouCanBeNext=()=>{
    if(loggedIn){
      navigate('/addFeedback');
    }
    else{
      alert('You are not logged in')
      navigate('/login');
    }
  }

  return (
    <div className="testimonialWrapper flex flex-col items-center w-full">
      <div className="testimonialHead text-4xl mb-4">Testimonials</div>

      
      <div className="testimonialContainer max-w-[90vw] overflow-x-auto">
        <div className="testimonialCards flex gap-4 flex-nowrap p-4">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="testimonialCard flex flex-col items-center gap-5 border rounded-2xl min-w-[300px] h-[200px] p-3"
              >
                <div className="userImg rounded-full border w-16 h-16">
                  <img src={ feedback.profilePic || image } alt={feedback.username} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="testimonialMessage">{feedback.content}</div>
                <div className="userName">- {feedback.username}</div>
              </div>
            ))
          ) : (
            <p>Loading feedback...</p>
          )}
        </div>
      </div>
      <div onClick={handleYouCanBeNext}className="addFeedback relative right-[-40%]  bg-[#6C63FF] text-white hover:bg-white hover:text-[#6C63FF] hover:border-[#6C63FF] font-bold rounded-[8px] px-[8px] py-[15px] border-2 border-transparent cursor-pointer transition-all duration-300 ease-in-out shadow-lg ">You Can Be Next</div>
    </div>
  );
};

export default Testimonials;