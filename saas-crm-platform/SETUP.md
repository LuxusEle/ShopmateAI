# ShopMate AI - Installation & Setup Guide

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd saas-crm-platform

# Start all services
docker-compose up --build

# Access:
# - Client: http://localhost:3000
# - Server API: http://localhost:5000
# - MongoDB: localhost:27017
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js >= 14
- MongoDB >= 4.4
- npm >= 6

#### 1. Server Setup

```bash
cd server

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run development server
npm run dev

# Server will run on http://localhost:5000
```

#### 2. Client Setup

```bash
cd client

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm start

# Client will run on http://localhost:3000
```

## 📋 Project Structure

```
saas-crm-platform/
├── server/                    # Backend (Express + Node.js)
│   ├── src/
│   │   ├── index.ts          # Entry point
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── services/         # Business logic
│   │   │   ├── AIService.ts
│   │   │   ├── TaskAutomationService.ts
│   │   │   ├── FinancialService.ts
│   │   │   └── WorkflowService.ts
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   └── utils/            # Utility functions
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── client/                    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/       # React components
│   │   │   └── AIAssistant.tsx
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React context
│   │   ├── styles/           # CSS styles
│   │   └── utils/            # Utility functions
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── shared/                    # Shared types & constants
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── constants/
│
├── docker-compose.yml        # Docker compose configuration
└── README.md
```

## 🔧 Configuration

### Server Environment Variables (.env)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=shopmate_ai

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# AI Integration
AI_MODEL=gpt-3.5-turbo
AI_API_KEY=your-api-key
```

### Client Environment Variables (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_AI_FEATURES_ENABLED=true
```

## 🏗️ Core Services

### 1. AI Service (`AIService.ts`)
- Daily morning briefings
- Evening routine reports
- Conversational AI interactions
- Task recommendations
- Financial insights

### 2. Task Automation Service (`TaskAutomationService.ts`)
- Automatic task assignment based on staff skills
- Sequential task flow management
- Bottleneck identification
- Performance metrics calculation

### 3. Financial Service (`FinancialService.ts`)
- Project profit analysis
- Cost tracking and breakdown
- Invoice generation
- Expense management
- Profitability reporting

### 4. Workflow Service (`WorkflowService.ts`)
- 25-stage complete workflow
- Stage transitions
- Timeline estimation
- Progress tracking

## 🗄️ Database Schema

### Collections (MongoDB)

- **Organizations** - Company information
- **Projects** - Project details and status
- **Tasks** - Individual tasks and assignments
- **Customers** - Customer information
- **Invoices** - Invoice records
- **Expenses** - Expense tracking
- **Staff** - Employee/staff members
- **Vendors** - Vendor/supplier information

## 📡 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task

### AI
- `GET /api/ai/daily-brief` - Get daily briefing
- `GET /api/ai/evening-report` - Get evening report
- `POST /api/ai/chat` - Chat with AI

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice

### Automation
- `GET /api/automation/config` - Get automation settings
- `POST /api/automation/config` - Update settings
- `POST /api/automation/trigger` - Trigger automation

### Vendors
- `GET /api/vendors` - List vendors
- `POST /api/vendors` - Create vendor

### Staff
- `GET /api/staff` - List staff
- `POST /api/staff` - Create staff member

## 🧪 Testing

```bash
# Server tests
cd server
npm test

# Client tests
cd client
npm test
```

## 🚢 Deployment

### Production Build

```bash
# Server
cd server
npm run build
NODE_ENV=production npm start

# Client
cd client
npm run build
# Deploy build folder to hosting
```

### Docker Deployment

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📊 Key Features Implemented

✅ Complete workflow management (25 stages)
✅ AI-powered assistance and automation
✅ Task automation and assignment
✅ Financial tracking and profit analysis
✅ Project timeline management
✅ Vendor and supplier management
✅ Expense tracking
✅ Invoice generation
✅ Daily AI briefings (morning & evening)
✅ Responsive UI components
✅ Type-safe TypeScript throughout

## 🔜 Future Enhancements

- [ ] Advanced AI with natural language processing
- [ ] Real-time notifications
- [ ] Mobile app (iOS/Android)
- [ ] GPS integration for field management
- [ ] CNC file generation and management
- [ ] Advanced reporting and analytics
- [ ] Vendor bidding system
- [ ] Customer portal
- [ ] Accounting software integration
- [ ] Payment gateway integration

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution: Ensure MongoDB is running
# Windows
mongod --dbpath "C:\Program Files\MongoDB\Server\5.0\data"

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution: Change PORT in .env or kill process using port
# Find process: lsof -i :5000
# Kill process: kill -9 <PID>
```

### Dependencies Issues
```
rm -rf node_modules
rm package-lock.json
npm install
```

## 📞 Support

For issues and questions:
1. Check existing issues in repository
2. Create detailed bug report with reproduction steps
3. Contact development team

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

**Version:** 1.0.0  
**Last Updated:** October 2025  
**Status:** Active Development

*ShopMate AI - Making business automation simple, friendly, and human-centered.*
