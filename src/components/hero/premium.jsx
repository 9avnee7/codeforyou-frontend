import React from 'react';
import "./premium.css";
import { FaLink, FaMedal, FaFilePdf } from 'react-icons/fa';

const Premium = () => {
  const handlePayment = async (amount) => {
    const res = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/v1/payment/create-order`, {//proxt url
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }), // Amount in INR
    }); 

    const data = await res.json();
    if (!data.success) {
      alert("Payment initiation failed!");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount*100, 
      currency: "INR",
      name: "CodeForYou Premium",
      description: "Unlock premium features",
      order_id: data.orderId,
      handler: function (response) {
        alert("Payment successful! ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: import.meta.env.VITE_RAZORPAY_NAME,
        email: import.meta.env.VITE_RAZORPAY_EMAIL,
        contact: import.meta.env.VITE_RAZORPAY_UPI_ID,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };


  return (
    <div className="premiumWrapper text-black bg-white p-10 flex flex-col items-center pt-20">
      <div className="premiumHead font-bold text-5xl font-mono mb-4 text-[#6C63FF]">Premium</div>
      <p className="desc text-lg text-gray-600 mb-8 text-center">
        Get started with a CodeForYou Premium Subscription that works for you.
      </p>
      <div className="planCards flex gap-8 justify-center items-center">
        {/* Monthly Plan */}
        <div className="monthly border w-[55%] h-[300px] rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
          <div>
            <div className="text-2xl font-semibold">Monthly</div>
            <div className="text-gray-500">Billed monthly</div>
            <p className="text-xl font-bold mt-2 text-[#6C63FF]"> ₹120/month</p>
            <p className="text-gray-500 text-sm">Prices are marked in INR</p>
          </div>
          <button onClick={()=>handlePayment(120)} className="subscribeBtn w-full bg-black text-white py-2 rounded-lg hover:bg-[#6C63FF] transition-colors">
            Subscribe
          </button>
        </div>
        {/* Yearly Plan */}
        <div className="yearly border w-[60%] h-[350px] rounded-2xl p-6 flex flex-col justify-between shadow-lg bg-gray-100 transition-transform transform hover:scale-105 hover:shadow-xl">
          <div>
            <div className="text-2xl font-semibold">Yearly</div>
            <div className="text-gray-500">Billed yearly (₹1080)</div>
            <p className="text-xl font-bold mt-2 text-[#6C63FF]">₹90 /month</p>
            <p className="text-gray-500 text-sm">Saves over 25% compared to monthly</p>
          </div>
          <button onClick={()=>handlePayment(1080)} className="subscribeBtn w-full bg-black text-white py-2 rounded-lg hover:bg-[#6C63FF] transition-colors">
          Subscribe
          </button>
        </div>
      </div>
      {/* Premium Benefits Section */}
      <div className="premiumBenefits mt-10 w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#6C63FF]">Premium Benefits</h2>
        <ul className="text-lg text-gray-700 space-y-6">
          <li className="flex items-start gap-3"><FaLink className="text-[#6C63FF] mt-1"/> 
            <div>
              <span className="font-semibold">Enjoy merging more than 2 URLs</span>
              <p className="text-sm text-gray-600">Merge multiple coding profiles seamlessly. Free users can add up to 2 profiles, but premium users can link unlimited accounts for a complete coding journey overview.</p>
            </div>
          </li>
          <li className="flex items-start gap-3"><FaMedal className="text-[#6C63FF] mt-1"/> 
            <div>
              <span className="font-semibold">Fetch badges from different platforms</span>
              <p className="text-sm text-gray-600">Automatically retrieve and display achievement badges from coding platforms to enhance your portfolio.</p>
            </div>
          </li>
          <li className="flex items-start gap-3"><FaFilePdf className="text-[#6C63FF] mt-1"/> 
            <div>
              <span className="font-semibold">Get a CodeForYou portfolio badge PDF</span>
              <p className="text-sm text-gray-600">Generate a downloadable, ready-to-share PDF summarizing your coding achievements, ideal for resumes and job applications.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Premium;
