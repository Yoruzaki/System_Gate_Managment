import React, { useState } from "react";
import Profile from "../components/Profile";
import Members from "../components/Members";
import Statistics from "../components/Statistics";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Profile");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Admin Dashboard</h2>
        <ul>
          <li
            className={`p-2 cursor-pointer ${activeSection === "Profile" ? "bg-gray-700" : ""}`}
            onClick={() => setActiveSection("Profile")}
          >
            Profile
          </li>
          <li
            className={`p-2 cursor-pointer ${activeSection === "Members" ? "bg-gray-700" : ""}`}
            onClick={() => setActiveSection("Members")}
          >
            Members
          </li>
          <li
            className={`p-2 cursor-pointer ${activeSection === "Statistics" ? "bg-gray-700" : ""}`}
            onClick={() => setActiveSection("Statistics")}
          >
            Statistics
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        {activeSection === "Profile" && <Profile />}
        {activeSection === "Members" && <Members/>}
        {activeSection === "Statistics" && <Statistics/>}
      </div>
    </div>
  );
}

export default AdminDashboard;
