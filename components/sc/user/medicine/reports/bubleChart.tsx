import { Bubble } from 'react-chartjs-2';

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function BubbleChart({ chartDataHour , timeDate}:any) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>{timeDate}</h2>
      <Bubble
        data={chartDataHour}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Drug Sales and Quantity Sold"
            },
            legend: {
              display: true
            }
          }
        }}
      />
    </div>
  );
};