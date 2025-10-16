import {
  WorkflowStage,
  WorkflowStageId,
  Project,
  Task,
  Quote,
  Invoice
} from '../../shared/types/index';

export class WorkflowService {
  private workflowStages: WorkflowStage[] = this.initializeWorkflowStages();

  /**
   * Initialize all workflow stages
   */
  private initializeWorkflowStages(): WorkflowStage[] {
    return [
      {
        id: 'contact',
        name: 'Customer Contact',
        description: 'Initial customer inquiry and lead capture',
        displayOrder: 1,
        requiredActions: ['capture_info', 'create_lead'],
        nextStage: 'lead_creation',
        aiActions: [
          {
            id: '1',
            type: 'greeting',
            message: 'New customer contact! Let me help process this lead.',
            autoExecute: true,
            requiresApproval: false
          }
        ],
        automationRules: [],
        estimatedDuration: 0.5,
        isManufacturingPhase: false
      },
      {
        id: 'lead_creation',
        name: 'Lead Creation',
        description: 'Create lead record and assign to sales team',
        displayOrder: 2,
        requiredActions: ['create_lead_record', 'assign_staff'],
        nextStage: 'gps_mapping',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: false
      },
      {
        id: 'gps_mapping',
        name: 'GPS Mapping & Location',
        description: 'Map customer location for visit arrangement',
        displayOrder: 3,
        requiredActions: ['map_location', 'calculate_distance'],
        nextStage: 'visit_arrangement',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 0.5,
        isManufacturingPhase: false
      },
      {
        id: 'visit_arrangement',
        name: 'Visit Arrangement',
        description: 'Schedule site visit with customer',
        displayOrder: 4,
        requiredActions: ['schedule_visit', 'confirm_appointment'],
        nextStage: 'site_visit',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: false
      },
      {
        id: 'site_visit',
        name: 'Site Visit',
        description: 'Visit customer site to understand requirements',
        displayOrder: 5,
        requiredActions: ['visit_site', 'gather_requirements', 'take_photos'],
        nextStage: 'design_concepts',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 2,
        isManufacturingPhase: false
      },
      {
        id: 'design_concepts',
        name: 'Design Concepts',
        description: 'Create initial design concepts',
        displayOrder: 6,
        requiredActions: ['create_concepts', 'review_with_team'],
        nextStage: 'detailed_design',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 8,
        isManufacturingPhase: false
      },
      {
        id: 'detailed_design',
        name: 'Detailed Design',
        description: 'Develop detailed technical designs',
        displayOrder: 7,
        requiredActions: ['create_technical_drawings', 'prepare_specifications'],
        nextStage: 'bom_generation',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 16,
        isManufacturingPhase: false
      },
      {
        id: 'bom_generation',
        name: 'BOM Generation',
        description: 'Generate Bill of Materials',
        displayOrder: 8,
        requiredActions: ['create_bom', 'verify_costs'],
        nextStage: 'quotation',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 4,
        isManufacturingPhase: false
      },
      {
        id: 'quotation',
        name: 'Quotation',
        description: 'Prepare and send quote to customer',
        displayOrder: 9,
        requiredActions: ['create_quote', 'send_quote'],
        nextStage: 'discussion',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 2,
        isManufacturingPhase: false
      },
      {
        id: 'discussion',
        name: 'Discussion & Negotiation',
        description: 'Discuss quote with customer',
        displayOrder: 10,
        requiredActions: ['negotiate', 'get_feedback'],
        nextStage: 'revisions',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: false
      },
      {
        id: 'revisions',
        name: 'Revisions',
        description: 'Make any requested revisions to design or quote',
        displayOrder: 11,
        requiredActions: ['update_design', 'update_quote'],
        nextStage: 'final_quote',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 2,
        isManufacturingPhase: false
      },
      {
        id: 'final_quote',
        name: 'Final Quote & Approval',
        description: 'Finalize and get approval on quote',
        displayOrder: 12,
        requiredActions: ['finalize_quote', 'get_approval'],
        nextStage: 'agreement',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: false
      },
      {
        id: 'agreement',
        name: 'Customer Agreement',
        description: 'Customer approves and project moves to execution',
        displayOrder: 13,
        requiredActions: ['customer_approval', 'project_kickoff'],
        nextStage: 'project_creation',
        aiActions: [
          {
            id: '1',
            type: 'celebration',
            message: 'Excellent! Project approved! Time to create something amazing!',
            autoExecute: true,
            requiresApproval: false
          }
        ],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: false
      },
      {
        id: 'project_creation',
        name: 'Project Creation',
        description: 'Create official project and assign team',
        displayOrder: 14,
        requiredActions: ['create_project', 'assign_team'],
        nextStage: 'invoice_generation',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: true
      },
      {
        id: 'invoice_generation',
        name: 'Invoice Generation',
        description: 'Generate and send invoice',
        displayOrder: 15,
        requiredActions: ['create_invoice', 'send_invoice'],
        nextStage: 'bom_verification',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: true
      },
      {
        id: 'bom_verification',
        name: 'BOM Verification & POs',
        description: 'Verify BOM and create purchase orders',
        displayOrder: 16,
        requiredActions: ['verify_bom', 'create_pos'],
        nextStage: 'purchase_orders',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 2,
        isManufacturingPhase: true
      },
      {
        id: 'purchase_orders',
        name: 'Purchase Orders',
        description: 'Send POs to vendors',
        displayOrder: 17,
        requiredActions: ['send_pos', 'track_delivery'],
        nextStage: 'rm_payment',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: true
      },
      {
        id: 'rm_payment',
        name: 'RM Payment & Service Allocation',
        description: 'Process payments for materials and allocate services',
        displayOrder: 18,
        requiredActions: ['pay_vendors', 'allocate_services'],
        nextStage: 'expense_tracking',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: true
      },
      {
        id: 'expense_tracking',
        name: 'Expense Tracking',
        description: 'Track all project expenses',
        displayOrder: 19,
        requiredActions: ['record_expenses', 'verify_receipts'],
        nextStage: 'manufacturing',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: true
      },
      {
        id: 'manufacturing',
        name: 'Manufacturing & Assembly',
        description: 'Actual manufacturing and assembly work',
        displayOrder: 20,
        requiredActions: ['cnc_production', 'assembly', 'quality_check'],
        nextStage: 'final_payments',
        aiActions: [
          {
            id: '1',
            type: 'advice',
            message: 'Remember to maintain quality standards and document progress',
            autoExecute: false,
            requiresApproval: false
          }
        ],
        automationRules: [],
        estimatedDuration: 40,
        isManufacturingPhase: true
      },
      {
        id: 'final_payments',
        name: 'Final Payments',
        description: 'Process final payments to vendors and contractors',
        displayOrder: 21,
        requiredActions: ['process_final_payments', 'verify_receipts'],
        nextStage: 'delivery',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: true
      },
      {
        id: 'delivery',
        name: 'Delivery & Installation',
        description: 'Deliver and install product at customer site',
        displayOrder: 22,
        requiredActions: ['arrange_delivery', 'install', 'test'],
        nextStage: 'installation',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 4,
        isManufacturingPhase: true
      },
      {
        id: 'installation',
        name: 'Installation Setup',
        description: 'Complete installation and customer training',
        displayOrder: 23,
        requiredActions: ['complete_setup', 'train_customer'],
        nextStage: 'service_payments',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 2,
        isManufacturingPhase: true
      },
      {
        id: 'service_payments',
        name: 'Service Payments & Reconciliation',
        description: 'Finalize all service payments and reconciliation',
        displayOrder: 24,
        requiredActions: ['finalize_payments', 'reconcile'],
        nextStage: 'completion',
        aiActions: [],
        automationRules: [],
        estimatedDuration: 1,
        isManufacturingPhase: true
      },
      {
        id: 'completion',
        name: 'Project Completion',
        description: 'Project complete',
        displayOrder: 25,
        requiredActions: ['collect_feedback', 'archive'],
        nextStage: undefined,
        aiActions: [
          {
            id: '1',
            type: 'celebration',
            message: 'Project complete! Fantastic work team! Let\'s celebrate this success!',
            autoExecute: true,
            requiresApproval: false
          }
        ],
        automationRules: [],
        estimatedDuration: 0,
        isManufacturingPhase: true
      }
    ];
  }

