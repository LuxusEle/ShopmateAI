import ProjectModel, { type ProjectDocument } from './Project';
import TaskModel, { type TaskDocument } from './Task';
import CustomerModel, { type CustomerDocument } from './Customer';
import InvoiceModel, { type InvoiceDocument } from './Invoice';
import StaffModel, { type StaffDocument } from './Staff';
import VendorModel, { type VendorDocument } from './Vendor';
import OrganizationModel, { type OrganizationDocument } from './Organization';
import WorkflowModel, { type WorkflowDocument } from './Workflow';

export {
  ProjectModel,
  TaskModel,
  CustomerModel,
  InvoiceModel,
  StaffModel,
  VendorModel,
  OrganizationModel,
  WorkflowModel,
};

export type {
  ProjectDocument,
  TaskDocument,
  CustomerDocument,
  InvoiceDocument,
  StaffDocument,
  VendorDocument,
  OrganizationDocument,
  WorkflowDocument,
};

// Convenience export for all models
export const Models = {
  Project: ProjectModel,
  Task: TaskModel,
  Customer: CustomerModel,
  Invoice: InvoiceModel,
  Staff: StaffModel,
  Vendor: VendorModel,
  Organization: OrganizationModel,
  Workflow: WorkflowModel,
};
