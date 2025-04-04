import React, { useContext } from 'react'
import { GlobalContext } from '../../index'
import {Chart as ChartJS, plugins} from "chart.js/auto";
import { Doughnut,Bar } from "react-chartjs-2";

const BarchartComponent = () => {

    const {topicWiseAnalysisData}=useContext(GlobalContext);
    const labels = [];
    const Data = [];
    const backgroundColors = [];
    
    const categoryColors = {
        advanced: "#FF4C4C", // Red
        intermediate: "#FFD700", // Yellow
        fundamental: "#4CAF50" // Green
    };
    

    const allTopics = [];
    
    topicWiseAnalysisData.forEach(category => {
        category.topics.forEach(topic => {
            allTopics.push({
                topicName: topic.topicName,
                problemCount: topic.problemCount,
                color: categoryColors[category.categoryName]
            });
        });
    });
    
   
    allTopics.sort((a, b) => b.problemCount - a.problemCount);
    

    allTopics.forEach(topic => {
        labels.push(topic.topicName);
        Data.push(topic.problemCount);
        backgroundColors.push(topic.color);
    });
    
    const barData = {
        labels,
        datasets: [{
            data:Data, 
            backgroundColor: backgroundColors,
            barThickness:10,
            categoryPercentage: 0.6,
            barPercentage: 0.8
        }]
    };
    
    const barOptions = {
        indexAxis: 'y', // Horizontal Bar Chart
        scales: {
            x: { display: false },
            y: { grid: { display: false } }
        },
        plugins: {
            legend: { display: false }
        }
    };
  return (
    <div>
        <div className="barHeading">DSA Topic Analysis</div>
            {/* Info tooltip */}
            <div className="infoWrapper absolute right-2 top-0 group">
            <i className="fa-solid fa-circle-info text-gray-500 cursor-pointer hover:text-gray-700"></i>
            <p className="absolute right-0 mt-2 bg-gray-700 text-white text-sm p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                This will display the info about your topics
            </p>
            </div>

            <div className="barContainer w-full max-h-[200px] overflow-auto">
            <div className="min-h-[400px]">
            <Bar  data={barData} options={barOptions} />
            </div>
            </div>
    </div>
  )
}

export default BarchartComponent
