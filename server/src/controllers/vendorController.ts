import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Vendor } from '../../../shared/types';
import { VendorModel } from '../models';
import { logger } from '../utils/logger';

/**
 * Get all vendors
 */
export const getAllVendors = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { category, status, skip = 0, limit = 50 } = req.query;
    const query: Record<string, any> = { organizationId: req.user.organizationId };

    if (category) query.category = category;
    if (status) query.status = status;

    const vendors = await VendorModel.find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ name: 1 });

    const total = await VendorModel.countDocuments(query);

    res.json({
      success: true,
      data: vendors,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vendors',
      timestamp: new Date(),
    });
  }
};

/**
 * Get a single vendor by ID
 */
export const getVendorById = async (req: Request, res: Response): Promise<void> => {
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
    const vendor = await VendorModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!vendor) {
      res.status(404).json({
        success: false,
        error: 'Vendor not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: vendor,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get vendor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vendor',
      timestamp: new Date(),
    });
  }
};

/**
 * Create a new vendor
 */
export const createVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { name, email, phone, address, category, products = [] } = req.body;

    if (!name || !email || !category) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, category',
        timestamp: new Date(),
      });
      return;
    }

    const vendorId = 'vendor_' + uuidv4();

    const newVendor = new VendorModel({
      id: vendorId,
      organizationId: req.user.organizationId,
      name,
      email,
      phone,
      address,
      category,
      products,
      status: 'active',
      rating: 0,
      totalTransactions: 0,
      contactPerson: {
        name: '',
        phone: '',
        email: '',
      },
    });

    await newVendor.save();

    res.status(201).json({
      success: true,
      data: newVendor,
      message: 'Vendor created successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Create vendor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create vendor',
      timestamp: new Date(),
    });
  }
};

/**
 * Update a vendor
 */
export const updateVendor = async (req: Request, res: Response): Promise<void> => {
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
    delete updates.totalTransactions;

    const updatedVendor = await VendorModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedVendor) {
      res.status(404).json({
        success: false,
        error: 'Vendor not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedVendor,
      message: 'Vendor updated successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update vendor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update vendor',
      timestamp: new Date(),
    });
  }
};

/**
 * Update vendor rating
 */
export const rateVendor = async (req: Request, res: Response): Promise<void> => {
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
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5',
        timestamp: new Date(),
      });
      return;
    }

    const vendor = await VendorModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!vendor) {
      res.status(404).json({
        success: false,
        error: 'Vendor not found',
        timestamp: new Date(),
      });
      return;
    }

    // Calculate new average rating
    const currentRating = vendor.rating || 0;
    const currentTransactions = vendor.totalTransactions || 0;
    const newAverageRating = (currentRating * currentTransactions + rating) / (currentTransactions + 1);

    const updatedVendor = await VendorModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        rating: Math.round(newAverageRating * 10) / 10,
        totalTransactions: currentTransactions + 1,
        $push: {
          reviews: {
            rating,
            feedback,
            date: new Date(),
          },
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedVendor,
      message: 'Vendor rating updated successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Rate vendor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to rate vendor',
      timestamp: new Date(),
    });
  }
};

/**
 * Delete a vendor
 */
export const deleteVendor = async (req: Request, res: Response): Promise<void> => {
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

    const deletedVendor = await VendorModel.findOneAndDelete({
      id,
      organizationId: req.user.organizationId,
    });

    if (!deletedVendor) {
      res.status(404).json({
        success: false,
        error: 'Vendor not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      message: 'Vendor deleted successfully',
      data: { id: deletedVendor.id },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Delete vendor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete vendor',
      timestamp: new Date(),
    });
  }
};

/**
 * Get vendor statistics
 */
export const getVendorStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const vendors = await VendorModel.find({ organizationId: req.user.organizationId });

    const stats = {
      total: vendors.length,
      active: vendors.filter((v: any) => v.status === 'active').length,
      inactive: vendors.filter((v: any) => v.status === 'inactive').length,
      byCategory: vendors.reduce((acc: Record<string, number>, v: any) => {
        acc[v.category] = (acc[v.category] || 0) + 1;
        return acc;
      }, {}),
      topRated: vendors
        .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5)
        .map((v: any) => ({
          id: v.id,
          name: v.name,
          rating: v.rating,
        })),
      averageRating: vendors.length > 0
        ? Math.round((vendors.reduce((sum: number, v: any) => sum + (v.rating || 0), 0) / vendors.length) * 10) / 10
        : 0,
      totalTransactions: vendors.reduce((sum: number, v: any) => sum + (v.totalTransactions || 0), 0),
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get vendor stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vendor statistics',
      timestamp: new Date(),
    });
  }
};
