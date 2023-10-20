'use client'
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Data } from "../../../../../components/data";
import { useRouter } from "next/navigation"
import PieChart from "./pieChart";
import React from "react";
import LineChart from "./lineChart";
import BarChart from "./barChart";
import PolarAreaChart from "./polarArea";
import ScatterChart from "./scatterChart";
import BubbleChart from "./bubleChart";
import DoughnutChart from "./doughnutChar";
import RadarChart from "./radarChart";

export default function ViewMedicinePage({pharm}:any) {

    const pharmacyName=pharm.name

    const router=useRouter()

    const [chartData, setChartData] = React.useState({
        labels: Data.map((data) => data.year), 
        datasets: [
          {
            label: "Users Gained ",
            data: Data.map((data) => data.userGain),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "&quot;#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0"
            ],
            borderColor: "black",
            borderWidth: 2
          },
          {
            label: "Users Lost ",
            data: Data.map((data) => data.userLost),
            backgroundColor: [
              "rgba(192,75,192,1)",
              "&quot;#ecf0f1",
              "#A50F95",
              "#bf3a2f",
              "#2d71a0"
            ],
            borderColor: "black",
            borderWidth: 2
          }
        ]
      });



    return(
        <>
        <div className= 'container'> 
        
            <section id= 'fifth' className="nav_section">
            <div className="main-dashboard justify-content-center bg-danger">
                <h3 className="text-light fw-bold m-3 ">Medicine Report Dashboard</h3>
            </div>
            <hr  />
                <div className="chartjs">
                <PieChart chartData={chartData} />
                <LineChart chartData={chartData} />
                </div>

                <div className="chartjs">
                <BarChart chartData={chartData} />
                <PolarAreaChart chartData={chartData} />

                </div>

                <div className="chartjs">
                <ScatterChart chartData={chartData} />
                <RadarChart chartData={chartData} />

                </div>

                <div className="chartjs">
                <DoughnutChart chartData={chartData} />
                <BubbleChart chartData={chartData} />

                </div>
            </section>
        </div>
        
        </>
    )
}