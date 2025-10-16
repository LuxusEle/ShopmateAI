# ShopMate AI - Architecture Documentation

## System Overview

ShopMate AI is an AI-powered Business Process Management System designed for custom manufacturing and service businesses. It emphasizes automation, intelligent task management, and a supportive AI companion.

---

## Core Architecture Principles

### 1. **AI-First Design**
The AI assistant is not a feature—it's the heart of the system:
- Proactive recommendations
- Daily briefings and guidance
- Task optimization suggestions
- Real-time issue alerts

### 2. **Service-Oriented Architecture**
Clear separation of concerns:
- **AIService** - AI interactions and intelligence
- **TaskAutomationService** - Workflow and assignment logic
- **FinancialService** - Cost and profit calculations
- **WorkflowService** - Process orchestration

### 3. **Type-Safe Development**
Complete TypeScript implementation:
- Centralized type definitions
- Compile-time error catching
- IntelliSense support
- Self-documenting code

---

## System Components

### Backend Architecture

```
Request → Express Server → Routes → Controllers → Services → Database
                                         ↓
                                    Middleware
```

#### **Express Server** (`server/src/index.ts`)
- Entry point for all backend operations
- CORS and body parsing middleware
- Global error handling
- Request logging with Morgan

#### **Route Layer** (`server/src/routes/`)
Defines all API endpoints:
- `/api/projects` - Project operations
- `/api/tasks` - Task management
- `/api/customers` - Customer management
- `/api/invoices` - Invoice operations
- `/api/ai` - AI interactions
- `/api/automation` - Automation rules
- `/api/vendors` - Vendor management
- `/api/staff` - Staff management

#### **Service Layer** (`server/src/services/`)

**AIService**
```typescript
- generateMorningBrief(projects, tasks) → DailyBrief
- generateEveningReport(projects, tasks) → EveningReport
- getRecommendations(context) → AIRecommendation[]
- initializeAssistant(orgId, config) → AIAssistant
```

**TaskAutomationService**
```typescript
- autoAssignTask(task, staff) → string (staffId)
- transitionTask(task) → Task
- findOptimalStaffMember(task, staff) → StaffMember
- createStageTasks(project, stage) → Task[]
- identifyBottlenecks(tasks) → Bottleneck[]
- getTaskMetrics(tasks) → TaskMetrics
```

**FinancialService**
```typescript
- calculateProjectProfit(project, costs) → ProfitAnalysis
- generateInvoice(project, number) → Invoice
- recordExpense(projectId, data) → Expense
- processPayment(invoice, amount, method) → Invoice
- calculateCostVariance(actual, estimated) → Variance
- generateProfitabilityReport(projects) → Report
```

**WorkflowService**
```typescript
- getStage(stageId) → WorkflowStage
- getAllStages() → WorkflowStage[]
- transitionProject(project) → Project
- estimateProjectDuration(start, end) → number
```

#### **Data Models** (`server/src/models/`)
MongoDB schemas for:
- Organization
- Project
- Task
- Customer
- Invoice
- Expense
- PurchaseOrder
- StaffMember
- Vendor
- Design
- Media

---

### Frontend Architecture

```
React App → API Client → Backend Services
    ↓
  Components
    ↓
  State Management
    ↓
  Services
```

#### **Component Hierarchy**

```
App
├── AIAssistant
│   ├── Avatar (mood display)
│   ├── Panel
│   │   ├── Header
│   │   ├── Messages
│   │   ├── Quick Actions
│   │   └── Input
│   └── Animations
│
├── Dashboard
│   ├── ProjectCard
│   ├── TaskCard
│   ├── FinancialCard
│   └── ActivityFeed
│
├── ProjectManager
│   ├── ProjectList
│   ├── ProjectDetail
│   └── Workflow Visualizer
│
└── Navigation
    ├── Sidebar
    └── Header
```

#### **API Client** (`client/src/services/api.ts`)

