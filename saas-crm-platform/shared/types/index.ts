// ============================================
// WORKFLOW & STAGE MANAGEMENT TYPES
// ============================================

export type WorkflowStageId = 
  | 'contact'
  | 'lead_creation'
  | 'gps_mapping'
  | 'visit_arrangement'
  | 'site_visit'
  | 'design_concepts'
  | 'detailed_design'
  | 'bom_generation'
  | 'quotation'
  | 'discussion'
  | 'revisions'
  | 'final_quote'
  | 'agreement'
  | 'project_creation'
  | 'invoice_generation'
  | 'bom_verification'
  | 'purchase_orders'
  | 'rm_payment'
  | 'expense_tracking'
  | 'manufacturing'
  | 'final_payments'
  | 'delivery'
  | 'installation'
  | 'service_payments'
  | 'completion';

export interface WorkflowStage {
  id: WorkflowStageId;
  name: string;
  description: string;
  displayOrder: number;
  requiredActions: string[];
  nextStage?: WorkflowStageId;
  previousStage?: WorkflowStageId;
  aiActions: AIAction[];
  automationRules: AutomationRule[];
  estimatedDuration: number; // in hours
  isManufacturingPhase: boolean;
}

export interface AIAction {
  id: string;
  type: 'greeting' | 'advice' | 'recommendation' | 'warning' | 'celebration';
  message: string;
  autoExecute: boolean;
  requiresApproval: boolean;
  triggerCondition?: string;
}

export interface AutomationRule {
  id: string;
  condition: string;
  action: string;
  enabled: boolean;
  priority: number;
}

// ============================================
// CUSTOMER & LEAD TYPES
// ============================================

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
  address: string;
  proximity: number; // in km for assignment
}

export interface CustomerPreferences {
  communicationPreference: 'email' | 'sms' | 'whatsapp' | 'call';
  paymentTerms: 'upfront' | 'partial' | 'ondelivery' | 'installment';
  customizationLevel: 'standard' | 'customized' | 'premium';
}

export interface Customer {
  id: string;
  name: string;
  contact: ContactInfo;
  location: GPSLocation;
  leadSource: string;
  assignedStaff: string; // staff ID
  currentStage: WorkflowStageId;
  preferences: CustomerPreferences;
  leadCreatedAt: Date;
  lastInteraction: Date;
  notes: string;
  metadata?: Record<string, any>;
}

// ============================================
// DESIGN & BOM TYPES
// ============================================

export interface Design {
  id: string;
  projectId: string;
  title: string;
  description: string;
  designType: 'concept' | 'detailed' | 'technical';
  fileUrl: string;
  fileFormat: string; // pdf, dxf, dwg, etc.
  version: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  estimatedCost: number;
  estimatedDuration: number;
}

export interface BOMItem {
  id: string;
  designation: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  vendor?: string;
  category: 'material' | 'service' | 'component';
  leadTime: number; // in days
  notes?: string;
}

export interface BillOfMaterials {
  id: string;
  projectId: string;
  version: number;
  items: BOMItem[];
  totalMaterialCost: number;
  totalServiceCost: number;
  totalDirectCost: number;
  contingency: number; // percentage
  finalCost: number;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  status: 'draft' | 'pending' | 'approved' | 'locked';
}

export interface CNCSpecification {
  designFile: string;
  machineType: string;
  materialType: string;
  cuttingSpeed: number;
  feedRate: number;
  toolType: string;
  estimatedMachineTime: number; // in minutes
  labels?: {
    partNumber: string;
    quantity: number;
    material: string;
    customText?: string;
  }[];
}

// ============================================
// PROJECT & QUOTE TYPES
// ============================================

export interface Quote {
  id: string;
  projectId: string;
  customerId: string;
  bomId: string;
  version: number;
  laborCost: number;
  overheadCost: number;
  profit: number;
  profitMargin: number;
  discount: number;
  tax: number;
  totalAmount: number;
  validFrom: Date;
  validUntil: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  sentAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  revisions: QuoteRevision[];
}

