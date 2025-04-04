import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import boostProfile from "../../assets/boostProfile.png";
import addPlatform from "../../assets/addPlatforms.png";
import dashboard from "../../assets/Dashboard.png";
import "./about.css";

const images = [
  { url: boostProfile, title: "Boost Your Coding Profile" },
  { url: addPlatform, title: "Add Different Platforms To Your Dashboard" },
  { url: dashboard, title: "Complete Dashboard" },
];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel-container ">

      <div className="carousel-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="carousel-slide"
          >
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].title}
              className="carousel-image"
            />
            <div className="carousel-title">{images[currentIndex].title}</div>
          </motion.div>
        </AnimatePresence>
      </div>


      <button onClick={prevSlide} className="carousel-btn carousel-btn-left">
        <ChevronLeft className="icon" />
      </button>

      <button onClick={nextSlide} className="carousel-btn carousel-btn-right">
        <ChevronRight className="icon" />
      </button>
    </div>
  );
};

export default About;
