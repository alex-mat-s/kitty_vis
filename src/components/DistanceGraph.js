import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

const DistanceGraph = ({ distances, timestamps, onPointClick }) => {
  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Distance traveled (km)',
        data: distances,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'DD-MM-YYYY',
          },
          tooltipFormat: 'DD-MM-YYYY HH:mm'
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10
        }
      }
    },
    onClick: (event, activeElements) => {
      if (activeElements.length > 0) {
        const index = activeElements[0].index;
        onPointClick(timestamps[index]);
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default DistanceGraph;
