import {
  AIAssistant,
  DailyBrief,
  EveningReport,
  AIRecommendation,
  Project,
  Task,
  WorkflowStageId
} from '../../shared/types/index';

export class AIService {
  private assistants: Map<string, AIAssistant> = new Map();

  /**
   * Initialize AI assistant for organization
   */
  async initializeAssistant(organizationId: string, config: any): Promise<AIAssistant> {
    const assistant: AIAssistant = {
      id: `ai-${organizationId}`,
      organizationId,
      name: 'ShopMate AI',
      personality: 'supportive',
      communicationStyle: 'friendly and professional',
      capabilities: [
        { id: '1', name: 'Task Automation', description: 'Automatically assign and manage tasks', category: 'automation', isEnabled: true },
        { id: '2', name: 'Daily Briefing', description: 'Morning and evening briefings', category: 'communication', isEnabled: true },
        { id: '3', name: 'Profit Analysis', description: 'Real-time profit and cost analysis', category: 'analytics', isEnabled: true },
        { id: '4', name: 'Predictive Recommendations', description: 'AI-driven suggestions', category: 'advice', isEnabled: true },
        { id: '5', name: 'Ambient Music', description: 'Shop ambient background music', category: 'entertainment', isEnabled: true }
      ],
      dailyRoutines: [
        {
          id: '1',
          type: 'morning_brief',
          time: '08:00',
          frequency: 'daily',
          tasks: [
            { id: '1', name: 'Review pending projects', action: 'getProjectStatus', sequence: 1 },
            { id: '2', name: 'Check urgent tasks', action: 'getUrgentTasks', sequence: 2 },
            { id: '3', name: 'Financial summary', action: 'getFinancialSummary', sequence: 3 }
          ],
          enabled: true
        },
        {
          id: '2',
          type: 'evening_routine',
          time: '17:00',
          frequency: 'daily',
          tasks: [
            { id: '1', name: 'Close pending bills', action: 'closePendingBills', sequence: 1 },
            { id: '2', name: 'Process payments', action: 'processPayments', sequence: 2 },
            { id: '3', name: 'Generate daily report', action: 'generateDailyReport', sequence: 3 },
            { id: '4', name: 'Highlight issues', action: 'identifyIssues', sequence: 4 }
          ],
          enabled: true
        }
      ],
      conversationHistory: [],
      knowledgeBase: [],
      integrations: [],
      settings: {
        responseTimeoutMs: 5000,
        maxTokens: 1000,
        temperature: 0.7,
        language: 'en',
        timezone: 'UTC',
        musicPreferences: ['ambient', 'lo-fi', 'jazz']
      },
      isActive: true,
      createdAt: new Date()
    };

    this.assistants.set(organizationId, assistant);
    return assistant;
  }

  /**
   * Generate morning daily brief
   */
  async generateMorningBrief(organizationId: string, projects: Project[], tasks: Task[]): Promise<DailyBrief> {
    const briefing: DailyBrief = {
      greeting: this.generateWarmGreeting(),
      projectUpdates: projects.map(p => ({
        projectId: p.id,
        name: p.name,
        currentStage: p.currentStage,
        completionPercentage: p.timeline.completionPercentage,
        status: p.status,
        nextMilestone: this.getNextMilestone(p),
        riskLevel: this.assessProjectRisk(p)
      })),
      urgentTasks: tasks.filter(t => t.priority === 'critical' || t.priority === 'high').slice(0, 5),
      financialHighlights: await this.generateFinancialHighlights(organizationId),
      recommendations: await this.generateRecommendations(organizationId, projects),
      teamMood: 'positive',
      generateAt: new Date()
    };

    return briefing;
  }

  /**
   * Generate evening routine report
   */
  async generateEveningReport(organizationId: string, projects: Project[], tasks: Task[]): Promise<EveningReport> {
    const completedProjects = projects.filter(p => p.status === 'completed');
    const completedTasks = tasks.filter(t => t.status === 'completed').length;

    const report: EveningReport = {
      daysSummary: this.generateDaySummary(completedTasks, completedProjects.length),
      projectsCompleted: completedProjects,
      tasksCompleted: completedTasks,
      issues: await this.identifyIssues(organizationId, projects),
      achievements: this.celebrateAchievements(completedTasks, completedProjects.length),
      tomorrowsPreview: 'Tomorrow looks promising! Review pending quotes and continue manufacturing tasks.',
      financialSummary: {
        dailyRevenue: 0,
        dailyExpenses: 0,
        dailyProfit: 0
      },
      generateAt: new Date()
    };

    return report;
  }

