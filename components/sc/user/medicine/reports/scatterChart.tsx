import { Scatter } from 'react-chartjs-2';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function ScatterChart({ chartData }:any) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Scatter Chart</h2>
      <Scatter
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