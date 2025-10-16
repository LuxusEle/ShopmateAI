import mongoose, { Schema, Document } from 'mongoose';

export interface WorkflowDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  organizationId: string;
  projectId: string;
  currentStage: string;
  stageHistory: Array<{
    stage: string;
    enteredAt: Date;
    exitedAt?: Date;
    duration: number;
  }>;
  automationTriggered: Array<{
    automationId: string;
    triggeredAt: Date;
    result: 'success' | 'failed' | 'pending';
    details: string;
  }>;
  aiAssistantActions: Array<{
    actionId: string;
    timestamp: Date;
    action: string;
    impact: string;
  }>;
  timeline: {
    estimatedStart: Date;
    estimatedEnd: Date;
    actualStart: Date;
    actualEnd: Date;
    totalHours: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowSchema = new Schema(
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
      unique: true,
      index: true,
    },
    currentStage: {
      type: String,
      required: true,
      index: true,
    },
    stageHistory: [
      {
        stage: String,
        enteredAt: Date,
        exitedAt: Date,
        duration: Number,
      },
    ],
    automationTriggered: [
      {
        automationId: String,
        triggeredAt: Date,
        result: {
          type: String,
          enum: ['success', 'failed', 'pending'],
        },
        details: String,
      },
    ],
    aiAssistantActions: [
      {
        actionId: String,
        timestamp: Date,
        action: String,
        impact: String,
      },
    ],
    timeline: {
      estimatedStart: Date,
      estimatedEnd: Date,
      actualStart: Date,
      actualEnd: Date,
      totalHours: Number,
    },
  },
  {
    timestamps: true,
    collection: 'workflows',
  }
);

WorkflowSchema.index({ organizationId: 1, projectId: 1 });
WorkflowSchema.index({ currentStage: 1 });

export default mongoose.model<WorkflowDocument>('Workflow', WorkflowSchema);