  /**
   * Provide AI recommendations for task or project
   */
  async getRecommendations(organizationId: string, context: 'task' | 'project' | 'general'): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    if (context === 'task') {
      recommendations.push({
        id: '1',
        type: 'optimization',
        priority: 'medium',
        message: 'Consider batch-assigning similar tasks to the same team member',
        suggestedAction: 'Group cutting tasks together',
        expectedImpact: '15% efficiency improvement',
        confidence: 85
      });
    }

    if (context === 'project') {
      recommendations.push({
        id: '2',
        type: 'warning',
        priority: 'high',
        message: 'Project timeline at risk - Manufacturing phase running behind schedule',
        suggestedAction: 'Allocate additional resources to manufacturing',
        expectedImpact: 'Project on-time delivery',
        confidence: 90
      });
    }

    recommendations.push({
      id: '3',
      type: 'opportunity',
      priority: 'low',
      message: 'Great profit margin on completed projects',
      suggestedAction: 'Consider similar projects in future pipeline',
      confidence: 88
    });

    return recommendations;
  }

  /**
   * Generate warm and friendly greeting
   */
  private generateWarmGreeting(): string {
    const greetings = [
      'Good morning! Time to make today amazing! ☀️',
      'Rise and shine! Ready to build something great? 💪',
      'Good morning, team! Let\'s have a productive day! 🚀',
      'Hello! Today\'s looking bright - let\'s make it count! ✨'
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * Get next milestone for a project
   */
  private getNextMilestone(project: Project): string {
    const stages: WorkflowStageId[] = [
      'design_concepts', 'detailed_design', 'bom_generation', 'quotation',
      'manufacturing', 'delivery', 'completion'
    ];
    const currentIndex = stages.indexOf(project.currentStage);
    return stages[currentIndex + 1] || 'Completion';
  }

  /**
   * Assess project risk level
   */
  private assessProjectRisk(project: Project): 'low' | 'medium' | 'high' {
    if (project.timeline.completionPercentage > 80) return 'low';
    if (project.timeline.delays.length > 2) return 'high';
    return 'medium';
  }

  /**
   * Generate financial highlights
   */
  private async generateFinancialHighlights(organizationId: string) {
    return [
      { type: 'revenue' as const, amount: 45000, description: 'Monthly revenue on track', trend: 'up' as const },
      { type: 'expense' as const, amount: 12000, description: 'Material costs slightly elevated', trend: 'up' as const },
      { type: 'profit' as const, amount: 33000, description: 'Strong profitability', trend: 'stable' as const }
    ];
  }

  /**
   * Generate AI recommendations
   */
  private async generateRecommendations(organizationId: string, projects: Project[]): Promise<AIRecommendation[]> {
    return [
      {
        id: '1',
        type: 'optimization',
        priority: 'high',
        message: 'Optimize vendor selection for faster delivery',
        suggestedAction: 'Review vendor performance metrics',
        confidence: 85
      },
      {
        id: '2',
        type: 'action_item',
        priority: 'medium',
        message: 'Follow up on 2 pending quotes',
        suggestedAction: 'Send reminder to customers',
        confidence: 90
      }
    ];
  }

  /**
   * Generate day summary
   */
  private generateDaySummary(tasksCompleted: number, projectsCompleted: number): string {
    return `Fantastic day! Completed ${tasksCompleted} tasks and finished ${projectsCompleted} project(s). Keep up the excellent work!`;
  }

  /**
   * Identify issues
   */
  private async identifyIssues(organizationId: string, projects: Project[]): Promise<string[]> {
    const issues: string[] = [];
    
    projects.forEach(p => {
      if (p.timeline.delays.length > 0) {
        issues.push(`Project "${p.name}" has ${p.timeline.delays.length} delay(s)`);
      }
      if (p.timeline.completionPercentage < 20 && new Date(p.timeline.estimatedEnd).getTime() < Date.now()) {
        issues.push(`Project "${p.name}" is behind schedule`);
      }
    });

    return issues;
  }

  /**
   * Celebrate achievements
   */
  private celebrateAchievements(tasksCompleted: number, projectsCompleted: number): string[] {
    const achievements: string[] = [];
    
    if (tasksCompleted > 10) achievements.push('🏆 Powerhouse day - completed 10+ tasks!');
    if (projectsCompleted > 0) achievements.push('🎉 Project completed! Excellent work team!');
    if (tasksCompleted > 0) achievements.push('⭐ Great productivity today!');
    
    return achievements;
  }
}

export const aiService = new AIService();
