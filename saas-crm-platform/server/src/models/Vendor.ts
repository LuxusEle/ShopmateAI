import mongoose, { Schema, Document } from 'mongoose';

export interface VendorDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  category: string;
  products: string[];
  rating: number;
  status: 'active' | 'inactive' | 'archived';
  paymentTerms: string;
  minOrderValue: number;
  leadTime: number;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema(
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
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    category: {
      type: String,
      enum: ['material_supplier', 'service_provider', 'equipment', 'software', 'logistics'],
      required: true,
      index: true,
    },
    products: [String],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
      index: true,
    },
    paymentTerms: {
      type: String,
      default: 'net_30',
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    leadTime: {
      type: Number,
      default: 0,
    },
    contactPerson: {
      name: String,
      email: String,
      phone: String,
    },
    notes: String,
  },
  {
    timestamps: true,
    collection: 'vendors',
  }
);

VendorSchema.index({ organizationId: 1, category: 1 });

export default mongoose.model<VendorDocument>('Vendor', VendorSchema);
