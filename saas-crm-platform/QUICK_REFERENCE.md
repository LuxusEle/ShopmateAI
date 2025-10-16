# ShopMate AI - Quick Reference Guide

## 🚀 Commands Cheat Sheet

### Starting the Application

```bash
# Option 1: Docker (Recommended)
docker-compose up --build

# Option 2: Manual - Terminal 1
cd server
npm run dev

# Option 2: Manual - Terminal 2
cd client
npm start
```

### Common npm Scripts

```bash
# Server
npm run dev          # Start dev server with auto-reload
npm run build        # Build TypeScript
npm start            # Run production server
npm test             # Run tests

# Client
npm start            # Start dev server
npm run build        # Create production build
npm test             # Run tests
```

---

## 📁 File Locations

### Core Logic
| What | Where |
|------|-------|
| AI Service | `server/src/services/AIService.ts` |
| Task Automation | `server/src/services/TaskAutomationService.ts` |
| Financial Logic | `server/src/services/FinancialService.ts` |
| Workflow Definition | `server/src/services/WorkflowService.ts` |
| All Type Definitions | `shared/types/index.ts` |
| API Routes | `server/src/routes/*.ts` |
| AI Component | `client/src/components/AIAssistant.tsx` |
| API Client | `client/src/services/api.ts` |

---

## 🔌 API Endpoints Reference

### AI Services
```
GET  /api/ai/daily-brief        Get morning briefing
GET  /api/ai/evening-report     Get evening report
POST /api/ai/chat               Chat with AI
```

### Projects
```
GET    /api/projects            List all
POST   /api/projects            Create
GET    /api/projects/:id        Get one
PUT    /api/projects/:id        Update
DELETE /api/projects/:id        Delete
```

### Tasks
```
GET    /api/tasks               List all
POST   /api/tasks               Create
GET    /api/tasks/:id           Get one
PUT    /api/tasks/:id           Update
PATCH  /api/tasks/:id/complete  Complete task
```

### Customers
```
GET    /api/customers           List all
POST   /api/customers           Create
GET    /api/customers/:id       Get one
PUT    /api/customers/:id       Update
```

### Invoices
```
GET    /api/invoices            List all
POST   /api/invoices            Create
GET    /api/invoices/:id        Get one
PUT    /api/invoices/:id        Update
```

### Automation
```
GET  /api/automation/config     Get settings
POST /api/automation/config     Update settings
POST /api/automation/trigger    Trigger rule
```

### Vendors
```
GET    /api/vendors             List all
POST   /api/vendors             Create
GET    /api/vendors/:id         Get one
PUT    /api/vendors/:id         Update
```

### Staff
```
GET    /api/staff               List all
POST   /api/staff               Create
GET    /api/staff/:id           Get one
PUT    /api/staff/:id           Update
```

---

## 📦 Type Definitions Quick Reference

### Main Types
```typescript
// Project
Project {
  id, customerId, name, currentStage,
  designs[], bom, quotes[], invoices[],
  timeline, profitCalculation, status
}

// Task
Task {
  id, projectId, title, stage, assignedTo,
  priority, status, estimatedHours,
  actualHours, dueDate, dependencies[]
}

// Customer
Customer {
  id, name, contact, location,
  currentStage, assignedStaff, preferences
}

// Workflow Stages (25 total)
WorkflowStageId = 'contact' | 'lead_creation' | 'gps_mapping' |
                  'site_visit' | 'design_concepts' | 'detailed_design' |
                  'bom_generation' | 'quotation' | 'manufacturing' | ...
```

---

## 💻 Development Workflow

### Creating a New Feature

1. **Add Type Definitions**
   ```
   shared/types/index.ts - Add your type
   ```

2. **Create Service Method**
   ```
   server/src/services/*.ts - Implement logic
   ```

3. **Add Route & Controller**
   ```
   server/src/routes/*.ts - Add endpoint
   ```

4. **Create React Component**
   ```
   client/src/components/*.tsx - Build UI
   ```

5. **Use API Client**
   ```typescript
   import { apiClient } from '../services/api'
   apiClient.yourMethod()
   ```

---

## 🧪 Testing Common Scenarios

### Test AI Daily Brief
```bash
curl http://localhost:5000/api/ai/daily-brief
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "customerId":"cust-1",
    "name":"Test Project",
    "description":"Test"
  }'
```

### Get All Tasks
```bash
curl http://localhost:5000/api/tasks
```

---

## 🔧 Configuration Quick Guide

