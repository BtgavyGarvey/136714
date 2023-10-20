import { PolarArea } from 'react-chartjs-2';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function PolarAreaChart({ chartData }:any) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>PolarArea Chart</h2>
      <PolarArea
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};