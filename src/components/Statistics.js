import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  FaUsers,
  FaCar,
  FaCalendarDay,
  FaCalendarAlt,
  FaSync,
  FaArrowLeft,
  FaArrowRight,
  FaBell,
  FaTrash,
} from "react-icons/fa"; // Icons for summary cards and notifications
import { PulseLoader } from "react-spinners"; // Loading spinner

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = () => {
  // State for statistics and logs
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalCars: 0,
    todayEntries: 0,
    monthEntries: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    entriesPerDay: [],
  });

  const [logEntries, setLogEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const entriesPerPage = 10;

  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentNotificationPage, setCurrentNotificationPage] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notification dropdown
  const notificationsPerPage = 8;

  // Fetch statistics and logs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch("http://localhost:5000/stats");
        const statsData = await statsResponse.json();
        setStats({
          totalMembers: statsData.totalMembers || 0,
          totalCars: statsData.totalCars || 0,
          todayEntries: statsData.todayEntries || 0,
          monthEntries: statsData.monthEntries || 0,
          monthlyEntries: Array.isArray(statsData.monthlyEntries)
            ? statsData.monthlyEntries
            : [],
          activeMembers: statsData.activeMembers || 0,
          inactiveMembers: statsData.inactiveMembers || 0,
          entriesPerDay: statsData.entriesPerDay || [],
        });

        const logsResponse = await fetch("http://localhost:5000/logs");
        const logsData = await logsResponse.json();
        setLogEntries(Array.isArray(logsData) ? logsData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/notifications");
      const data = await response.json();
      setNotifications(data);
      setNotificationCount(data.length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`http://localhost:5000/delete-notification/${notificationId}`, {
        method: "DELETE",
      });
      fetchNotifications(); // Refresh the notifications list
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Open gate functionality
  const [isOpening, setIsOpening] = useState(false);
  const openGate = () => {
    setIsOpening(true);
    fetch("http://localhost:5000/open-gate", { method: "POST" })
      .then((response) => response.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.error("Error opening gate:", err))
      .finally(() => setIsOpening(false));
  };

  // Chart data
  const barChartData = {
    labels: stats.entriesPerDay?.map((entry) => entry.entry_date) || [],
    datasets: [
      {
        label: "Daily Entries",
        data: stats.entriesPerDay?.map((entry) => entry.entries_count) || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const activeInactiveMembersData = {
    labels: ["Active Members", "Inactive Members"],
    datasets: [
      {
        label: "Members",
        data: [stats.activeMembers, stats.inactiveMembers],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const dailyEntriesData = {
    labels: ["Today's Entries", "Remaining Capacity"],
    datasets: [
      {
        label: "Entries",
        data: [stats.todayEntries, 100 - stats.todayEntries],
        backgroundColor: ["rgba(153, 102, 255, 0.6)", "rgba(201, 203, 207, 0.6)"],
      },
    ],
  };

  // Notification dropdown component
  const NotificationDropdown = () => {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
        <div className="p-4">
          <h4 className="font-semibold text-gray-800">
            Notifications ({notificationCount})
          </h4>
          <div className="mt-2">
            {notifications
              .slice(
                currentNotificationPage * notificationsPerPage,
                (currentNotificationPage + 1) * notificationsPerPage
              )
              .map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50"
                >
                  <span>{notification.message}</span>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() =>
                setCurrentNotificationPage((prev) => Math.max(prev - 1, 0))
              }
              disabled={currentNotificationPage === 0}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentNotificationPage((prev) =>
                  (prev + 1) * notificationsPerPage < notifications.length
                    ? prev + 1
                    : prev
                )
              }
              disabled={
                (currentNotificationPage + 1) * notificationsPerPage >=
                notifications.length
              }
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Statistics Overview</h2>

      {/* Notification Button and Dropdown */}
<div className="fixed bottom-4 right-4 z-50">
  <div className="relative">
    <button
      onClick={() => setShowNotifications((prev) => !prev)} // Toggle state properly
      className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 relative"
    >
      <FaBell className="text-xl" />
      {notificationCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
          {notificationCount}
        </span>
      )}
    </button>

    {/* Show dropdown when `showNotifications` is true */}

{showNotifications && (
  <div className="absolute right-0 bottom-12 w-80 bg-white rounded-lg shadow-2xl z-50 transform transition-all duration-300 ease-in-out">
    <div className="p-4">
      <h4 className="font-semibold text-gray-900 text-lg">
        Notifications ({notificationCount})
      </h4>
      <div className="mt-2 max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No new notifications.</p>
        ) : (
          notifications
            .slice(
              currentNotificationPage * notificationsPerPage,
              (currentNotificationPage + 1) * notificationsPerPage
            )
            .map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <div>
                  <p className="font-semibold text-blue-600 text-sm">
                    {notification.name}
                  </p>
                  <p className="text-gray-700 text-sm">{notification.message}</p>
                </div>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  aria-label="Delete notification"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))
        )}
      </div>
      {/* Pagination Controls */}
      {notifications.length > notificationsPerPage && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() =>
              setCurrentNotificationPage((prev) => Math.max(prev - 1, 0))
            }
            disabled={currentNotificationPage === 0}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentNotificationPage((prev) =>
                (prev + 1) * notificationsPerPage < notifications.length
                  ? prev + 1
                  : prev
              )
            }
            disabled={
              (currentNotificationPage + 1) * notificationsPerPage >=
              notifications.length
            }
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
)}
  </div>
</div>


      {/* Summary Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <PulseLoader color="#3B82F6" size={15} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Members",
              value: stats.totalMembers,
              icon: <FaUsers className="text-3xl" />,
              color: "bg-blue-500",
            },
            {
              title: "Total Cars",
              value: stats.totalCars,
              icon: <FaCar className="text-3xl" />,
              color: "bg-green-500",
            },
            {
              title: "Today's Entries",
              value: stats.todayEntries,
              icon: <FaCalendarDay className="text-3xl" />,
              color: "bg-yellow-500",
            },
            {
              title: "Month's Entries",
              value: stats.monthEntries,
              icon: <FaCalendarAlt className="text-3xl" />,
              color: "bg-purple-500",
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`p-6 ${card.color} text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Logs Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Log Entries</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-gray-700">ID</th>
                <th className="p-3 text-left text-gray-700">Plate Number</th>
                <th className="p-3 text-left text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {logEntries
                .slice(currentPage * entriesPerPage, (currentPage + 1) * entriesPerPage)
                .map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="p-3 text-gray-600">{entry.id}</td>
                    <td className="p-3 text-gray-600">{entry.carPlate}</td>
                    <td className="p-3 text-gray-600">{entry.entry_time}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  (prev + 1) * entriesPerPage < logEntries.length ? prev + 1 : prev
                )
              }
              disabled={(currentPage + 1) * entriesPerPage >= logEntries.length}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 flex items-center"
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>

        {/* Camera Feed */}
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Live Camera Feed</h3>
          <img
            src="http://localhost:5000/camera"
            alt="Live Camera"
            className="w-full h-auto rounded-md border border-gray-200"
          />
          <button
            onClick={() => window.location.reload()}
            className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full"
          >
            <FaSync className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Open Gate Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={openGate}
          className="flex items-center gap-2 px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
          disabled={isOpening}
        >
          {isOpening ? <PulseLoader size={8} color="white" /> : <FaArrowRight />}
          Open Gate
        </button>
      </div>

      <div className="mt-8">
  <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
    {/* Bar Chart */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Entries</h3>
      {stats.entriesPerDay.length > 0 ? (
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: {
              x: {
                ticks: {
                  callback: function (value) {
                    // Format the date as yyyy-mm-dd
                    const date = new Date(this.getLabelForValue(value));
                    return date.toISOString().split("T")[0];
                  },
                },
              },
            },
          }}
        />
      ) : (
        <p className="text-gray-500">No data available for this month.</p>
      )}
    </div>

    {/* Pie Chart */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Active vs Inactive Members</h3>
      <Pie data={activeInactiveMembersData} />
    </div>
  </div>
</div>
    </div>
  );
};

export default Statistics;