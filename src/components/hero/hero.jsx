import { useContext } from "react";
import "./hero.css"; // Importing the CSS file
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../index"; 

const Hero = () => {
    const { loggedIn,setRedirectionPath } = useContext(GlobalContext);  
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (loggedIn) {
            navigate("/dashboard");
            setRedirectionPath('dashboard')
        } else {
            navigate("/login");
            setRedirectionPath('dashboard')
        }
    };
    const handlePremium=()=>{
        setRedirectionPath("premium")
    }

    return (
        <div className="heroWrapper">
            <h1 className="heroTitle">Welcome To CodeForYou 🚀</h1>
            <p className="heroSubtitle">
                A unified platform to track your coding progress across multiple platforms.
                Join us to streamline your coding journey!
            </p>
            <div className="buttonContainer">
                <div onClick={handleGetStarted} className="getStarted">Get Started</div>
                 <Link onClick={handlePremium} className="premium" to="/premium"> Premium 👑</Link>
            </div>
        </div>
    );
};

export default Hero;