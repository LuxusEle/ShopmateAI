import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Project } from '../../../shared/types';
import { ProjectModel } from '../models';
import { logger } from '../utils/logger';

/**
 * Get all projects for an organization
 */
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { status, priority, skip = 0, limit = 20 } = req.query;
    const query: Record<string, any> = { organizationId: req.user.organizationId };

    // Add optional filters
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const projects = await ProjectModel.find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await ProjectModel.countDocuments(query);

    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      timestamp: new Date(),
    });
  }
};

/**
 * Get a single project by ID
 */
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
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
    const project = await ProjectModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: project,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
      timestamp: new Date(),
    });
  }
};

/**
 * Create a new project
 */
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { customerId, name, description, budget, estimatedDuration } = req.body;

    // Validation
    if (!customerId || !name || !budget) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: customerId, name, budget',
        timestamp: new Date(),
      });
      return;
    }

    const projectId = 'proj_' + uuidv4();

    const newProject = new ProjectModel({
      id: projectId,
      organizationId: req.user.organizationId,
      customerId,
      name,
      description,
      budget,
      estimatedDuration: estimatedDuration || 160, // 1 week default
      status: 'active',
      priority: 'medium',
      currentStage: 'contact',
      startDate: new Date(),
      expectedCompletionDate: new Date(Date.now() + estimatedDuration * 3600000),
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      data: newProject,
      message: 'Project created successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      timestamp: new Date(),
    });
  }
};

/**
 * Update a project
 */
export const updateProject = async (req: Request, res: Response): Promise<void> => {
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

    const updatedProject = await ProjectModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedProject) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
      timestamp: new Date(),
    });
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
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

    const deletedProject = await ProjectModel.findOneAndDelete({
      id,
      organizationId: req.user.organizationId,
    });

    if (!deletedProject) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: { id: deletedProject.id },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
      timestamp: new Date(),
    });
  }
};

/**
 * Update project status
 */
export const updateProjectStatus = async (req: Request, res: Response): Promise<void> => {
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

    if (!status || !['active', 'on_hold', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: active, on_hold, completed, or cancelled',
        timestamp: new Date(),
      });
      return;
    }

    const updatedProject = await ProjectModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        status,
        actualCompletionDate: status === 'completed' ? new Date() : null,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedProject) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedProject,
      message: `Project status updated to ${status}`,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update project status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project status',
      timestamp: new Date(),
    });
  }
};

/**
 * Get project statistics
 */
export const getProjectStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const projects = await ProjectModel.find({
      organizationId: req.user.organizationId,
    });

    const stats = {
      total: projects.length,
      active: projects.filter((p) => p.status === 'active').length,
      completed: projects.filter((p) => p.status === 'completed').length,
      onHold: projects.filter((p) => p.status === 'on_hold').length,
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
      averageBudget: projects.length > 0 ? projects.reduce((sum, p) => sum + (p.budget || 0), 0) / projects.length : 0,
      byPriority: {
        low: projects.filter((p) => p.priority === 'low').length,
        medium: projects.filter((p) => p.priority === 'medium').length,
        high: projects.filter((p) => p.priority === 'high').length,
        urgent: projects.filter((p) => p.priority === 'urgent').length,
      },
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project statistics',
      timestamp: new Date(),
    });
  }
};
