import { Project, ProfitAnalysis, BillOfMaterials, Invoice, Expense, PurchaseOrder } from '../../shared/types/index';

export class FinancialService {
  /**
   * Calculate project profit analysis
   */
  calculateProjectProfit(
    project: Project,
    laborCostPerHour: number,
    overheadPercentage: number
  ): ProfitAnalysis {
    const directCosts = this.calculateDirectCosts(project.bom);
    const laborCosts = this.calculateLaborCosts(project, laborCostPerHour);
    const overheadCosts = (directCosts + laborCosts) * (overheadPercentage / 100);
    const totalCosts = directCosts + laborCosts + overheadCosts;

    const totalRevenue = project.invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const grossProfit = totalRevenue - directCosts;
    const netProfit = totalRevenue - totalCosts;

    return {
      projectId: project.id,
      totalRevenue,
      directCosts,
      laborCosts,
      overheadCosts,
      totalCosts,
      grossProfit,
      grossMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
      netProfit,
      netMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      costBreakdown: {
        materials: project.bom.totalMaterialCost,
        services: project.bom.totalServiceCost,
        labor: laborCosts,
        overhead: overheadCosts,
        other: project.expenses
          .filter(e => e.category === 'other')
          .reduce((sum, e) => sum + e.amount, 0)
      },
      profitabilityStatus: netProfit > 0 ? 'profitable' : netProfit === 0 ? 'breakeven' : 'loss',
      risksIdentified: this.identifyRisks(project),
      optimizationOpportunities: this.findOptimizationOpportunities(project)
    };
  }

  /**
   * Calculate direct costs (materials + services)
   */
  private calculateDirectCosts(bom: BillOfMaterials): number {
    return bom.totalMaterialCost + bom.totalServiceCost + (bom.totalDirectCost * (bom.contingency / 100));
  }

  /**
   * Calculate labor costs based on project tasks
   */
  private calculateLaborCosts(project: Project, hourlyRate: number): number {
    let totalHours = 0;
    // This would typically sum actual hours from tasks
    // For now, using estimated durations as placeholder
    project.designs.forEach(d => {
      totalHours += d.estimatedDuration;
    });
    return totalHours * hourlyRate;
  }

  /**
   * Generate invoice from project
   */
  generateInvoice(project: Project, invoiceNumber: string): Invoice {
    const total = project.quotes[0]?.totalAmount || 0;
    
    return {
      id: `inv-${project.id}`,
      projectId: project.id,
      invoiceNumber,
      customerId: project.customerId,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      items: [
        {
          id: '1',
          description: `Project: ${project.name}`,
          quantity: 1,
          unitPrice: total,
          amount: total,
          category: 'labor'
        }
      ],
      subtotal: total,
      tax: total * 0.1, // 10% tax
      total: total * 1.1,
      status: 'draft',
      paidAmount: 0
    };
  }

  /**
   * Track expense
   */
  recordExpense(
    projectId: string,
    description: string,
    amount: number,
    category: Expense['category'],
    vendor?: string
  ): Expense {
    return {
      id: `exp-${Date.now()}`,
      projectId,
      description,
      category,
      amount,
      vendor,
      date: new Date(),
      status: 'pending'
    };
  }

  /**
   * Process payment
   */
  async processPayment(
    invoice: Invoice,
    amount: number,
    method: string
  ): Promise<Invoice> {
    invoice.paidAmount += amount;
    invoice.paidDate = new Date();
    
    if (invoice.paidAmount >= invoice.total) {
      invoice.status = 'paid';
    } else {
      invoice.status = 'partial' as any;
    }
    
    invoice.paymentMethod = method;
    return invoice;
  }

  /**
   * Calculate project cost variance
   */
  calculateCostVariance(
    actualCosts: number,
    estimatedCosts: number
  ): { variance: number; percentageVariance: number; status: 'under' | 'over' | 'on-budget' } {
    const variance = actualCosts - estimatedCosts;
    const percentageVariance = (variance / estimatedCosts) * 100;

    let status: 'under' | 'over' | 'on-budget' = 'on-budget';
    if (variance > estimatedCosts * 0.05) status = 'over';
    if (variance < -estimatedCosts * 0.05) status = 'under';

    return { variance, percentageVariance, status };
  }

  /**
   * Identify financial risks
   */
  private identifyRisks(project: Project): string[] {
    const risks: string[] = [];

    // Check material costs
    if (project.bom.totalMaterialCost > project.bom.totalDirectCost * 0.7) {
      risks.push('High material cost ratio');
    }

    // Check for pending payments
    const unpaidInvoices = project.invoices.filter(i => i.status !== 'paid');
    if (unpaidInvoices.length > 0) {
      risks.push(`${unpaidInvoices.length} unpaid invoices`);
    }

    // Check project delays
    if (project.timeline.delays.length > 0) {
      risks.push('Project has experienced delays');
    }

    return risks;
  }

  /**
   * Find optimization opportunities
   */
  private findOptimizationOpportunities(project: Project): string[] {
    const opportunities: string[] = [];

    // Vendor consolidation
    const vendors = new Set(project.bom.items.map(i => i.vendor).filter(v => v));
    if (vendors.size > 3) {
      opportunities.push('Consider consolidating vendors for better pricing');
    }

    // Material efficiency
    if (project.bom.contingency > 20) {
      opportunities.push('Review material contingency percentage');
    }

    // Timeline optimization
    if (project.timeline.delays.length === 0 && project.timeline.completionPercentage > 80) {
      opportunities.push('Strong on-time performance - replicate this approach');
    }

    return opportunities;
  }

  /**
   * Generate profitability report
   */
  generateProfitabilityReport(projects: Project[]): {
    totalProjects: number;
    averageMargin: number;
    totalProfit: number;
    profitableProjects: number;
    lossProjects: number;
    topProject: Project | null;
    bottomProject: Project | null;
  } {
    const profits = projects.map(p => ({
      project: p,
      profit: p.profitCalculation.netProfit,
      margin: p.profitCalculation.netMargin
    }));

    const totalProfit = profits.reduce((sum, p) => sum + p.profit, 0);
    const averageMargin = profits.reduce((sum, p) => sum + p.margin, 0) / profits.length;
    const profitableProjects = profits.filter(p => p.profit > 0).length;
    const lossProjects = profits.filter(p => p.profit < 0).length;

    profits.sort((a, b) => b.profit - a.profit);

    return {
      totalProjects: projects.length,
      averageMargin,
      totalProfit,
      profitableProjects,
      lossProjects,
      topProject: profits[0]?.project || null,
      bottomProject: profits[profits.length - 1]?.project || null
    };
  }
}

export const financialService = new FinancialService();
