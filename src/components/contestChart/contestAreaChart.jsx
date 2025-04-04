import {useState } from "react";
import ReactApexChart from "react-apexcharts";


const ApexChart = (contestDetails) => {

    const codeforcesContestDetails=contestDetails.contestDetails.codeforcesContestDetails;
    const codechefContestDetails=contestDetails.contestDetails.codechefContestDetails;

    let codeforcesSeriesData=[];
    let codeforcesCategories=[];

    console.log("contest details",contestDetails)
    codeforcesContestDetails?.map((data)=>{
        codeforcesSeriesData.push(data.rating);
        codeforcesCategories.push(data.contestName);
    })


    const [state, setState] = useState({
        series: [
            {
              name: 'Codeforces',
              data: codeforcesSeriesData
            },
            ...(codechefContestDetails ? [{
              name: 'Codechef',
              data: [] 
            }] : [])
          ],
        options: {
          chart: {
            height: 200,
            type: 'area'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'category',
            categories: codeforcesCategories,
            labels:{
                show:false
            }
          },
          
         
        },
      
      
    });

    
    console.log(state)

    return (
      <div>
        <div id="chart">
            <div className="contestDetails">
                <div className="totalContests">
                    <div className="totalContestLabel font-bold text-2xl">Total Contests</div>
                    <div className="totalContestCount text-2xl">{codeforcesContestDetails.length}</div>
                </div>
        
            </div>
            <ReactApexChart options={state.options} series={state.series} type="area" height={350} />
          </div>
        <div id="html-dist"></div>
      </div>
    );
  }

export default ApexChart