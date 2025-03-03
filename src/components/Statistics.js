import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Statistics = () => {
  // Example Data
  const totalMembers = 120;
  const totalCars = 80;
  const todayEntries = 30;
  const monthlyEntries = [10, 15, 20, 30, 45, 35, 25, 40, 50, 60, 75, 80];

  // Bar Chart for Daily Entries
  const barChartData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "Daily Entries",
        data: [5, 12, 8, 15, 20, 18, 25],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // Pie Chart for Car Types
  const pieChartData = {
    labels: ["Sedan", "SUV", "Truck", "Motorcycle"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Statistics Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Total Members</h3>
          <p className="text-2xl">{totalMembers}</p>
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Total Cars</h3>
          <p className="text-2xl">{totalCars}</p>
        </div>
        <div className="p-4 bg-yellow-500 text-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Today's Entries</h3>
          <p className="text-2xl">{todayEntries}</p>
        </div>
        <div className="p-4 bg-red-500 text-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Monthly Entries</h3>
          <p className="text-2xl">{monthlyEntries.reduce((a, b) => a + b, 0)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Daily Entries</h3>
          <Bar data={barChartData} />
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Car Type Distribution</h3>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
