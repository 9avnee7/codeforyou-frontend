import React from 'react'
import {Chart as ChartJS} from "chart.js/auto";
import {Bar ,Doughnut ,Line} from "react-chartjs-2";


const ChartTutorial = () => {
  const data = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };
  
  return (
    <div>
      <div className="barchart">
        <div className="mt-[20%] w-[40%] h-[400px] border-2 border-black-100">
            <Bar
              data={{
                labels:["A",'b','c'],
                datasets:[
                  {
                    label:'revenue',
                    data:[200,300,400]
                  },
                  {
                    label:'revenue',
                    data:[100,200,500]
                  }

                ]
              }}
            />
          <Doughnut data={data}/>
        </div>

      </div>
    </div>
  )
}

export default ChartTutorial
