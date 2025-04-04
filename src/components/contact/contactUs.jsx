import React, { useState } from 'react';
import emailjs from "@emailjs/browser"
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }
   const sendEmail = (e) => {
      e.preventDefault();
      console.log(formData)
      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID, // Replace with your EmailJS service ID
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Replace with your EmailJS template ID
          formData,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY // Replace with your EmailJS public key
        )
        .then(
          (response) => {
            console.log("Email sent successfully!", response);
            alert("Email sent successfully!");
          },
          (error) => {
            console.error("Failed to send email:", error);
            alert("Failed to send email. Try again!");
          }
        );
    };
  
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // You can handle form submission here, e.g., sending data to an API
  //   alert('Your message has been submitted!');
  // };

  return (
    <div className="contact-us-container flex justify-center items-center bg-white min-h-screen py-10">
      <div className="contact-form w-[80%] md:w-[50%] lg:w-[40%] bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-black mb-5">Contact Us</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="p-3 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="p-3 border rounded-md"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="4"
            className="p-3 border rounded-md"
            required
          />
          <button
            type="submit"
            onClick={(e)=>sendEmail(e)}
            className="bg-[#6B63FF] text-white p-3 rounded-md mt-4 hover:bg-purple-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;