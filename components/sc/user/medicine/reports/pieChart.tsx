import React from "react";
import { Pie } from 'react-chartjs-2';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function PieChart({ chartDataHour, timeDate ,options}:any) {

  // console.log(chartDataHour);
  
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Sales Per Drug Per Hour</h2>
      <Pie
        data={chartDataHour}
        options={{
          plugins: {
            title: {
              display: true,
              text: `Top 5 Drug Sales and Quantity Sold`
            },
            legend: {
              display: true
            }
          },

        }}
      />
    </div>
  );
}