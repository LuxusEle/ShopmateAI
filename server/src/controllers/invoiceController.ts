import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Invoice } from '../../../shared/types';
import { InvoiceModel } from '../models';
import { logger } from '../utils/logger';

/**
 * Get all invoices
 */
export const getAllInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { status, customerId, skip = 0, limit = 50 } = req.query;
    const query: Record<string, any> = { organizationId: req.user.organizationId };

    if (status) query.status = status;
    if (customerId) query.customerId = customerId;

    const invoices = await InvoiceModel.find(query)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ issueDate: -1 });

    const total = await InvoiceModel.countDocuments(query);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoices',
      timestamp: new Date(),
    });
  }
};

/**
 * Get a single invoice by ID
 */
export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
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
    const invoice = await InvoiceModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!invoice) {
      res.status(404).json({
        success: false,
        error: 'Invoice not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: invoice,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoice',
      timestamp: new Date(),
    });
  }
};

/**
 * Create a new invoice
 */
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const { customerId, projectId, lineItems, taxRate = 0, dueDate, notes } = req.body;

    if (!customerId || !lineItems || lineItems.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: customerId, lineItems',
        timestamp: new Date(),
      });
      return;
    }

    // Calculate amounts
    const subtotal = lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    const total = subtotal + taxAmount;

    const invoiceId = 'inv_' + uuidv4();

    const newInvoice = new InvoiceModel({
      id: invoiceId,
      organizationId: req.user.organizationId,
      customerId,
      projectId,
      invoiceNumber: `INV-${Date.now()}`,
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: 'draft',
      issueDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      notes,
      paymentHistory: [],
    });

    await newInvoice.save();

    res.status(201).json({
      success: true,
      data: newInvoice,
      message: 'Invoice created successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create invoice',
      timestamp: new Date(),
    });
  }
};

/**
 * Update an invoice
 */
export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
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

    // Recalculate amounts if lineItems changed
    if (updates.lineItems) {
      const subtotal = updates.lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
      const taxAmount = Math.round(subtotal * ((updates.taxRate || 0) / 100) * 100) / 100;
      updates.subtotal = subtotal;
      updates.taxAmount = taxAmount;
      updates.total = subtotal + taxAmount;
    }

    delete updates.id;
    delete updates.organizationId;
    delete updates.createdAt;
    delete updates.invoiceNumber;

    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedInvoice) {
      res.status(404).json({
        success: false,
        error: 'Invoice not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedInvoice,
      message: 'Invoice updated successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update invoice',
      timestamp: new Date(),
    });
  }
};

/**
 * Update invoice status
 */
export const updateInvoiceStatus = async (req: Request, res: Response): Promise<void> => {
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

    if (!status || !['draft', 'sent', 'paid', 'overdue', 'cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: draft, sent, paid, overdue, or cancelled',
        timestamp: new Date(),
      });
      return;
    }

    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        status,
        paidAt: status === 'paid' ? new Date() : null,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedInvoice) {
      res.status(404).json({
        success: false,
        error: 'Invoice not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: updatedInvoice,
      message: `Invoice status updated to ${status}`,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Update invoice status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update invoice status',
      timestamp: new Date(),
    });
  }
};

/**
 * Record payment on invoice
 */
export const recordPayment = async (req: Request, res: Response): Promise<void> => {
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
    const { amount, method = 'other', notes } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        error: 'Payment amount must be greater than 0',
        timestamp: new Date(),
      });
      return;
    }

    const invoice = await InvoiceModel.findOne({
      id,
      organizationId: req.user.organizationId,
    });

    if (!invoice) {
      res.status(404).json({
        success: false,
        error: 'Invoice not found',
        timestamp: new Date(),
      });
      return;
    }

    const totalPaid = (invoice.paymentHistory || []).reduce((sum: number, p: any) => sum + p.amount, 0) + amount;
    const status = totalPaid >= invoice.total ? 'paid' : invoice.status;

    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { id, organizationId: req.user.organizationId },
      {
        $push: {
          paymentHistory: {
            amount,
            date: new Date(),
            method,
            notes,
          },
        },
        status,
        paidAt: status === 'paid' ? new Date() : invoice.paidAt,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedInvoice,
      message: `Payment of $${amount} recorded successfully`,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record payment',
      timestamp: new Date(),
    });
  }
};

/**
 * Delete an invoice
 */
export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
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

    const deletedInvoice = await InvoiceModel.findOneAndDelete({
      id,
      organizationId: req.user.organizationId,
    });

    if (!deletedInvoice) {
      res.status(404).json({
        success: false,
        error: 'Invoice not found',
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      message: 'Invoice deleted successfully',
      data: { id: deletedInvoice.id },
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Delete invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete invoice',
      timestamp: new Date(),
    });
  }
};

/**
 * Get invoice statistics
 */
export const getInvoiceStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date(),
      });
      return;
    }

    const invoices = await InvoiceModel.find({ organizationId: req.user.organizationId });

    const stats = {
      total: invoices.length,
      totalRevenue: invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0),
      totalPaid: invoices.reduce((sum: number, inv: any) => sum + ((inv.paymentHistory || []).reduce((s: number, p: any) => s + p.amount, 0)), 0),
      totalOutstanding: invoices.reduce((sum: number, inv: any) => {
        const paid = (inv.paymentHistory || []).reduce((s: number, p: any) => s + p.amount, 0);
        return sum + Math.max(0, inv.total - paid);
      }, 0),
      byStatus: {
        draft: invoices.filter((i: any) => i.status === 'draft').length,
        sent: invoices.filter((i: any) => i.status === 'sent').length,
        paid: invoices.filter((i: any) => i.status === 'paid').length,
        overdue: invoices.filter((i: any) => i.status === 'overdue').length,
        cancelled: invoices.filter((i: any) => i.status === 'cancelled').length,
      },
      averageInvoiceValue: invoices.length > 0 
        ? Math.round((invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0) / invoices.length) * 100) / 100
        : 0,
      paidPercentage: invoices.length > 0
        ? Math.round((invoices.filter((i: any) => i.status === 'paid').length / invoices.length) * 100)
        : 0,
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Get invoice stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoice statistics',
      timestamp: new Date(),
    });
  }
};