import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Customer } from '../../../shared/types';
import { CustomerModel } from '../models';
import { logger } from '../utils/logger';

/**
 * Get all customers
 */
export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { segment, status, skip = 0, limit = 50 } = req.query;
    const query: Record<string, any> = { organizationId: req.user.organizationId };

    if (segment) query.segment = segment;
    if (status) query.status = status;

    const customers = await CustomerModel.find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await CustomerModel.countDocuments(query);

    res.json({
      success: true,
      data: customers,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customers',
      timestamp: new Date(),
    });
  }
};

/**
 * Get a single customer by ID
 */
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
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
    const customer = await CustomerModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: customer,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer',
      timestamp: new Date(),
    });
  }
};

/**
 * Create a new customer
 */
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { name, email, phone, address, businessType, segment = 'standard' } = req.body;

    // Validation
    if (!name || !email) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email',
        timestamp: new Date(),
      });
      return;
    }

    const customerId = 'cust_' + uuidv4();

    const newCustomer = new CustomerModel({
      id: customerId,
      organizationId: req.user.organizationId,
      name,
      email,
      phone,
      address,
      businessType,
      segment,
      status: 'active',
      interactions: [],
      communicationHistory: [],
      tags: [],
    });

    await newCustomer.save();

    res.status(201).json({
      success: true,
      data: newCustomer,
      message: 'Customer created successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create customer',
      timestamp: new Date(),
    });
  }
};

/**
 * Update a customer
 */
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
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

    const updatedCustomer = await CustomerModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedCustomer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedCustomer,
      message: 'Customer updated successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update customer',
      timestamp: new Date(),
    });
  }
};

/**
 * Add interaction to customer history
 */
export const addInteraction = async (req: Request, res: Response): Promise<void> => {
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
    const { type, notes } = req.body;

    if (!type) {
      res.status(400).json({
        success: false,
        error: 'Interaction type is required',
        timestamp: new Date(),
      });
      return;
    }

    const updatedCustomer = await CustomerModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        $push: {
          interactions: {
            type,
            date: new Date(),
            notes,
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedCustomer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedCustomer,
      message: 'Interaction added successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Add interaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add interaction',
      timestamp: new Date(),
    });
  }
};

/**
 * Delete a customer
 */
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
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

    const deletedCustomer = await CustomerModel.findOneAndDelete({
      id,
      organizationId: req.user.organizationId,
    });

    if (!deletedCustomer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully',
      data: { id: deletedCustomer.id },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete customer',
      timestamp: new Date(),
    });
  }
};

/**
 * Get customer statistics
 */
export const getCustomerStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const customers = await CustomerModel.find({ organizationId: req.user.organizationId });

    const stats = {
      total: customers.length,
      active: customers.filter((c: any) => c.status === 'active').length,
      inactive: customers.filter((c: any) => c.status === 'inactive').length,
      bySegment: {
        premium: customers.filter((c: any) => c.segment === 'premium').length,
        standard: customers.filter((c: any) => c.segment === 'standard').length,
        basic: customers.filter((c: any) => c.segment === 'basic').length,
      },
      totalInteractions: customers.reduce((sum: number, c: any) => sum + (c.interactions?.length || 0), 0),
      averageInteractionsPerCustomer: customers.length > 0 
        ? Math.round(customers.reduce((sum: number, c: any) => sum + (c.interactions?.length || 0), 0) / customers.length)
        : 0,
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer statistics',
      timestamp: new Date(),
    });
  }
};