  /**
   * Get workflow stage details
   */
  getStage(stageId: WorkflowStageId): WorkflowStage | undefined {
    return this.workflowStages.find(s => s.id === stageId);
  }

  /**
   * Get all workflow stages
   */
  getAllStages(): WorkflowStage[] {
    return this.workflowStages;
  }

  /**
   * Transition project to next stage
   */
  async transitionProject(project: Project): Promise<Project> {
    const currentStage = this.getStage(project.currentStage);
    
    if (!currentStage || !currentStage.nextStage) {
      throw new Error('Cannot transition: no next stage defined');
    }

    const nextStage = currentStage.nextStage;
    project.currentStage = nextStage;
    project.timeline.currentPhase = nextStage;
    project.timeline.phaseCompletionDates[currentStage.id] = new Date();

    // Update completion percentage
    const totalStages = this.workflowStages.length;
    const completedStages = this.workflowStages.filter(s => s.displayOrder <= project.timeline.currentPhase).length;
    project.timeline.completionPercentage = (completedStages / totalStages) * 100;

    return project;
  }

  /**
   * Get estimated project duration
   */
  estimateProjectDuration(startStage: WorkflowStageId, endStage: WorkflowStageId): number {
    const startIdx = this.workflowStages.findIndex(s => s.id === startStage);
    const endIdx = this.workflowStages.findIndex(s => s.id === endStage);

    if (startIdx === -1 || endIdx === -1) {
      throw new Error('Invalid stage IDs');
    }

    let totalHours = 0;
    for (let i = startIdx; i <= endIdx; i++) {
      totalHours += this.workflowStages[i].estimatedDuration;
    }

    return totalHours;
  }
}

export const workflowService = new WorkflowService();
