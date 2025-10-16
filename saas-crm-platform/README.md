# ShopMate AI - Business Process Management System 🚀

> **AI-Powered automation for custom manufacturing and service businesses**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-Active%20Development-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🎯 Overview

**ShopMate AI** is a comprehensive, AI-powered Business Process Management System designed specifically for custom manufacturing and service businesses. It automates the entire business lifecycle from customer contact through project completion, with an intelligent AI companion that guides, automates, and supports every step.

### The "We Concept"
This isn't just software—it's a supportive team member that:
- 🤝 Works alongside your staff (not against them)
- 🏠 Creates a "home feeling" in the workplace
- 🤖 Automates what's repetitive, humanizes what matters
- 📈 Simplifies complexity without losing capability

---

## ✨ Key Features

### 🎯 Complete Workflow Automation
- **25-Stage Pipeline**: From customer contact through project completion
- **Intelligent Task Routing**: AI-powered task assignment based on skills, workload, and availability
- **Automatic Progression**: Tasks auto-assign as previous stages complete
- **Bottleneck Detection**: AI identifies and alerts on workflow bottlenecks

### 🤖 AI Assistant (Your Business Friend)
- **Morning Briefing**: Daily priorities, urgent tasks, and financial highlights
- **Evening Routine**: Auto-close bills, generate reports, highlight issues
- **Proactive Advice**: Real-time recommendations and optimizations
- **Conversational Interface**: Natural language interactions for all operations
- **Ambient Features**: Integrated music and supportive notifications

### 💰 Financial Intelligence
- **Profit Analysis**: Real-time project profitability calculations
- **Cost Tracking**: Material, labor, overhead, and service costs
- **Invoice Generation**: Automatic invoice creation from projects
- **Expense Management**: Complete expense tracking and reconciliation
- **Profitability Reports**: Detailed reports with risk identification

### 📊 Project Management
- **Timeline Tracking**: Estimated vs. actual project timelines
- **Design Management**: Store and version designs, concepts, and technical drawings
- **BOM Generation**: Automatic Bill of Materials creation and management
- **Quote Management**: Create, revise, and track customer quotes
- **Media Storage**: Store designs, photos, cutting plans, and finished work

### 👥 Team Management
- **Skill-Based Assignment**: Match tasks to team members' expertise
- **Workload Balancing**: Automatically balance task distribution
- **Performance Metrics**: Track individual and team productivity
- **Job Descriptions**: Define roles and responsibilities clearly
- **Staff Preferences**: Set communication preferences and task preferences

### 🏢 Vendor & Service Management
- **Vendor Database**: Track supplier performance and pricing
- **BOM Integration**: Link BOMs to specific vendors
- **Purchase Order Management**: Generate and track POs
- **Service Contractor Management**: Track external service providers
- **Cost Optimization**: Identify best vendors and negotiate better rates

---

## 🏗️ Project Structure

```
saas-crm-platform/
├── server/                          # Node.js + Express Backend
│   ├── src/
│   │   ├── index.ts                # Entry point
│   │   ├── config/                 # Configuration
│   │   │   └── database.ts
│   │   ├── services/               # Business Logic ⭐
│   │   │   ├── AIService.ts        # AI brain
│   │   │   ├── TaskAutomationService.ts
│   │   │   ├── FinancialService.ts
│   │   │   └── WorkflowService.ts
│   │   ├── routes/                 # API Endpoints
│   │   ├── controllers/            # Route Handlers
│   │   ├── models/                 # MongoDB Schemas
│   │   ├── middleware/
│   │   └── utils/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── AIAssistant.tsx     # Main AI component ⭐
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.ts              # API Client
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── shared/                          # Shared Types
│   ├── types/
│   │   └── index.ts               # Complete TypeScript definitions ⭐
│   └── constants/
│
├── docker-compose.yml              # Complete deployment setup
├── SETUP.md                        # Installation guide
├── ARCHITECTURE.md                 # Technical architecture
├── PROJECT_SUMMARY.md              # What was created
└── README.md                       # This file
```

---

## 🚀 Quick Start

