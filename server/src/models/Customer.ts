import mongoose, { Schema, Document } from 'mongoose';
import type { Customer } from '../../../shared/types';

export interface CustomerDocument extends Customer, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema(
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
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    phone: String,
    type: {
      type: String,
      enum: ['individual', 'business'],
      default: 'business',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    taxId: String,
    website: String,
    industry: String,
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    },
    notes: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'prospect', 'archived'],
      default: 'active',
      index: true,
    },
    primaryContact: {
      name: String,
      email: String,
      phone: String,
      role: String,
    },
    projects: [
      {
        projectId: String,
        name: String,
        status: String,
        value: Number,
      },
    ],
    totalProjectValue: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    averageProjectValue: Number,
    creditLimit: Number,
    currentBalance: {
      type: Number,
      default: 0,
    },
    paymentTerms: {
      type: String,
      default: 'net_30',
    },
    preferredPaymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'check', 'invoice'],
      default: 'invoice',
    },
    tags: [String],
    assignedSalesRep: {
      staffId: String,
      name: String,
      email: String,
    },
    lastInteractionDate: Date,
    contractEndDate: Date,
  },
  {
    timestamps: true,
    collection: 'customers',
  }
);

// Indexes for common queries
CustomerSchema.index({ organizationId: 1, status: 1 });
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ name: 'text' });

export default mongoose.model<CustomerDocument>('Customer', CustomerSchema);