Axios-based HTTP client with:
- Request/response interceptors
- Automatic token injection
- Error handling
- All endpoints typed

```typescript
apiClient.getProjects()
apiClient.createTask(data)
apiClient.getDailyBrief()
apiClient.updateAutomationConfig(data)
```

#### **State Management**
React Context API for:
- User authentication
- Organization data
- UI state
- AI messages

---

## Data Flow Examples

### Example 1: Creating a Project

```
User Input (Form)
    ↓
API Call: POST /api/projects
    ↓
ProjectController.createProject()
    ↓
WorkflowService.initializeWorkflow()
    ↓
Save to MongoDB
    ↓
AI Notification: "New project created! Let's make it great!"
    ↓
UI Update: Project appears in list
```

### Example 2: Task Automation

```
Previous Task Completes
    ↓
TaskAutomationService.transitionTask()
    ↓
WorkflowService.transitionProject()
    ↓
TaskAutomationService.createStageTasks()
    ↓
TaskAutomationService.autoAssignTask()
    ↓
System finds optimal staff based on:
   - Required skills
   - Current workload
   - Availability
   - Performance history
    ↓
Task assigned to staff member
    ↓
AIService triggers notification
    ↓
Staff receives task alert
```

### Example 3: Financial Calculations

```
Project moves to completion
    ↓
FinancialService.calculateProjectProfit()
    ↓
Gathers:
   - Total revenue (invoices)
   - Direct costs (BOM)
   - Labor costs (time tracking)
   - Overhead costs (percentage)
    ↓
Calculates:
   - Gross profit
   - Net profit
   - Profit margin
   - Cost breakdown
    ↓
Identifies:
   - Risk factors
   - Optimization opportunities
    ↓
Stores ProfitAnalysis with project
    ↓
AI generates evening report
```

---

## Workflow Stages

The system defines 25 sequential stages:

```
SALES & DESIGN PHASE (Stages 1-13)
├─ 1. Contact
├─ 2. Lead Creation
├─ 3. GPS Mapping
├─ 4. Visit Arrangement
├─ 5. Site Visit
├─ 6. Design Concepts
├─ 7. Detailed Design
├─ 8. BOM Generation
├─ 9. Quotation
├─ 10. Discussion
├─ 11. Revisions
├─ 12. Final Quote
└─ 13. Agreement

MANUFACTURING & EXECUTION PHASE (Stages 14-25)
├─ 14. Project Creation
├─ 15. Invoice Generation
├─ 16. BOM Verification
├─ 17. Purchase Orders
├─ 18. RM Payment & Service Allocation
├─ 19. Expense Tracking
├─ 20. Manufacturing
├─ 21. Final Payments
├─ 22. Delivery
├─ 23. Installation
├─ 24. Service Payments
└─ 25. Completion
```

Each stage includes:
- Required actions
- AI interactions (greeting, advice, warnings)
- Automation rules
- Estimated duration
- Task creation templates

---

## Type System

### Core Types Hierarchy

```
WorkflowStage
├── id: WorkflowStageId (25 options)
├── requiredActions: string[]
├── nextStage: WorkflowStageId
├── aiActions: AIAction[]
└── automationRules: AutomationRule[]

Project
├── id: string
├── customerId: string
├── currentStage: WorkflowStageId
├── designs: Design[]
├── bom: BillOfMaterials
├── quotes: Quote[]
├── invoices: Invoice[]
├── purchases: PurchaseOrder[]
├── expenses: Expense[]
├── timeline: ProjectTimeline
├── profitCalculation: ProfitAnalysis
└── media: MediaAsset[]

Task
├── id: string
├── projectId: string
├── stage: WorkflowStageId
├── assignedTo: string (staffId)
├── status: 'pending'|'in_progress'|'review'|'completed'|'blocked'
├── priority: 'low'|'medium'|'high'|'critical'
├── estimatedHours: number
├── actualHours: number
└── dependencies: string[]

Customer
├── id: string
├── name: string
├── contact: ContactInfo
├── location: GPSLocation
├── currentStage: WorkflowStageId
├── assignedStaff: string
└── preferences: CustomerPreferences
```

