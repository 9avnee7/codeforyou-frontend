import { motion } from "framer-motion";

import boostImage from "../../assets/undraw_portfolio-update_6bro.svg";
import { useNavigate } from "react-router-dom";


const AddProfile = () => {
    const navigate=useNavigate();
    const handleAddPlatformToGetStarted=()=>{
        navigate('/add-platform');
    }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-center"
          >
            <h1 className="text-4xl font-bold text-gray-800">Boost Your Coding Profile</h1>
            <p className="text-lg text-gray-600 mt-4">
              Register on popular coding platforms and showcase your achievements!
              Track your progress, participate in contests, and improve your skills.
            </p>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="mt-6"
            >
              <img src={boostImage} alt="Boost Profile" width={400} height={300} />
            </motion.div>
            <button 
            onClick={handleAddPlatformToGetStarted}
            className="mt-6 bg-[#6A64FD] text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-white hover:text-[#6A64FD] border-2 hover:border-[#6A64FD] transition-all">
              Add Platforms To Get Started
            </button>
          </motion.div>
        </div>
      );
    
    
}

export default AddProfile
