import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Task } from '../../../shared/types';
import { TaskModel } from '../models';
import { logger } from '../utils/logger';

/**
 * Get all tasks for a project or organization
 */
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { projectId, status, assignedTo, skip = 0, limit = 50 } = req.query;
    const query: Record<string, any> = { organizationId: req.user.organizationId };

    // Add optional filters
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (assignedTo) query['assignedTo.staffId'] = assignedTo;

    const tasks = await TaskModel.find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ dueDate: 1, priority: -1 });

    const total = await TaskModel.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks',
      timestamp: new Date(),
    });
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { id } = req.params;
    const task = await TaskModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Task not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: task,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task',
      timestamp: new Date(),
    });
  }
};

/**
 * Create a new task
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { projectId, title, description, priority = 'medium', dueDate, assignedTo, requiredSkills } = req.body;

    // Validation
    if (!projectId || !title) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: projectId, title',
        timestamp: new Date(),
      });
      return;
    }

    const taskId = 'task_' + uuidv4();

    const newTask = new TaskModel({
      id: taskId,
      organizationId: req.user.organizationId,
      projectId,
      title,
      description,
      priority,
      status: 'pending',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignedTo,
      requiredSkills: requiredSkills || [],
      startDate: new Date(),
      tags: [],
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task',
      timestamp: new Date(),
    });
  }
};

/**
 * Update a task
 */
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating certain fields
    delete updates.id;
    delete updates.organizationId;
    delete updates.createdAt;

    const updatedTask = await TaskModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({
        success: false,
        error: 'Task not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task',
      timestamp: new Date(),
    });
  }
};

/**
 * Update task status
 */
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'assigned', 'in_progress', 'completed', 'blocked'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, assigned, in_progress, completed, or blocked',
        timestamp: new Date(),
      });
      return;
    }

    const updatedTask = await TaskModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        status,
        completedAt: status === 'completed' ? new Date() : null,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({
        success: false,
        error: 'Task not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedTask,
      message: `Task status updated to ${status}`,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update task status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task status',
      timestamp: new Date(),
    });
  }
};

/**
 * Assign task to staff member
 */
export const assignTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { id } = req.params;
    const { staffId, name, email } = req.body;

    if (!staffId) {
      res.status(400).json({
        success: false,
        error: 'staffId is required',
        timestamp: new Date(),
      });
      return;
    }

    const updatedTask = await TaskModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        assignedTo: { staffId, name, email },
        status: 'assigned',
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({
        success: false,
        error: 'Task not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedTask,
      message: 'Task assigned successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Assign task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign task',
      timestamp: new Date(),
    });
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { id } = req.params;

    const deletedTask = await TaskModel.findOneAndDelete({
      id,
      organizationId: req.user.organizationId,
    });

    if (!deletedTask) {
      res.status(404).json({
        success: false,
        error: 'Task not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: deletedTask.id },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete task',
      timestamp: new Date(),
    });
  }
};

/**
 * Get task statistics for a project
 */
export const getTaskStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { projectId } = req.query;
    const query: Record<string, any> = { organizationId: req.user.organizationId };

    if (projectId) query.projectId = projectId;

    const tasks = await TaskModel.find(query);

    const stats = {
      total: tasks.length,
      pending: tasks.filter((t: any) => t.status === 'pending').length,
      assigned: tasks.filter((t: any) => t.status === 'assigned').length,
      inProgress: tasks.filter((t: any) => t.status === 'in_progress').length,
      completed: tasks.filter((t: any) => t.status === 'completed').length,
      blocked: tasks.filter((t: any) => t.status === 'blocked').length,
      completionRate: tasks.length > 0 ? Math.round((tasks.filter((t: any) => t.status === 'completed').length / tasks.length) * 100) : 0,
      overdue: tasks.filter((t: any) => t.dueDate && t.dueDate < new Date() && t.status !== 'completed').length,
      byPriority: {
        low: tasks.filter((t: any) => t.priority === 'low').length,
        medium: tasks.filter((t: any) => t.priority === 'medium').length,
        high: tasks.filter((t: any) => t.priority === 'high').length,
        urgent: tasks.filter((t: any) => t.priority === 'urgent').length,
      },
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task statistics',
      timestamp: new Date(),
    });
  }
};