const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        // Log the incoming data for debugging
        console.log('Create Task Request Body:', req.body);
        console.log('Authenticated User ID:', req.user.id);

        // Create a new task and associate it with the authenticated user
        const task = new Task({
            ...req.body,
            user: req.user.id,
        });

        // Save the task to the database
        await task.save();

        // Return the created task as a response
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
    try {
        console.log('Fetching tasks for User ID:', req.user.id);

        // Retrieve tasks only for the authenticated user
        const tasks = await Task.find({ user: req.user.id });

        // Return the retrieved tasks
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
    const { id } = req.params; // Task ID from the request parameters
    const { title, status } = req.body; // Fields to be updated

    // Validate the ID before querying
    if (!id) {
        return res.status(400).json({ error: 'Task ID is required' });
    }

    try {
        console.log('Updating Task:', { id, title, status });
        console.log('Authenticated User ID:', req.user.id);

        // Find the task by ID and update it if it belongs to the authenticated user
        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { title, status },
            { new: true, runValidators: true } // Options to return the updated document and validate updates
        );

        if (!task) {
            console.warn('Task not found or does not belong to the user:', { id, user: req.user.id });
            return res.status(404).json({ error: 'Task not found' });
        }

        // Return the updated task
        res.status(200).json(task);
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
    const { id } = req.params; // Task ID from the request parameters

    // Validate the ID before querying
    if (!id) {
        return res.status(400).json({ error: 'Task ID is required' });
    }

    try {
        console.log('Deleting Task ID:', id);
        console.log('Authenticated User ID:', req.user.id);

        // Find the task by ID and delete it if it belongs to the authenticated user
        const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

        if (!task) {
            console.warn('Task not found or does not belong to the user:', { id, user: req.user.id });
            return res.status(404).json({ error: 'Task not found' });
        }

        // Return a success message
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