### Option 1: Docker (Recommended) ✅ Simplest
```bash
git clone <repository-url>
cd saas-crm-platform

# Start everything with one command
docker-compose up --build

# Visit:
# Frontend: http://localhost:3000
# API: http://localhost:5000
# Docs: See SETUP.md
```

### Option 2: Manual Setup
```bash
# Terminal 1 - Backend
cd server
cp .env.example .env
npm install
npm run dev

# Terminal 2 - Frontend
cd client
cp .env.example .env
npm install
npm start
```

---

## 📋 Complete Feature List

### ✅ Workflow & Automation
- [x] 25-stage complete workflow
- [x] Automatic task creation
- [x] Intelligent task assignment
- [x] Sequential workflow execution
- [x] Stage transition management
- [x] Bottleneck identification
- [x] Progress tracking

### ✅ AI & Intelligence
- [x] Morning briefing generation
- [x] Evening report automation
- [x] Task recommendations
- [x] Conversational interface
- [x] Achievement celebration
- [x] Issue identification
- [x] Profit optimization suggestions

### ✅ Project Management
- [x] Project lifecycle tracking
- [x] Timeline estimation
- [x] Design version control
- [x] BOM management
- [x] Quote system with revisions
- [x] Media asset storage
- [x] Customer communication

### ✅ Financial Management
- [x] Profit calculation
- [x] Cost tracking by category
- [x] Invoice generation
- [x] Expense management
- [x] Purchase order system
- [x] Vendor payment tracking
- [x] Profitability analysis

### ✅ Team Management
- [x] Staff member profiles
- [x] Skill-based assignment
- [x] Workload balancing
- [x] Performance metrics
- [x] Availability tracking
- [x] Task preferences
- [x] Communication methods

### ✅ Technical
- [x] Complete TypeScript types
- [x] RESTful API
- [x] Error handling
- [x] Logging system
- [x] Docker deployment
- [x] Database models
- [x] Security middleware

---

## 🔧 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.2+ |
| **Backend** | Node.js + Express | 18 + 4.18+ |
| **Database** | MongoDB | 5.0+ |
| **Cache** | Redis | 7.0+ |
| **Language** | TypeScript | 4.9+ |
| **HTTP Client** | Axios | 1.3+ |
| **Deployment** | Docker | Latest |

---

## 📡 API Documentation

### Key Endpoints

#### AI Services
```bash
GET  /api/ai/daily-brief         # Morning briefing
GET  /api/ai/evening-report      # Evening summary
POST /api/ai/chat                # Chat with AI
```

#### Projects
```bash
GET    /api/projects             # List projects
POST   /api/projects             # Create project
GET    /api/projects/:id         # Get project details
PUT    /api/projects/:id         # Update project
DELETE /api/projects/:id         # Delete project
```

#### Tasks
```bash
GET    /api/tasks                # List tasks
POST   /api/tasks                # Create task
PUT    /api/tasks/:id            # Update task
PATCH  /api/tasks/:id/complete   # Complete task
```

#### Full API docs: See `SETUP.md`

---

## 📊 Database Collections

```javascript
// MongoDB Collections
Organizations
Customers           // Leads and customer info
Projects           // Project records
Tasks              // Task assignments
Invoices           // Invoice tracking
Expenses           // Expense records
PurchaseOrders     // PO management
Staff              // Employee records
Vendors            // Supplier information
Designs            // Design files
Media              // Project media assets
```

---

## 🎯 Core Services

### AIService
Your intelligent business companion:
- Daily briefings and recommendations
- Evening reports and issue alerts
- Team mood tracking
- Achievement celebrations
- Context-aware advice

### TaskAutomationService
Smart task management:
- Auto-assign based on skills
- Load balancing
- Bottleneck detection
- Performance metrics
- Sequential flow management

### FinancialService
Money management engine:
- Profit calculations
- Cost tracking
- Invoice generation
- Expense management
- Profitability analysis

### WorkflowService
Complete workflow orchestration:
- 25-stage process definition
- Stage transitions
- Timeline estimation
- Progress tracking
- Milestone management

---

## 💡 Usage Examples

### Getting Started with Projects
```typescript
// Create a new project
const project = await apiClient.createProject({
  customerId: 'cust-123',
  name: 'Custom Cabinet Design',
  description: 'Build custom cabinetry for kitchen'
});

// AI immediately generates morning task
```