---

## Integration Points

### AI Integration (Planned)

```typescript
interface AIIntegration {
  service: 'openai' | 'anthropic' | 'google'
  apiKey: string
  model: string
  config: Record<string, any>
}

// Usage
const response = await aiService.chatWithAI(message)
const recommendations = await aiService.getRecommendations()
```

### GPS Integration (Planned)

```typescript
interface GPSLocation {
  latitude: number
  longitude: number
  address: string
  proximity: number // km for assignment
}

// Calculate optimal staff based on location
const nearestStaff = findNearestStaff(customer.location)
```

### Payment Gateway Integration (Planned)

```typescript
interface PaymentConfig {
  provider: 'stripe' | 'razorpay' | 'paypal'
  apiKey: string
  webhook: string
}

const payment = await processPayment(invoice, config)
```

---

## Security Architecture

### Authentication
- JWT tokens with 7-day expiry
- Refresh token rotation
- Secure password hashing (bcryptjs)

### Authorization
- Role-based access control (RBAC)
- Project-level permissions
- Staff member restrictions

### Data Protection
- Environment variables for secrets
- HTTPS in production
- MongoDB encryption
- Input validation and sanitization

---

## Performance Optimization

### Caching Strategy
- Redis for session management
- Query result caching
- AI response caching (daily/evening)

### Database Optimization
- Indexed collections
- Aggregation pipelines
- Lazy loading for large datasets

### Frontend Optimization
- Code splitting
- Lazy component loading
- Image optimization
- CSS minification

---

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Load balancing with nginx
- Message queue for background jobs

### Database Scaling
- MongoDB sharding for large datasets
- Read replicas for reporting
- Archive old data

### Microservices (Future)
```
┌─ AI Service
├─ Task Service
├─ Financial Service
├─ Project Service
└─ Notification Service
```

---

## Error Handling

### Error Hierarchy

```typescript
AppError (base)
├── ValidationError (400)
├── AuthenticationError (401)
├── AuthorizationError (403)
├── NotFoundError (404)
├── ConflictError (409)
└── ServerError (500)
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-10-16T10:00:00Z"
}
```

---

## Monitoring & Logging

### Log Levels
- INFO: General application flow
- WARN: Potentially problematic situations
- ERROR: Error events
- DEBUG: Detailed diagnostic information

### Metrics to Track
- API response times
- Error rates
- Task completion rates
- Financial calculations accuracy
- User activity

---

## Deployment Architecture

### Development
```
Local Machine
├── Node.js server (npm run dev)
├── React app (npm start)
└── MongoDB (local)
```

### Docker
```
Docker Host
├── shopmate-server (Node.js container)
├── shopmate-client (React container)
├── shopmate-mongodb (MongoDB container)
└── shopmate-redis (Redis container)
```

### Production (Planned)
```
Kubernetes Cluster
├── API Service (3+ replicas)
├── Worker Service (background jobs)
├── MongoDB Replica Set
├── Redis Cluster
└── CDN for static assets
```

---

## Version & Updates

**Current Version:** 1.0.0

### Semantic Versioning
- MAJOR: Backward-incompatible changes
- MINOR: New features
- PATCH: Bug fixes

---

## References & Resources

- **API Documentation:** `SETUP.md`
- **Type Definitions:** `shared/types/index.ts`
- **Service Implementations:** `server/src/services/`
- **Component Library:** `client/src/components/`
- **Configuration:** `server/.env.example`, `client/.env.example`

---

This architecture provides a solid foundation for:
- ✅ Scalability
- ✅ Maintainability
- ✅ Type safety
- ✅ Clear separation of concerns
- ✅ Easy testing
- ✅ Team collaboration

**Happy coding!** 🚀
