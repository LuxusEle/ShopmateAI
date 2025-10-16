import mongoose, { Schema, Document } from 'mongoose';

export interface OrganizationDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  name: string;
  industry: string;
  status: 'active' | 'inactive' | 'trial' | 'archived';
  owner: {
    id: string;
    name: string;
    email: string;
  };
  subscription: {
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'inactive' | 'trial';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
  };
  billing: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    taxId?: string;
  };
  maxProjects: number;
  maxStaff: number;
  maxCustomers: number;
  teamMembers: Array<{
    staffId: string;
    name: string;
    email: string;
    role: string;
  }>;
  logo?: string;
  website?: string;
  phone?: string;
  settings: {
    timezone: string;
    currency: string;
    language: string;
    defaultTaskDuration: number;
    autoAssignTasks: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    industry: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'trial', 'archived'],
      default: 'active',
      index: true,
    },
    owner: {
      id: String,
      name: String,
      email: String,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'starter', 'professional', 'enterprise'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'trial'],
        default: 'trial',
      },
      startDate: Date,
      endDate: Date,
      autoRenew: {
        type: Boolean,
        default: true,
      },
    },
    billing: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      taxId: String,
    },
    maxProjects: {
      type: Number,
      default: 10,
    },
    maxStaff: {
      type: Number,
      default: 5,
    },
    maxCustomers: {
      type: Number,
      default: 20,
    },
    teamMembers: [
      {
        staffId: String,
        name: String,
        email: String,
        role: String,
      },
    ],
    logo: String,
    website: String,
    phone: String,
    settings: {
      timezone: {
        type: String,
        default: 'UTC',
      },
      currency: {
        type: String,
        default: 'USD',
      },
      language: {
        type: String,
        default: 'en',
      },
      defaultTaskDuration: {
        type: Number,
        default: 8,
      },
      autoAssignTasks: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    collection: 'organizations',
  }
);

OrganizationSchema.index({ id: 1 });
OrganizationSchema.index({ status: 1 });

export default mongoose.model<OrganizationDocument>('Organization', OrganizationSchema);