export interface QuoteRevision {
  id: string;
  revisionNumber: number;
  changes: string;
  createdAt: Date;
  createdBy: string;
}

export interface Project {
  id: string;
  customerId: string;
  name: string;
  description: string;
  currentStage: WorkflowStageId;
  designs: Design[];
  bom: BillOfMaterials;
  quotes: Quote[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  expenses: Expense[];
  cncSpecifications?: CNCSpecification;
  timeline: ProjectTimeline;
  profitCalculation: ProfitAnalysis;
  media: MediaAsset[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignedTeam: string[]; // staff IDs
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

export interface ProjectTimeline {
  estimatedStart: Date;
  actualStart?: Date;
  estimatedEnd: Date;
  actualEnd?: Date;
  currentPhase: WorkflowStageId;
  phaseCompletionDates: Record<WorkflowStageId, Date>;
  delays: Delay[];
  completionPercentage: number;
}

export interface Delay {
  id: string;
  phase: WorkflowStageId;
  reason: string;
  additionalDays: number;
  reportedAt: Date;
  reportedBy: string;
}

// ============================================
// FINANCIAL TYPES
// ============================================

export interface Invoice {
  id: string;
  projectId: string;
  invoiceNumber: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paidAmount: number;
  paidDate?: Date;
  paymentMethod?: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category: 'labor' | 'material' | 'service' | 'other';
}

export interface PurchaseOrder {
  id: string;
  projectId: string;
  vendorId: string;
  poNumber: string;
  items: POItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'paid';
  issueDate: Date;
  expectedDelivery: Date;
  actualDelivery?: Date;
  paymentTerms: string;
  paymentStatus: 'pending' | 'partial' | 'paid';
}

export interface POItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity?: number;
}

export interface Expense {
  id: string;
  projectId: string;
  description: string;
  category: 'labor' | 'material' | 'equipment' | 'service' | 'transport' | 'other';
  amount: number;
  vendor?: string;
  date: Date;
  receipt?: string;
  status: 'pending' | 'approved' | 'reimbursed';
  approvedBy?: string;
  approvedAt?: Date;
}

export interface ProfitAnalysis {
  projectId: string;
  totalRevenue: number;
  directCosts: number; // materials + services
  laborCosts: number;
  overheadCosts: number;
  totalCosts: number;
  grossProfit: number;
  grossMargin: number;
  netProfit: number;
  netMargin: number;
  costBreakdown: {
    materials: number;
    services: number;
    labor: number;
    overhead: number;
    other: number;
  };
  breakEvenDate?: Date;
  profitabilityStatus: 'profitable' | 'breakeven' | 'loss';
  risksIdentified: string[];
  optimizationOpportunities: string[];
}

// ============================================
// VENDOR & SERVICE TYPES
// ============================================

export interface Vendor {
  id: string;
  name: string;
  contact: ContactInfo;
  type: 'material_supplier' | 'service_provider' | 'both';
  specializations: string[];
  ratingScore: number; // 1-5
  totalDeals: number;
  onTimeDelivery: number; // percentage
  qualityRating: number; // 1-5
  costCompetitiveness: number; // 1-5
  paymentTerms: string;
  leadTime: number; // in days
  minimumOrder?: number;
  isActive: boolean;
  createdAt: Date;
  lastInteraction: Date;
}

export interface ServiceContractor {
  id: string;
  name: string;
  contact: ContactInfo;
  specializations: string[];
  certifications: string[];
  experienceYears: number;
  ratingScore: number; // 1-5
  availableHours: number; // per week
  hourlyRate: number;
  description: string;
  portfolio?: string[]; // URLs to project examples
  isActive: boolean;
  createdAt: Date;
}

// ============================================
// TASK & AUTOMATION TYPES
// ============================================

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  stage: WorkflowStageId;
  type: 'design' | 'manufacturing' | 'review' | 'approval' | 'delivery' | 'other';
  assignedTo: string; // staff ID
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked';
  estimatedHours: number;
  actualHours: number;
  startedAt?: Date;
  completedAt?: Date;
  dueDate: Date;
  dependencies: string[]; // task IDs
  aiRecommendations: string[];
  createdAt: Date;
  updatedAt: Date;
  blockingReasons?: string[];
}

export interface JobDescription {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';
  stagesHandled: WorkflowStageId[];
  maxConcurrentTasks: number;
  trainingRequired?: string[];
  isActive: boolean;
}

export interface AutomationConfig {
  id: string;
  organizationId: string;
  jobDescriptions: JobDescription[];
  automationRules: WorkflowAutomationRule[];
  taskFlowConfig: TaskFlowConfiguration;
  aiInterventionPoints: AIIntervention[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowAutomationRule {
  id: string;
  name: string;
  trigger: 'stage_complete' | 'time_based' | 'manual' | 'ai_recommended';
  condition: string;
  action: 'auto_assign' | 'notify' | 'escalate' | 'create_task';
  targetRole?: string;
  priority: number;
  enabled: boolean;
}

export interface TaskFlowConfiguration {
  sequentialFlow: boolean;
  autoAssignment: boolean;
  loadBalancing: boolean;
  estimatedCycleTimes: Record<WorkflowStageId, number>; // in hours
  bottleneckThreshold: number; // number of queued tasks
}

export interface AIIntervention {
  id: string;
  stage: WorkflowStageId;
  type: 'suggestion' | 'warning' | 'escalation' | 'coaching';
  triggerCondition: string;
  message: string;
  recommendedAction?: string;
  enabled: boolean;
}

// ============================================
// AI ASSISTANT TYPES
// ============================================

export interface AIAssistant {
  id: string;
  organizationId: string;
  name: string;
  personality: 'professional' | 'friendly' | 'casual' | 'supportive';
  communicationStyle: string;
  capabilities: AICapability[];
  dailyRoutines: DailyRoutine[];
  conversationHistory: ConversationMessage[];
  knowledgeBase: KnowledgeBaseItem[];
  integrations: AIIntegration[];
  settings: AISettings;
  isActive: boolean;
  createdAt: Date;
}

export interface AICapability {
  id: string;
  name: string;
  description: string;
  category: 'automation' | 'analytics' | 'advice' | 'communication' | 'entertainment';
  isEnabled: boolean;
}

export interface DailyRoutine {
  id: string;
  type: 'morning_brief' | 'evening_routine' | 'periodic_check' | 'emergency_alert';
  time: string; // HH:MM format
  frequency: 'daily' | 'weekly' | 'custom';
  tasks: RoutineTask[];
  enabled: boolean;
}

export interface RoutineTask {
  id: string;
  name: string;
  action: string;
  sequence: number;
}

export interface ConversationMessage {
  id: string;
  userId: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  context: Record<string, any>;
  sentiment?: string;
}

export interface KnowledgeBaseItem {
  id: string;
  topic: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIIntegration {
  id: string;
  service: string; // 'openai', 'anthropic', 'google', etc.
  apiKey: string; // encrypted
  model: string;
  isActive: boolean;
  config: Record<string, any>;
}

export interface AISettings {
  responseTimeoutMs: number;
  maxTokens: number;
  temperature: number;
  language: string;
  timezone: string;
  musicPreferences?: string[];
  customGreetings?: Record<string, string>;
}

export interface DailyBrief {
  greeting: string;
  projectUpdates: ProjectUpdate[];
  urgentTasks: Task[];
  financialHighlights: FinancialHighlight[];
  recommendations: AIRecommendation[];
  teamMood: string;
  generateAt: Date;
}

export interface ProjectUpdate {
  projectId: string;
  name: string;
  currentStage: WorkflowStageId;
  completionPercentage: number;
  status: string;
  nextMilestone?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface FinancialHighlight {
  type: 'revenue' | 'expense' | 'profit' | 'variance' | 'alert';
  amount: number;
  description: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface AIRecommendation {
  id: string;
  type: 'optimization' | 'warning' | 'opportunity' | 'action_item';
  priority: 'low' | 'medium' | 'high';
  message: string;
  suggestedAction?: string;
  expectedImpact?: string;
  confidence: number; // 0-100
}

export interface EveningReport {
  daysSummary: string;
  projectsCompleted: Project[];
  tasksCompleted: number;
  issues: string[];
  achievements: string[];
  tomorrowsPreview: string;
  financialSummary: {
    dailyRevenue: number;
    dailyExpenses: number;
    dailyProfit: number;
  };
  generateAt: Date;
}

// ============================================
// MEDIA & ASSET TYPES
// ============================================

export interface MediaAsset {
  id: string;
  projectId: string;
  type: 'design' | 'concept' | 'reference' | 'finished_product' | 'cutting_plan' | 'label' | 'other';
  title: string;
  description: string;
  fileUrl: string;
  fileFormat: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
  visibility: 'private' | 'team' | 'customer' | 'public';
  metadata?: Record<string, any>;
}

// ============================================
// STAFF & USER TYPES
// ============================================

export interface StaffMember {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  jobDescription: JobDescription;
  skills: string[];
  experienceYears: number;
  assignedProjects: string[];
  currentTasks: Task[];
  performanceMetrics: PerformanceMetric;
  availability: AvailabilityInfo;
  preferences: StaffPreferences;
  isActive: boolean;
  createdAt: Date;
}

export interface PerformanceMetric {
  staffId: string;
  tasksCompleted: number;
  averageCompletionTime: number; // in hours
  qualityScore: number; // 1-5
  onTimePercentage: number;
  customerSatisfaction: number; // 1-5
  productivityTrend: 'improving' | 'stable' | 'declining';
}

export interface AvailabilityInfo {
  workingHours: {
    startTime: string; // HH:MM
    endTime: string;
  };
  workingDays: string[]; // ['Monday', 'Tuesday', ...]
  onLeaveFrom?: Date;
  onLeaveTo?: Date;
  maxConcurrentTasks: number;
  currentTaskCount: number;
}

export interface StaffPreferences {
  communicationMethod: 'mobile_app' | 'email' | 'sms' | 'all';
  taskPreferences: string[];
  breakTime: number; // in minutes
  musicPreferences?: string[];
  notificationLevel: 'minimal' | 'normal' | 'detailed';
}

// ============================================
// ORGANIZATION & SETTINGS TYPES
// ============================================

export interface Organization {
  id: string;
  name: string;
  type: 'manufacturing' | 'service' | 'hybrid';
  description: string;
  contact: ContactInfo;
  logo?: string;
  industry: string;
  staffCount: number;
  foundedYear: number;
  subscriptionPlan: 'starter' | 'professional' | 'enterprise';
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  currency: string;
  timezone: string;
  language: string;
  workingDaysPerWeek: number;
  overheadPercentage: number; // for cost calculations
  profitMarginTarget: number;
  taxRate: number;
  aiAssistantEnabled: boolean;
  automationEnabled: boolean;
  integrations: Record<string, boolean>;
  emailNotifications: boolean;
  smsNotifications: boolean;
  customBranding?: CustomBranding;
}

export interface CustomBranding {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  faviconUrl: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// AUTHENTICATION TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  organizationName?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  tokenType: 'Bearer';
}

export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationId: string;
  };
  tokens: AuthToken;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface APIKeyResponse {
  apiKey: string;
  description: string;
  createdAt: Date;
  lastUsed?: Date;
  revokedAt?: Date;
}