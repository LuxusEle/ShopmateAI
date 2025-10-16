import mongoose, { Schema, Document } from 'mongoose';
import type { StaffMember } from '../../../shared/types';

export interface StaffDocument extends StaffMember, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema(
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
      unique: true,
      index: true,
    },
    phone: String,
    role: {
      type: String,
      enum: ['admin', 'manager', 'technician', 'designer', 'sales', 'accounts'],
      default: 'technician',
      index: true,
    },
    department: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave', 'terminated'],
      default: 'active',
      index: true,
    },
    skills: [String],
    certifications: [
      {
        name: String,
        issueDate: Date,
        expiryDate: Date,
        issuer: String,
      },
    ],
    availability: {
      hoursPerWeek: Number,
      currentLoadPercentage: Number,
      availableStartDate: Date,
    },
    workSchedule: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'seasonal'],
      default: 'full_time',
    },
    manager: {
      staffId: String,
      name: String,
      email: String,
    },
    hireDate: Date,
    terminationDate: Date,
    performanceRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    assignedProjects: [
      {
        projectId: String,
        role: String,
        assignedDate: Date,
        completedDate: Date,
      },
    ],
    currentTasks: [
      {
        taskId: String,
        title: String,
        status: String,
        dueDate: Date,
      },
    ],
    totalProjectsCompleted: {
      type: Number,
      default: 0,
    },
    totalHoursWorked: {
      type: Number,
      default: 0,
    },
    averageTaskCompletionTime: Number,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    notes: String,
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    lastLogin: Date,
    lastModifiedBy: String,
  },
  {
    timestamps: true,
    collection: 'staff',
  }
);

// Indexes for common queries
StaffSchema.index({ organizationId: 1, status: 1 });
StaffSchema.index({ role: 1 });
StaffSchema.index({ email: 1 });

export default mongoose.model<StaffDocument>('Staff', StaffSchema);
