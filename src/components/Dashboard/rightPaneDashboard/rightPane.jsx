import React ,{useContext, useEffect, useState} from "react";

import {platformDetails} from "../../platformApi/api";
import CalendarHeatmap from "react-calendar-heatmap";
import {subDays} from "date-fns"
import {Chart as ChartJS, plugins} from "chart.js/auto";
import { Doughnut,Bar } from "react-chartjs-2";
import { GlobalContext } from "../../../index";
import './rightPane.css'
import BarchartComponent from "../../charts/barChart";
import AddProfile from "../../addProfile/addProfile";
import ApexChart from "../../contestChart/contestAreaChart";

const RightPane = () => {

    const {platformNameToDisplay,badges,submissionCalendar,currentStreak,longestStreak,totalSubmission,totalActiveDays,
        difficultyWiseAnalysis,languageWiseAnalysis,setTotalSubmission,codechefContestDetails,codeforcesContestDetails,rightPaneLoading,userInfo,totalProblemsSolved
    }=useContext(GlobalContext)

    
    console.log(typeof(badges));

  
    
    useEffect(()=>{
        if(badges.length>0){
          const badgesToDisplay=badges.slice(0,4);
          // console.log('object:=?',badges.slice(0,4).length);
            setBadgesToFetch(badgesToDisplay)
}
    },[badges])
    
    // console.log(badgesToDisplay)
    // console.log("badges to display ",badgesToDisplay)
    // const [selectedPlatform,setSelectedPlatform]=useState('overall');
    // const [sideBar,setSideBar]=useState(true);
    // const [submissionCalendar, setSubmissionCalendar] = useState([]);
    const [badgesToFetch ,setBadgesToFetch]=useState([]);
    const [loadContent,setLoadContent]=useState(false);
    const today=new Date();
    const getClassForValue = (value) => {
        // console.log(value)
        if (!value || value.count === 0) return "fill-gray-200";
        if (value.count <= 2) return "fill-green-200";
        if (value.count <= 4) return "fill-green-300";
        if (value.count <= 6) return "fill-green-400";
        if (value.count <= 10) return "fill-green-500";

        return "fill-green-600";
    };
    
    
    // setTotalSubmission(submissionCalendar.length);
    const displayAllBadges=()=>{
            setBadgesToFetch(badges);
            setLoadContent(true)
    }
    const displayLessBadges=()=>{
        setBadgesToFetch(badges.slice(0,4));
            setLoadContent(false)
    }

   

  

    // pie chart data -----------data -----------data -----------data -----------
    const difficultyLabel=[];
    const difficultyData=[];
    // console.log('in righ pane')
    console.log(difficultyWiseAnalysis);
    difficultyWiseAnalysis.forEach((data) => {
    if(data.QCategory.toLowerCase()!=='all'){
      difficultyLabel.push(data.QCategory),
      difficultyData.push(data.QCounts);}
});
console.log('difficulty label',difficultyLabel,difficultyData)
    const data = {
      labels: difficultyLabel,
      datasets: [
        {
          data:difficultyData,
          backgroundColor: ["#22C55E", "#FACC15", "#EF4444","#6A64FD"],
          hoverOffset: 4,
        },
      ],
    };
    const options = {
      cutout: "80%", // Adjust hole size
      rotation: -90, // Start from top
      hoverOffset: 30, // Expands section on hover
    };

    const label=[];
    const newData=[];

    console.log(languageWiseAnalysis)
    languageWiseAnalysis.map((value)=>{
        // console.log(value)
        label.push(value.languageName);
        if(value?.problemsSolved)
        newData.push(value.problemsSolved);

    })


    const languageData = {
        labels: label,
        datasets: [
          {
            data:newData,
            backgroundColor: ["#22C55E", "#FACC15", "#EF4444",'#6A64FD'],
            hoverOffset: 4,
          },
        ],
      };
      const languageOptions = {
        cutout: "80%", // Adjust hole size
        rotation: -90, // Start from top
        hoverOffset: 30, // Expands section on hover
        plugins: {
          legend: {
            display: false // Hides the legend
          }}
      };

     // bar chart data -----------data -----------data -----------data -----------
    
    let totalProblems =0;
    difficultyData.map((num)=>
      totalProblems+=num
  )
  // if(platformNameToDisplay.toLowerCase()==='leetcode'){
  //   totalProblems-=difficultyData[0];
  // }

  console.log("inside rightpane",userInfo);
  return (
    <div className="w-full h-fit">

     { (!rightPaneLoading && userInfo?.userData?.platformDetails?.length>0) ? (
       <div className="rightCodingStats w-full flex flex-col bg-gray-100 rounded-2xl shadow-md transition hover:shadow-lg p-5 gap-5 ">
        <h2 className="text-xl font-semibold text-gray-700">{platformNameToDisplay}</h2>

        {/* Add coding stats content here */}
    <div className="firstRow flex gap-5">
    {/* Total Problems Solved */}
    <div className="firstRowFirstComponent flex gap-5 ">
    <div className="displayTotalQuestions w-[50%] shadow-md transition hover:shadow-lg p-6 rounded-lg bg-white relative">
        {/* Info Icon */}
        <div className="absolute top-2 right-2 group">
            <i className="fa-solid fa-circle-info text-gray-500 cursor-pointer"></i>
            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg p-2 w-40 right-0 mt-1">
                Total problems solved across platforms.
            </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
            <div className="statHeading text-xl font-bold">Total Problems Solved</div>
            <div className="statValue text-4xl font-extrabold">{totalProblemsSolved}</div>
        </div>
    </div>

    {/* Total Active Days */}
    <div className="displayTotalActiveDays w-[50%] shadow-md transition hover:shadow-lg p-6 rounded-lg bg-white relative">
        {/* Info Icon */}
        <div className="absolute top-2 right-2 group">
            <i className="fa-solid fa-circle-info text-gray-500 cursor-pointer"></i>
            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg p-2 w-40 right-0 mt-1">
                Days you have coded at least once.
            </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
            <div className="statHeading text-xl font-bold">Total Active Days</div>
            <div className="statValue text-4xl font-extrabold">{totalActiveDays}</div>
        </div>
    </div>
    </div>

    {/* Submission Stats */}
    <div className="displaySubmissionStats w-[70%] shadow-md transition hover:shadow-lg p-6 rounded-lg bg-white relative">
        {/* Info Icon */}
        <div className="absolute top-2 right-2 group">
            <i className="fa-solid fa-circle-info text-gray-500 cursor-pointer"></i>
            <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg p-2 w-40 right-0 mt-1">
                Your submission stats and streak info.
            </div>
        </div>

        <div className="flex items-center justify-evenly">
            <div className="totalSubmission text-[15px] font-bold">
                {totalSubmission} 
            </div>
            <div className="largestStreak text-[15px]">
                Max. Streak: <span className="font-extrabold">{longestStreak}</span>
            </div>
            <div className="currentStreak text-[15px]">
                Current Streak: <span className="font-extrabold">{currentStreak}</span>
            </div>

        </div>
        <CalendarHeatmap
            startDate={subDays(today,365)}
            endDate={today}
            values={submissionCalendar} 
            classForValue={getClassForValue}
            gutterSize={4}
            // showWeekdayLabels
           
            />
    </div>
</div>

{/* second row ---------------------------------------------------------------------------------------------------------------------------------- */}
<div className="secondRow flex gap-5">
  
  {badges.length > 0 ?<section className="awardsSection shadow-md hover:shadow-lg transition rounded-md bg-white w-[50%] flex justify-center flex-col items-center ">
    <h2 className="awardHeading text-2xl text-bold p-5">Awards({badges.length})</h2>
   
<br />
<div className="superAwardsWrapper flex flex-col w-[90%] justify-center items-center">
<div className={`awardsWrapper grid ${badges.length === 1 ? "grid-cols-1" : 
                                        badges.length === 2 ? "grid-cols-2" : 
                                        badges.length === 3 ? "grid-cols-3" : 
                                        "grid-cols-4"} 
               gap-4 w-[95%] max-h-[200px] overflow-y-auto overflow-x-hidden`}>
      {badges.length > 0 ? (  
        badgesToFetch.map(({ badgeLink, badgeDate, badgeName }, index) => (
          <div key={index} className="individualAward flex flex-col justify-center items-center">
            <img src={badgeLink} alt={`${badgeName} badge`} className="w-[70%]" loading="lazy" />
            <div className="badgeInfo flex flex-col justify-center items-center text-center w-[30%] text-[10px]">
              <p className="badgeName ">{badgeName}</p>
              {badgeDate ? <div className="badgeDate ">{badgeDate.split('T')[0]}</div>: null}
            </div>
          </div>
        ))
      ) : (
        <p className="noAwards ">No awards earned yet.</p>
      )}

    </div>
     {  badges.length>4 ? !loadContent? <div onClick={displayAllBadges} className="seemore text-[15px] font-light">see more...</div> :<div onClick={displayLessBadges} className="seeless text-[15px] font-light">see less...</div>:null}
    </div>
  </section>:null }

  <section className="problemsStats shadow-md hover:shadow-lg transition rounded-md bg-white w-[50%] flex justify-center flex-col items-center">
      <div className="doughnutContainer relative flex  w-[100%] justify-center items-center text-center" >
        <div className="questionDoughnut">
        <Doughnut data={data} options={options} />
        </div>
          <div className="languageDoughnut absolute w-[30%] pt-5">
          <Doughnut data={languageData} options={languageOptions}  />
          </div>
          <div className="totalCountContainer text-4xl font-bold absolute">{totalProblemsSolved}</div>
      </div>
        
  </section>

  
</div>

{/* third row ------------------------------------------------------------------------------------------------------------ */}
<section className="third-row bg-white shadow-md hover:shadow-lg transition rounded-md w-full p-5 relative">
     {codechefContestDetails.length>0 || codeforcesContestDetails.length>0? <ApexChart contestDetails={{codeforcesContestDetails,codechefContestDetails}}/>:null}
</section>


<section className="third-row bg-white shadow-md hover:shadow-lg transition rounded-md w-full p-5 relative">
  <BarchartComponent/>
</section>

</div>) : <AddProfile/>}

    </div>
  )
}

export default RightPane
