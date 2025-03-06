import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard"; // Import AgentDashboard
import Statistics from "./components/Statistics"; // Optional: If you still need this standalone route

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route for login */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Agent Dashboard */}
        <Route path="/agent-dashboard" element={<AgentDashboard />} />

        {/* Optional: Standalone Statistics route (if needed) */}
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;