import { Response } from 'express';
import Task from '../models/Task.js';
import { isMongoDBConnected } from '../config/db.js';
import { memoryTasks, MemoryTask } from '../config/fallbackStore.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Get user tasks with optional search & filter
// @route   GET /api/tasks or GET /tasks
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { search, status, priority } = req.query;

    if (isMongoDBConnected) {
      const query: any = { user: userId };

      if (status && status !== 'All') {
        query.status = status;
      }

      if (priority && priority !== 'All') {
        query.priority = priority;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const tasks = await Task.find(query).sort({ createdAt: -1 });
      res.json(tasks);
      return;
    } else {
      // Fallback store
      let filtered = memoryTasks.filter((t) => t.user === userId || t.user === 'demo-user-id-001');

      if (status && status !== 'All') {
        filtered = filtered.filter((t) => t.status === status);
      }

      if (priority && priority !== 'All') {
        filtered = filtered.filter((t) => t.priority === priority);
      }

      if (search) {
        const term = String(search).toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term)
        );
      }

      // Sort newest first
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      res.json(filtered);
      return;
    }
  } catch (error) {
    console.error('getTasks error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// @desc    Create new task
// @route   POST /api/tasks or POST /tasks
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (!title || !dueDate) {
      res.status(400).json({ message: 'Title and due date are required' });
      return;
    }

    if (isMongoDBConnected) {
      const task = await Task.create({
        user: userId,
        title,
        description: description || '',
        priority: priority || 'Medium',
        status: status || 'Pending',
        dueDate: new Date(dueDate),
      });

      res.status(201).json(task);
      return;
    } else {
      const now = new Date().toISOString();
      const newTask: MemoryTask = {
        _id: `task-${Date.now()}`,
        user: userId,
        title: title.trim(),
        description: (description || '').trim(),
        priority: priority || 'Medium',
        status: status || 'Pending',
        dueDate: new Date(dueDate).toISOString().split('T')[0],
        createdAt: now,
        updatedAt: now,
      };

      memoryTasks.unshift(newTask);
      res.status(201).json(newTask);
      return;
    }
  } catch (error) {
    console.error('createTask error:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id or PUT /tasks/:id
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (isMongoDBConnected) {
      const task = await Task.findById(id);

      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if (task.user.toString() !== userId) {
        res.status(403).json({ message: 'Not authorized to update this task' });
        return;
      }

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority !== undefined) task.priority = priority;
      if (status !== undefined) task.status = status;
      if (dueDate !== undefined) task.dueDate = new Date(dueDate);

      const updatedTask = await task.save();
      res.json(updatedTask);
      return;
    } else {
      const taskIndex = memoryTasks.findIndex((t) => t._id === id);

      if (taskIndex === -1) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      const task = memoryTasks[taskIndex];

      const updatedTask: MemoryTask = {
        ...task,
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        priority: priority !== undefined ? priority : task.priority,
        status: status !== undefined ? status : task.status,
        dueDate: dueDate !== undefined ? new Date(dueDate).toISOString().split('T')[0] : task.dueDate,
        updatedAt: new Date().toISOString(),
      };

      memoryTasks[taskIndex] = updatedTask;
      res.json(updatedTask);
      return;
    }
  } catch (error) {
    console.error('updateTask error:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id or DELETE /tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (isMongoDBConnected) {
      const task = await Task.findById(id);

      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      if (task.user.toString() !== userId) {
        res.status(403).json({ message: 'Not authorized to delete this task' });
        return;
      }

      await task.deleteOne();
      res.json({ message: 'Task deleted successfully', id });
      return;
    } else {
      const taskIndex = memoryTasks.findIndex((t) => t._id === id);

      if (taskIndex === -1) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      memoryTasks.splice(taskIndex, 1);
      res.json({ message: 'Task deleted successfully', id });
      return;
    }
  } catch (error) {
    console.error('deleteTask error:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};
