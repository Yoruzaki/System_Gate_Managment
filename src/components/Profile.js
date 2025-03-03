import React, { useState } from "react";

const Profile = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Bourabha Kamel", role: "Admin", password: "******" },
    { id: 2, name: "Walid Chakir", role: "Agent", password: "******" },
  ]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("Agent");
  const [password, setPassword] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  // Ajouter un utilisateur
  const addUser = () => {
    if (!name || !password) return alert("Name and Password are required!");

    const newUser = { id: users.length + 1, name, role, password: "******" };
    setUsers([...users, newUser]);

    // Reset form
    setName("");
    setRole("Agent");
    setPassword("");
  };

  // Supprimer un utilisateur
  const deleteUser = (id) => {
    if (window.confirm("Voulez-vous supprimer cet utilisateur ?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Gérer l'édition d'un utilisateur
  const startEditing = (user) => {
    setEditingUser(user);
    setName(user.name);
    setRole(user.role);
    setPassword(""); // Permettre la modification du mot de passe
  };

  // Sauvegarder la modification
  const saveEdit = () => {
    if (!name || !password) return alert("Name and Password are required!");

    setUsers(users.map((user) =>
      user.id === editingUser.id
        ? { ...user, name, role, password: "******" }
        : user
    ));

    setEditingUser(null);
    setName("");
    setRole("Agent");
    setPassword("");
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Profile Management</h2>

      {/* Formulaire d'ajout ou de modification */}
      <div className="mb-5 p-4 bg-gray-100 rounded">
        <input
          type="text"
          placeholder="Enter Name"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="border p-2 mr-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Agent">Agent</option>
        </select>

        {editingUser ? (
          <button onClick={saveEdit} className="bg-green-500 text-white px-4 py-2 ml-2">
            Save Changes
          </button>
        ) : (
          <button onClick={addUser} className="bg-blue-500 text-white px-4 py-2 ml-2">
            Add User
          </button>
        )}
      </div>

      {/* Liste des utilisateurs */}
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
              <td className="border p-2">{user.password}</td>
              <td className="border p-2">
                <button onClick={() => startEditing(user)} className="bg-yellow-500 text-white px-3 py-1 mr-2">
                  Edit
                </button>
                <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-3 py-1">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
