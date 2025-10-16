import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Staff } from '../../../shared/types';
import { StaffModel } from '../models';
import { logger } from '../utils/logger';

/**
 * Get all staff members
 */
export const getAllStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { department, status, skip = 0, limit = 50 } = req.query;
    const query: Record<string, any> = { organizationId: req.user.organizationId };

    if (department) query.department = department;
    if (status) query.status = status;

    const staff = await StaffModel.find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ name: 1 });

    const total = await StaffModel.countDocuments(query);

    res.json({
      success: true,
      data: staff,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get staff error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch staff',
      timestamp: new Date(),
    });
  }
};

/**
 * Get a single staff member by ID
 */
export const getStaffById = async (req: Request, res: Response): Promise<void> => {
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
    const staffMember = await StaffModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!staffMember) {
      res.status(404).json({
        success: false,
        error: 'Staff member not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: staffMember,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get staff error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch staff member',
      timestamp: new Date(),
    });
  }
};

/**
 * Create a new staff member
 */
export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { name, email, phone, role, department, skills = [], certifications = [] } = req.body;

    if (!name || !email || !role) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, role',
        timestamp: new Date(),
      });
      return;
    }

    const staffId = 'staff_' + uuidv4();

    const newStaff = new StaffModel({
      id: staffId,
      organizationId: req.user.organizationId,
      name,
      email,
      phone,
      role,
      department,
      skills,
      certifications,
      status: 'active',
      hireDate: new Date(),
      performance: {
        tasksCompleted: 0,
        averageRating: 0,
        specializations: [],
      },
    });

    await newStaff.save();

    res.status(201).json({
      success: true,
      data: newStaff,
      message: 'Staff member created successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Create staff error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create staff member',
      timestamp: new Date(),
    });
  }
};

/**
 * Update a staff member
 */
export const updateStaff = async (req: Request, res: Response): Promise<void> => {
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
    delete updates.hireDate;

    const updatedStaff = await StaffModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedStaff) {
      res.status(404).json({
        success: false,
        error: 'Staff member not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedStaff,
      message: 'Staff member updated successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update staff error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update staff member',
      timestamp: new Date(),
    });
  }
};

/**
 * Add skill to staff member
 */
export const addSkill = async (req: Request, res: Response): Promise<void> => {
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
    const { skillName, proficiencyLevel = 'intermediate' } = req.body;

    if (!skillName) {
      res.status(400).json({
        success: false,
        error: 'Skill name is required',
        timestamp: new Date(),
      });
      return;
    }

    const updatedStaff = await StaffModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        $push: {
          skills: {
            name: skillName,
            proficiencyLevel,
            yearsOfExperience: 0,
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedStaff) {
      res.status(404).json({
        success: false,
        error: 'Staff member not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedStaff,
      message: 'Skill added successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add skill',
      timestamp: new Date(),
    });
  }
};

/**
 * Add certification to staff member
 */
export const addCertification = async (req: Request, res: Response): Promise<void> => {
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
    const { certName, issuer, expiryDate } = req.body;

    if (!certName) {
      res.status(400).json({
        success: false,
        error: 'Certification name is required',
        timestamp: new Date(),
      });
      return;
    }

    const updatedStaff = await StaffModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        $push: {
          certifications: {
            name: certName,
            issuer,
            obtainedDate: new Date(),
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedStaff) {
      res.status(404).json({
        success: false,
        error: 'Staff member not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedStaff,
      message: 'Certification added successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Add certification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add certification',
      timestamp: new Date(),
    });
  }
};

/**
 * Delete a staff member
 */
export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
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

    const deletedStaff = await StaffModel.findOneAndDelete({
      id,
      organizationId: req.user.organizationId,
    });

    if (!deletedStaff) {
      res.status(404).json({
        success: false,
        error: 'Staff member not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      message: 'Staff member deleted successfully',
      data: { id: deletedStaff.id },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Delete staff error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete staff member',
      timestamp: new Date(),
    });
  }
};

/**
 * Get staff statistics
 */
export const getStaffStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const staff = await StaffModel.find({ organizationId: req.user.organizationId });

    const stats = {
      total: staff.length,
      active: staff.filter((s: any) => s.status === 'active').length,
      inactive: staff.filter((s: any) => s.status === 'inactive').length,
      byRole: staff.reduce((acc: Record<string, number>, s: any) => {
        acc[s.role] = (acc[s.role] || 0) + 1;
        return acc;
      }, {}),
      byDepartment: staff.reduce((acc: Record<string, number>, s: any) => {
        if (s.department) acc[s.department] = (acc[s.department] || 0) + 1;
        return acc;
      }, {}),
      totalTasksCompleted: staff.reduce((sum: number, s: any) => sum + (s.performance?.tasksCompleted || 0), 0),
      averageRating: staff.length > 0
        ? Math.round((staff.reduce((sum: number, s: any) => sum + (s.performance?.averageRating || 0), 0) / staff.length) * 10) / 10
        : 0,
      withExpiredCerts: staff.filter((s: any) => {
        return (s.certifications || []).some((c: any) => c.expiryDate && c.expiryDate < new Date());
      }).length,
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get staff stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch staff statistics',
      timestamp: new Date(),
    });
  }
};
