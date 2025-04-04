import React ,{use, useContext, useEffect, useState} from "react";
// import { LineChart, Line } from 'recharts';
import './Dashboard.css'
import MinimizedSidebar from "./leftPaneDashboard/minimizedSidebar";
import MaximizedSidebar from "./leftPaneDashboard/maximisedSidebar";
import { GlobalContext } from '../../index';
import RightPane from "./rightPaneDashboard/rightPane";
// import { fetchDataFromDB } from "../platformApi/api";
// import ReactTooltip from "react-tooltip";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const {loggedIn, sideBar, setSideBar,data} = useContext(GlobalContext);
  const navigate=useNavigate();

  // fetchDataFromDB();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 869) {
      setSideBar(true);
    } else {
      setSideBar(false);
    }
  }, [windowWidth, setSideBar]);


  //getting data for ihere to code
  console.log(data);

  return (
    <div className="dashboardWrapper mt-5 flex w-full h-fit bg-gray-100 p-5 gap-5">
   
      {/* Left Profile Panel */}
      { !sideBar? <MaximizedSidebar className="w-[30%]"/>:<MinimizedSidebar/>
      }
      <RightPane />
    
</div>
  );
};

export default Dashboard;