import mongoose, { Schema, Document } from 'mongoose';
import type { Invoice } from '../../../shared/types';

export interface InvoiceDocument extends Invoice, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    issueDate: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
    dueDate: {
      type: Date,
      index: true,
    },
    paidDate: Date,
    status: {
      type: String,
      enum: ['draft', 'sent', 'pending', 'partially_paid', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
      index: true,
    },
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        category: String,
        taxRate: Number,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      index: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    amountDue: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'check', 'cash'],
    },
    paymentTerms: {
      type: String,
      default: 'net_30',
    },
    notes: String,
    internalNotes: String,
    reminderSent: {
      type: Boolean,
      default: false,
    },
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    poNumber: String,
    reference: String,
  },
  {
    timestamps: true,
    collection: 'invoices',
  }
);

// Indexes for common queries
InvoiceSchema.index({ organizationId: 1, status: 1 });
InvoiceSchema.index({ customerId: 1, status: 1 });
InvoiceSchema.index({ projectId: 1 });
InvoiceSchema.index({ dueDate: 1, status: 1 });

export default mongoose.model<InvoiceDocument>('Invoice', InvoiceSchema);
