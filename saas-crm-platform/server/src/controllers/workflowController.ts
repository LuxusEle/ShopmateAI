import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Workflow } from '../../../shared/types';
import { WorkflowModel } from '../models';
import { logger } from '../utils/logger';

/**
 * Get all workflows
 */
export const getAllWorkflows = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { projectId, status, skip = 0, limit = 50 } = req.query;
    const query: Record<string, any> = { organizationId: req.user.organizationId };

    if (projectId) query.projectId = projectId;
    if (status) query.currentStage = status;

    const workflows = await WorkflowModel.find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await WorkflowModel.countDocuments(query);

    res.json({
      success: true,
      data: workflows,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get workflows error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workflows',
      timestamp: new Date(),
    });
  }
};

/**
 * Get a single workflow by ID
 */
export const getWorkflowById = async (req: Request, res: Response): Promise<void> => {
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
    const workflow = await WorkflowModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!workflow) {
      res.status(404).json({
        success: false,
        error: 'Workflow not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: workflow,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get workflow error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workflow',
      timestamp: new Date(),
    });
  }
};

/**
 * Create a new workflow
 */
export const createWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { projectId, name, description, stages = [] } = req.body;

    if (!projectId || !name) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: projectId, name',
        timestamp: new Date(),
      });
      return;
    }

    const workflowId = 'workflow_' + uuidv4();

    const newWorkflow = new WorkflowModel({
      id: workflowId,
      organizationId: req.user.organizationId,
      projectId,
      name,
      description,
      stages: stages.length > 0 ? stages : [
        { stageName: 'Planning', order: 1, duration: 3 },
        { stageName: 'Execution', order: 2, duration: 5 },
        { stageName: 'Review', order: 3, duration: 2 },
        { stageName: 'Complete', order: 4, duration: 0 },
      ],
      currentStage: 'Planning',
      stageHistory: [],
      completionPercentage: 0,
    });

    await newWorkflow.save();

    res.status(201).json({
      success: true,
      data: newWorkflow,
      message: 'Workflow created successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Create workflow error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create workflow',
      timestamp: new Date(),
    });
  }
};

/**
 * Update a workflow
 */
export const updateWorkflow = async (req: Request, res: Response): Promise<void> => {
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

    delete updates.id;
    delete updates.organizationId;
    delete updates.createdAt;
    delete updates.stageHistory;

    const updatedWorkflow = await WorkflowModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedWorkflow) {
      res.status(404).json({
        success: false,
        error: 'Workflow not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedWorkflow,
      message: 'Workflow updated successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update workflow error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update workflow',
      timestamp: new Date(),
    });
  }
};

/**
 * Transition workflow to next stage
 */
export const transitionStage = async (req: Request, res: Response): Promise<void> => {
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
    const { nextStage, notes } = req.body;

    if (!nextStage) {
      res.status(400).json({
        success: false,
        error: 'Next stage is required',
        timestamp: new Date(),
      });
      return;
    }

    const workflow = await WorkflowModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!workflow) {
      res.status(404).json({
        success: false,
        error: 'Workflow not found',
        timestamp: new Date(),
      });
      return;
    }

    // Calculate completion percentage
    const totalStages = workflow.stages.length;
    const nextStageOrder = workflow.stages.find((s: any) => s.stageName === nextStage)?.order || 0;
    const completionPercentage = Math.round((nextStageOrder / totalStages) * 100);

    const updatedWorkflow = await WorkflowModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        currentStage: nextStage,
        completionPercentage,
        $push: {
          stageHistory: {
            fromStage: workflow.currentStage,
            toStage: nextStage,
            timestamp: new Date(),
            notes,
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedWorkflow,
      message: `Workflow transitioned to ${nextStage}`,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Transition stage error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transition stage',
      timestamp: new Date(),
    });
  }
};

/**
 * Add stage to workflow
 */
export const addStage = async (req: Request, res: Response): Promise<void> => {
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
    const { stageName, duration = 0 } = req.body;

    if (!stageName) {
      res.status(400).json({
        success: false,
        error: 'Stage name is required',
        timestamp: new Date(),
      });
      return;
    }

    const workflow = await WorkflowModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!workflow) {
      res.status(404).json({
        success: false,
        error: 'Workflow not found',
        timestamp: new Date(),
      });
      return;
    }

    const newOrder = (workflow.stages || []).length + 1;

    const updatedWorkflow = await WorkflowModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        $push: {
          stages: {
            stageName,
            order: newOrder,
            duration,
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedWorkflow,
      message: 'Stage added successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Add stage error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add stage',
      timestamp: new Date(),
    });
  }
};

/**
 * Delete a workflow
 */
export const deleteWorkflow = async (req: Request, res: Response): Promise<void> => {
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

    const deletedWorkflow = await WorkflowModel.findOneAndDelete({
      id,
      organizationId: req.user.organizationId,
    });

    if (!deletedWorkflow) {
      res.status(404).json({
        success: false,
        error: 'Workflow not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      message: 'Workflow deleted successfully',
      data: { id: deletedWorkflow.id },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Delete workflow error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete workflow',
      timestamp: new Date(),
    });
  }
};

/**
 * Get workflow statistics
 */
export const getWorkflowStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const workflows = await WorkflowModel.find({ organizationId: req.user.organizationId });

    const stats = {
      total: workflows.length,
      active: workflows.filter((w: any) => w.currentStage !== 'Complete').length,
      completed: workflows.filter((w: any) => w.currentStage === 'Complete').length,
      averageCompletion: workflows.length > 0
        ? Math.round((workflows.reduce((sum: number, w: any) => sum + (w.completionPercentage || 0), 0) / workflows.length))
        : 0,
      byStage: workflows.reduce((acc: Record<string, number>, w: any) => {
        const stage = w.currentStage || 'Unknown';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {}),
      totalTransitions: workflows.reduce((sum: number, w: any) => sum + (w.stageHistory?.length || 0), 0),
      bottlenecks: workflows
        .filter((w: any) => w.completionPercentage < 30)
        .map((w: any) => ({
          id: w.id,
          name: w.name,
          currentStage: w.currentStage,
          completion: w.completionPercentage,
        })),
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get workflow stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workflow statistics',
      timestamp: new Date(),
    });
  }
};
