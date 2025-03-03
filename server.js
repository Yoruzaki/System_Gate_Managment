const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Default user in XAMPP
  password: "", // No password by default
  database: "gate_system",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Fetch all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Add a new user
app.post("/users", (req, res) => {
  const { name, role, password } = req.body;
  const sql = "INSERT INTO users (name, role, password) VALUES (?, ?, ?)";
  db.query(sql, [name, role, password], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "User added successfully!" });
  });
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "User deleted successfully!" });
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
