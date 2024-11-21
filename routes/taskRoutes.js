// routes/taskRoutes.js
const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes
const router = express.Router();

// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', protect, getTasks);

// POST /api/tasks - Create a new task for the authenticated user
router.post('/', protect, createTask);

// PUT /api/tasks/:id - Update a task by ID
router.put('/:id', protect, updateTask);

// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/:id', protect, deleteTask);


module.exports = router;
