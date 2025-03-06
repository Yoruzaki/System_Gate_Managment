import React, { useState } from "react";
import { FaUsers, FaChartLine, FaSignOutAlt } from "react-icons/fa"; // Icons for agent dashboard
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MembersAgent from "../components/MembersAgent"; // Import MembersAgent
import StatisticsAgent from "../components/StatisticsAgent"; // Import StatisticsAgent

function AgentDashboard() {
  const [activeSection, setActiveSection] = useState("Statistics");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clear tokens, etc.)
    navigate("/"); // Redirect to the Login page
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-5 fixed h-full overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div>
          {/* Section Bar at the Top */}
          <h2 className="text-xl font-bold mb-5 flex items-center">
            <FaChartLine className="mr-2" /> Agent Dashboard
          </h2>

          <ul>
            <li
              className={`p-3 mb-2 cursor-pointer rounded-lg flex items-center transition-all duration-300 ${
                activeSection === "Statistics" ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveSection("Statistics")}
            >
              <FaChartLine className="mr-2" /> Statistics
            </li>
            <li
              className={`p-3 mb-2 cursor-pointer rounded-lg flex items-center transition-all duration-300 ${
                activeSection === "Members" ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveSection("Members")}
            >
              <FaUsers className="mr-2" /> Members
            </li>
          </ul>
        </div>

        {/* Logout Button at the Bottom */}
        <button
          onClick={handleLogout}
          className="p-3 w-full cursor-pointer rounded-lg flex items-center justify-center bg-red-600 hover:bg-red-700 transition-all duration-300"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 ml-64 overflow-y-auto bg-gray-100">
        {activeSection === "Members" && <MembersAgent />}
        {activeSection === "Statistics" && <StatisticsAgent />}
      </div>
    </div>
  );
}

export default AgentDashboard;