import mongoose, { Schema, Document } from 'mongoose';
import type { Task } from '../../../shared/types';

export interface TaskDocument extends Task, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema(
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
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in_progress', 'completed', 'blocked'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    assignedTo: {
      staffId: String,
      name: String,
      email: String,
    },
    dueDate: {
      type: Date,
      index: true,
    },
    estimatedHours: Number,
    actualHours: Number,
    requiredSkills: [String],
    automatedBy: {
      type: String,
      enum: ['ai_assistant', 'workflow_engine', 'user', 'system'],
      default: 'user',
    },
    dependencies: [
      {
        taskId: String,
        dependencyType: {
          type: String,
          enum: ['must_complete_first', 'can_start_after', 'related_to'],
        },
      },
    ],
    subtasks: [
      {
        id: String,
        title: String,
        completed: Boolean,
        completedAt: Date,
      },
    ],
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: Date,
        type: String,
      },
    ],
    completedAt: Date,
    startDate: Date,
    notes: String,
    tags: [String],
  },
  {
    timestamps: true,
    collection: 'tasks',
  }
);

// Indexes for common queries
TaskSchema.index({ projectId: 1, status: 1 });
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ dueDate: 1, status: 1 });

export default mongoose.model<TaskDocument>('Task', TaskSchema);
