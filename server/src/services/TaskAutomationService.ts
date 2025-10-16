import { Task, WorkflowStageId, StaffMember, Project, JobDescription } from '../../shared/types/index';

export class TaskAutomationService {
  /**
   * Auto-assign task based on staff availability and expertise
   */
  async autoAssignTask(task: Task, availableStaff: StaffMember[]): Promise<string> {
    const optimalStaff = this.findOptimalStaffMember(task, availableStaff);
    
    if (!optimalStaff) {
      throw new Error('No available staff member found for task');
    }

    task.assignedTo = optimalStaff.id;
    task.status = 'pending';
    
    return optimalStaff.id;
  }

  /**
   * Auto-transition task to next stage
   */
  async transitionTask(task: Task): Promise<Task> {
    task.status = 'completed';
    task.completedAt = new Date();
    return task;
  }

  /**
   * Get recommended staff for a task
   */
  findOptimalStaffMember(task: Task, availableStaff: StaffMember[]): StaffMember | null {
    // Filter staff by:
    // 1. Availability (not at max capacity)
    // 2. Required skills
    // 3. Experience level
    // 4. Workload balance

    const qualified = availableStaff.filter(staff => {
      const hasCapacity = staff.availability.currentTaskCount < staff.availability.maxConcurrentTasks;
      const hasSkills = this.hasRequiredSkills(staff, task);
      return hasCapacity && hasSkills;
    });

    if (qualified.length === 0) return null;

    // Sort by workload (least loaded first)
    qualified.sort((a, b) => a.availability.currentTaskCount - b.availability.currentTaskCount);

    return qualified[0];
  }

  /**
   * Check if staff member has required skills for task
   */
  private hasRequiredSkills(staff: StaffMember, task: Task): boolean {
    const requiredSkills = this.getRequiredSkillsForTask(task);
    return requiredSkills.every(skill => staff.skills.includes(skill));
  }

  /**
   * Get required skills for a task type
   */
  private getRequiredSkillsForTask(task: Task): string[] {
    const skillMap: Record<string, string[]> = {
      'design': ['CAD', 'Design', 'Problem Solving'],
      'manufacturing': ['CNC', 'Assembly', 'Quality Check'],
      'review': ['Analysis', 'Attention to Detail'],
      'approval': ['Decision Making', 'Quality Standards'],
      'delivery': ['Logistics', 'Customer Service'],
      'other': []
    };
    return skillMap[task.type] || [];
  }

  /**
   * Create tasks for workflow stage transitions
   */
  async createStageTasks(project: Project, stage: WorkflowStageId): Promise<Task[]> {
    const tasks: Task[] = [];

    const stageTaskConfigs: Record<WorkflowStageId, any> = {
      'design_concepts': {
        title: 'Create Design Concepts',
        type: 'design',
        estimatedHours: 8,
        priority: 'high'
      },
      'detailed_design': {
        title: 'Develop Detailed Design',
        type: 'design',
        estimatedHours: 16,
        priority: 'high'
      },
      'bom_generation': {
        title: 'Generate Bill of Materials',
        type: 'review',
        estimatedHours: 4,
        priority: 'medium'
      },
      'manufacturing': {
        title: 'Manufacturing Process',
        type: 'manufacturing',
        estimatedHours: 40,
        priority: 'high'
      },
      'delivery': {
        title: 'Arrange Delivery',
        type: 'delivery',
        estimatedHours: 2,
        priority: 'medium'
      },
      // Add more stages as needed
    } as const;

    const config = stageTaskConfigs[stage];
    if (config) {
      tasks.push({
        id: `task-${project.id}-${stage}`,
        projectId: project.id,
        title: config.title,
        description: `${config.title} for project ${project.name}`,
        stage,
        type: config.type,
        assignedTo: '',
        priority: config.priority,
        status: 'pending',
        estimatedHours: config.estimatedHours,
        actualHours: 0,
        dueDate: new Date(Date.now() + config.estimatedHours * 3600000),
        dependencies: [],
        aiRecommendations: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return tasks;
  }

  /**
   * Check for task bottlenecks
   */
  async identifyBottlenecks(tasks: Task[]): Promise<{ stage: WorkflowStageId; count: number }[]> {
    const bottlenecks: { stage: WorkflowStageId; count: number }[] = [];
    const stageCounts = new Map<WorkflowStageId, number>();

    tasks
      .filter(t => t.status === 'pending' || t.status === 'blocked')
      .forEach(t => {
        stageCounts.set(t.stage, (stageCounts.get(t.stage) || 0) + 1);
      });

    stageCounts.forEach((count, stage) => {
      if (count > 3) {
        bottlenecks.push({ stage, count });
      }
    });

    return bottlenecks.sort((a, b) => b.count - a.count);
  }

  /**
   * Get task completion metrics
   */
  async getTaskMetrics(tasks: Task[]): Promise<{
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    averageCompletionTime: number;
    onTimePercentage: number;
  }> {
    const completed = tasks.filter(t => t.status === 'completed');
    const pending = tasks.filter(t => t.status === 'pending');

    let totalCompletionTime = 0;
    let onTimeCount = 0;

    completed.forEach(task => {
      if (task.startedAt && task.completedAt) {
        totalCompletionTime += task.completedAt.getTime() - task.startedAt.getTime();
        if (task.completedAt <= task.dueDate) {
          onTimeCount++;
        }
      }
    });

    return {
      totalTasks: tasks.length,
      completedTasks: completed.length,
      pendingTasks: pending.length,
      averageCompletionTime: completed.length > 0 ? totalCompletionTime / completed.length / 3600000 : 0,
      onTimePercentage: completed.length > 0 ? (onTimeCount / completed.length) * 100 : 0
    };
  }
}

export const taskAutomationService = new TaskAutomationService();