### Server .env
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=27017
DB_NAME=shopmate_ai
JWT_SECRET=your-secret
```

### Client .env
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## 📊 Database Collections Schema

### Organizations
```javascript
{
  _id, name, type, description,
  contact, logo, industry,
  staffCount, foundedYear,
  subscriptionPlan, settings
}
```

### Projects
```javascript
{
  _id, customerId, name, description,
  currentStage, designs[], bom,
  quotes[], invoices[], expenses[],
  timeline, profitCalculation, media[],
  status, createdAt, updatedAt
}
```

### Tasks
```javascript
{
  _id, projectId, title, description,
  stage, type, assignedTo, priority,
  status, estimatedHours, actualHours,
  dueDate, dependencies[], createdAt
}
```

---

## 🎨 Component Structure

### AIAssistant Component
```typescript
<AIAssistant organizationId="org-123" />

// Features:
// - Avatar with mood emoji
// - Expandable chat panel
// - Quick action buttons
// - Message history
// - Responsive design
```

### Props Interface
```typescript
interface AIAssistantProps {
  organizationId: string
}
```

### Moods
- 😊 happy
- 🤔 thinking
- 🤝 supportive

---

## 🚨 Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| VALIDATION_ERROR | 400 | Invalid input |
| AUTH_ERROR | 401 | Not authenticated |
| PERMISSION_ERROR | 403 | Not authorized |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| SERVER_ERROR | 500 | Server error |

---

## 🐛 Debugging Tips

### Enable Debug Logging
```typescript
// In any service
logger.debug('Message', { context })
```

### Check Network Requests
```javascript
// Browser DevTools → Network tab
// Filter by XHR
```

### MongoDB Queries
```bash
# Connect to MongoDB
mongosh

# Use database
use shopmate_ai

# View collections
show collections

# Query example
db.projects.find()
```

---

## 📱 Workflow Stages Quick Reference

### Sales Phase (1-13)
1. Contact
2. Lead Creation
3. GPS Mapping
4. Visit Arrangement
5. Site Visit
6. Design Concepts
7. Detailed Design
8. BOM Generation
9. Quotation
10. Discussion
11. Revisions
12. Final Quote
13. Agreement

### Manufacturing Phase (14-25)
14. Project Creation
15. Invoice Generation
16. BOM Verification
17. Purchase Orders
18. RM Payment
19. Expense Tracking
20. Manufacturing
21. Final Payments
22. Delivery
23. Installation
24. Service Payments
25. Completion

---

## 🔑 Key Service Methods

### AIService
```typescript
generateMorningBrief()
generateEveningReport()
getRecommendations(context)
initializeAssistant(orgId, config)
```

### TaskAutomationService
```typescript
autoAssignTask(task, staff)
transitionTask(task)
findOptimalStaffMember(task, staff)
createStageTasks(project, stage)
identifyBottlenecks(tasks)
getTaskMetrics(tasks)
```

### FinancialService
```typescript
calculateProjectProfit(project, costs)
generateInvoice(project, number)
recordExpense(projectId, data)
processPayment(invoice, amount, method)
calculateCostVariance(actual, estimated)
generateProfitabilityReport(projects)
```

### WorkflowService
```typescript
getStage(stageId)
getAllStages()
transitionProject(project)
estimateProjectDuration(start, end)
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Client | http://localhost:3000 |
| API | http://localhost:5000 |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |
| API Health | http://localhost:5000/api/health |

---

## 📚 File Size Reference

| Component | Size |
|-----------|------|
| AIService | ~200 lines |
| TaskAutomationService | ~180 lines |
| FinancialService | ~220 lines |
| WorkflowService | ~350 lines |
| Type Definitions | ~900 lines |
| AIAssistant Component | ~140 lines |
| API Client | ~180 lines |

---

## ⚡ Performance Tips

1. **Use Redis** for session caching
2. **Index frequently queried fields** in MongoDB
3. **Lazy load** components in React
4. **Use pagination** for large lists
5. **Cache API responses** client-side
6. **Batch updates** instead of individual calls

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for allowed origins
- [ ] Hash passwords with bcryptjs
- [ ] Implement rate limiting
- [ ] Log security events

---

## 📖 Documentation Links

- **[Full Setup Guide](./SETUP.md)**
- **[Architecture Deep-Dive](./ARCHITECTURE.md)**
- **[Project Summary](./PROJECT_SUMMARY.md)**
- **[Main README](./README.md)**

---

## 💬 Quick Help

**Stuck?** Check these first:
1. `SETUP.md` - Installation issues
2. `ARCHITECTURE.md` - Design questions
3. Code comments - Implementation details
4. Type definitions - Available interfaces
5. GitHub Issues - Known problems

---

**Version:** 1.0.0  
**Last Updated:** October 16, 2025

*Keep this handy while developing!* 🚀
