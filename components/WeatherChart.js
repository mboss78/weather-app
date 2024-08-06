import React from 'react'; // Importing React
import { Line } from 'react-chartjs-2'; // Importing Line chart from react-chartjs-2
import { format } from 'date-fns'; // Importing format function from date-fns for date formatting
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // importing components from chart.js

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherChart = ({ pastWeather }) => {
  // Extracting and formatting dates for labels
  const labels = pastWeather.map((dayWeather) =>
    format(new Date(dayWeather.forecast.forecastday[0].date), 'MMM-dd')
  );

  // Extracting temperature data
  const temperatures = pastWeather.map(
    (dayWeather) => dayWeather.forecast.forecastday[0].day.avgtemp_c
  );

  // Extracting humidity data
  const humidity = pastWeather.map(
    (dayWeather) => dayWeather.forecast.forecastday[0].day.avghumidity
  );

  // Extracting wind speed data
  const windSpeeds = pastWeather.map(
    (dayWeather) => dayWeather.forecast.forecastday[0].day.maxwind_kph
  );

  // Data for the chart
  const data = {
    labels, // Labels for the x-axis
    datasets: [
      {
        label: 'Temperature (°C)', // Label for the temperature dataset
        data: temperatures, // Data for the temperature
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
      },
      {
        label: 'Humidity (%)', // Label for the humidity dataset
        data: humidity, // Data for the humidity
        borderColor: 'rgba(153, 102, 255, 1)', // Line color
        backgroundColor: 'rgba(153, 102, 255, 0.2)', // Fill color
      },
      {
        label: 'Wind Speed (kph)', // Label for the wind speed dataset
        data: windSpeeds, // Data for the wind speed
        borderColor: 'rgba(255, 159, 64, 1)', // Line color
        backgroundColor: 'rgba(255, 159, 64, 0.2)', // Fill color
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        position: 'top', // Position of the legend
      },
      title: {
        display: true, // Display the title
        text: 'Weather Data for the Last Month', // Title text
      },
    },
  };

  return <Line data={data} options={options} />; // Rendering the Line chart with data and options
};

export default WeatherChart;
