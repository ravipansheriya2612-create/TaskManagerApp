import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required",
            });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            user: req.user._id,
        });

        return res.status(201).json(task);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        task.title = req.body.title ?? task.title;
        task.description = req.body.description ?? task.description;
        task.priority = req.body.priority ?? task.priority;
        task.completed =
            req.body.completed !== undefined
                ? req.body.completed
                : task.completed;

        const updatedTask = await task.save();

        return res.status(200).json(updatedTask);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        await task.deleteOne();

        return res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};