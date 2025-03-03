import { useEffect, useState } from "react";

export default function Profile() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Agent");
  const [password, setPassword] = useState("");

  // Fetch users from the backend on component mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);
  

  // Function to add a new user
  const addUser = () => {
    if (!name || !role || !password) {
      alert("All fields are required!");
      return;
    }

    fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, password }),
    })
      .then((res) => res.json())
      .then(() => {
        setUsers([...users, { id: users.length + 1, name, role, password: "******" }]);
        setName("");
        setRole("Agent");
        setPassword("");
      })
      .catch((err) => console.error("Error adding user:", err));
  };

  // Function to update a user
  const updateUser = async (id) => {
    const newName = prompt("Enter new name:");
    const newRole = prompt("Enter new role (Admin/Agent):");
    const newPassword = prompt("Enter new password:");
  
    if (!newName || !newRole || !newPassword) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, role: newRole, password: newPassword }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
  
      setUsers(users.map(user => user.id === id ? { ...user, name: newName, role: newRole, password: "******" } : user));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  

  // Function to delete a user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
  
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  
  

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">User Profile Management</h2>

      {/* Add User Form */}
      <div className="mb-4 p-4 border rounded shadow">
        <h3 className="text-lg font-semibold">Add New User</h3>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select className="border p-2 mr-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Agent">Agent</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mr-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={addUser} className="bg-green-500 text-white px-4 py-2 rounded">Add User</button>
      </div>

      {/* Users Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Password</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">******</td>
              <td className="border p-2">
                <button onClick={() => updateUser(user.id)} className="bg-yellow-500 text-white px-2 py-1 mx-1">
                  Edit
                </button>
                <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-2 py-1 mx-1">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
