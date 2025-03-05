import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalCars: 0,
    todayEntries: 0,
    monthlyEntries: [],
  });

  const [logEntries, setLogEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:5000/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats({
          totalMembers: data.totalMembers || 0,
          totalCars: data.totalCars || 0,
          todayEntries: data.todayEntries || 0,
          monthlyEntries: Array.isArray(data.monthlyEntries) ? data.monthlyEntries : [],
        });
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setStats({ totalMembers: 0, totalCars: 0, todayEntries: 0, monthlyEntries: [] });
      });

    fetch("http://localhost:5000/logs")
      .then((response) => response.json())
      .then((data) => setLogEntries(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching logs:", err);
        setLogEntries([]);
      });
  }, []);

  const openGate = () => {
    fetch("http://localhost:5000/open-gate", { method: "POST" })
      .then((response) => response.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.error("Error opening gate:", err));
  };
  
  const barChartData = {
    labels: stats.monthlyEntries.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: "Daily Entries",
        data: stats.monthlyEntries,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Statistics Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Total Members</h3>
          <p className="text-2xl">{stats.totalMembers}</p>
        </div>
        <div className="p-4 bg-green-500 text-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Total Cars</h3>
          <p className="text-2xl">{stats.totalCars}</p>
        </div>
        <div className="p-4 bg-yellow-500 text-white rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Today's Entries</h3>
          <p className="text-2xl">{stats.todayEntries}</p>
        </div>
      </div>

      {/* Main Content (Logs + Camera Feed) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Logs Table */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">Recent Log Entries</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Plate Number</th>
                <th className="border p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {logEntries.slice(currentPage * entriesPerPage, (currentPage + 1) * entriesPerPage).map((entry) => (
                <tr key={entry.id}>
                  <td className="border p-2">{entry.id}</td>
                  <td className="border p-2">{entry.carPlate}</td>
                  <td className="border p-2">{entry.entry_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-2">
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} 
              disabled={currentPage === 0} 
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage((prev) => (prev + 1) * entriesPerPage < logEntries.length ? prev + 1 : prev)} 
              disabled={(currentPage + 1) * entriesPerPage >= logEntries.length} 
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </div>

        {/* Camera Feed (Placed Aside) */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Live Camera Feed</h3>
          <img
            src="http://localhost:5000/camera"
            alt="Live Camera"
            className="w-full h-auto border rounded-md"
          />
          <p className="text-sm text-gray-500 mt-2">Auto-refresh every few seconds.</p>
        </div>
      </div>

      {/* Open Gate Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={openGate}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Open Gate
        </button>
      </div>

      {/* Bar Chart */}
      <div className="p-4 bg-white rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-2">Daily Entries</h3>
        {stats.monthlyEntries.length > 0 ? (
          <Bar data={barChartData} />
        ) : (
          <p className="text-gray-500">No data available for this month.</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;