### Task Automation
```typescript
// When a task completes, AI automatically:
// 1. Creates next stage tasks
// 2. Finds optimal staff
// 3. Notifies team
// 4. Updates project timeline
// 5. Generates recommendations
```

### Financial Tracking
```typescript
// Get profit analysis
const analysis = financialService.calculateProjectProfit(
  project,
  laborRate,
  overheadPercentage
);

// Result includes:
// - Total revenue, costs, profit
// - Margin percentage
// - Cost breakdown
// - Risk identification
```

---

## 🔐 Security Features

- ✅ JWT authentication (7-day expiry)
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control
- ✅ Input validation & sanitization
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Error message sanitization

---

## 📈 Scaling & Performance

### Built for Growth
- Stateless API architecture
- Database connection pooling
- Redis caching layer
- Query optimization
- Lazy loading components
- Code splitting

### Production Ready
- Docker containerization
- Docker Compose orchestration
- Environment management
- Error handling & recovery
- Request logging
- Health check endpoint

---

## 🧪 Testing

```bash
# Server tests
cd server && npm test

# Client tests
cd client && npm test

# E2E tests (future)
npm run test:e2e
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **SETUP.md** | Installation and configuration |
| **ARCHITECTURE.md** | Technical architecture deep-dive |
| **PROJECT_SUMMARY.md** | What was created, next steps |
| **CONTRIBUTING.md** | Contribution guidelines |
| **API_DOCS.md** | API reference (planned) |

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See `CONTRIBUTING.md` for detailed guidelines.

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**MongoDB Connection Error**
```bash
# Ensure MongoDB is running
# Check .env settings
# Verify network connectivity
```

**Dependencies Issues**
```bash
rm -rf node_modules package-lock.json
npm install
```

See `SETUP.md` for more troubleshooting.

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅ COMPLETE
- [x] Type system
- [x] Core services
- [x] API structure
- [x] AI assistant
- [x] UI components

### Phase 2: Enhancement (Next)
- [ ] Real AI Integration (OpenAI/Claude)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Real-time notifications
- [ ] File upload system

### Phase 3: Integrations
- [ ] Payment gateways
- [ ] Accounting software
- [ ] GPS mapping
- [ ] CNC file generation
- [ ] Customer portal

### Phase 4: Advanced Features
- [ ] Machine learning optimization
- [ ] Predictive analytics
- [ ] Vendor automation
- [ ] Multi-language support
- [ ] Advanced reporting

---

## 📞 Support

- **Documentation**: See docs/ folder
- **Issues**: GitHub Issues
- **Discussion**: GitHub Discussions
- **Email**: support@shopmate.com

---

## 📄 License

MIT License - See LICENSE file for details

```
Copyright (c) 2025 ShopMate AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

Built with the vision of creating technology that:
- Makes work simpler and more enjoyable
- Treats people with respect
- Automates complexity, not relationships
- Creates a "we" feeling, not isolation

---

## 👨‍💻 Author

Created as part of the ShopMate AI initiative to revolutionize business automation for custom manufacturers and service providers.

---

## 🌟 Show Your Support

If this project is helpful, please:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 📣 Share with others
- 🤝 Contribute code

---

## 🔗 Quick Links

- **[Installation Guide](./SETUP.md)** - Get started in 5 minutes
- **[Architecture Docs](./ARCHITECTURE.md)** - Deep technical dive
- **[Project Summary](./PROJECT_SUMMARY.md)** - What was created
- **[API Reference](./server/src/routes)** - Endpoint documentation
- **[Type Definitions](./shared/types/index.ts)** - All TypeScript types

---

**Version:** 1.0.0  
**Last Updated:** October 16, 2025  
**Status:** 🟢 Active Development  
**Maintained By:** ShopMate AI Team

---

<div align="center">

### 🚀 Ready to transform your business?

[Get Started](./SETUP.md) • [Documentation](./ARCHITECTURE.md) • [Contribute](./CONTRIBUTING.md)

**ShopMate AI** - *Making business automation simple, friendly, and human-centered.*

</div>