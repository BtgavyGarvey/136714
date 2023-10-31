import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function LineChart({ chartDataHour, timeDate, options }:any) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Hourly Sales Per Drug</h2>
      <Line
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
          scales:options.scales
        }}
      />
    </div>
  );
}

export function LineChartTimeFrame({ chartDataHour, timeDate, options }:any) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{timeDate}</h2>
      <Line
        data={chartDataHour}
        options={{
          plugins: {
            title: {
              display: true,
              text: `Drug Sales and Quantity Sold`
            },
            legend: {
              display: true
            }
          },
          scales:options.scales
        }}
      />
    </div>
  );
}