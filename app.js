require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Import jwt for token generation
const taskRoutes = require("./routes/taskRoutes"); // Import task routes
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const connectDb = require("./config/db.config"); // Import database connection function

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDb().catch((error) =>
  console.error("MongoDB connection error:", error)
);

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for cross-origin requests

// Utility function to generate a JWT token
// Note: This function is likely used in the authController, consider moving it there for better modularity.
function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

// Task Management Routes
// - GET /api/tasks (get all tasks for the authenticated user)
// - POST /api/tasks (create a new task for the authenticated user)
// - DELETE /api/tasks/:id (delete a specific task by ID)
app.use("/api/tasks", taskRoutes); // Mount task routes at /api/tasks

// Authentication Routes
// - POST /api/auth/register (register a new user)
// - POST /api/auth/login (authenticate user and return JWT)
app.use("/api/auth", authRoutes); // Mount auth routes at /api/auth

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to TaskMaster API");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
