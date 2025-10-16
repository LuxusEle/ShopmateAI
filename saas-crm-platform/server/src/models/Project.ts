import mongoose, { Schema, Document } from 'mongoose';
import type { Project, WorkflowStageId } from '../../../shared/types';

export interface ProjectDocument extends Project, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema(
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
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    currentStage: {
      type: String,
      enum: [
        'contact',
        'lead',
        'gps_location',
        'visit_scheduled',
        'design_concept',
        'design_revision_1',
        'design_revision_2',
        'design_final',
        'bom_created',
        'quote_provided',
        'customer_discussion',
        'customer_revisions',
        'agreement_signed',
        'project_started',
        'materials_ordered',
        'cnc_setup',
        'cnc_in_progress',
        'cnc_quality_check',
        'assembly',
        'quality_check',
        'shipping_prepared',
        'shipped',
        'delivery_scheduled',
        'installation',
        'completion',
      ],
      default: 'contact',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'on_hold', 'completed', 'cancelled'],
      default: 'active',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    budget: {
      type: Number,
      required: true,
      index: true,
    },
    estimatedDuration: {
      type: Number,
      required: true,
    },
    actualDuration: Number,
    assignedStaff: [
      {
        staffId: String,
        name: String,
        role: String,
        assignedDate: Date,
      },
    ],
    bill: {
      items: [
        {
          description: String,
          quantity: Number,
          unitPrice: Number,
          totalPrice: Number,
        },
      ],
      subtotal: Number,
      tax: Number,
      total: Number,
      status: {
        type: String,
        enum: ['draft', 'sent', 'pending', 'paid', 'overdue'],
        default: 'draft',
      },
    },
    profitMargin: Number,
    laborCosts: Number,
    materialCosts: Number,
    overheadCosts: Number,
    totalCost: Number,
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      latitude: Number,
      longitude: Number,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: [Number], // [longitude, latitude]
      },
    },
    notes: String,
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: Date,
        type: String,
      },
    ],
    timeline: [
      {
        stage: String,
        startDate: Date,
        endDate: Date,
        durationHours: Number,
      },
    ],
    startDate: Date,
    expectedCompletionDate: Date,
    actualCompletionDate: Date,
  },
  {
    timestamps: true,
    collection: 'projects',
  }
);

// Index for geospatial queries
ProjectSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<ProjectDocument>('Project', ProjectSchema);
