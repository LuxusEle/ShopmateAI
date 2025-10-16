# 🚀 UAT & DEPLOYMENT WORKFLOW

## Your Setup: Upload → Git → Vercel

This document outlines your complete UAT and deployment pipeline.

---

## 📋 Overview

```
Your Local Machine
        ↓
    Make Changes
        ↓
    npm install & test
        ↓
    git push to GitHub
        ↓
  GitHub Actions CI/CD
        ↓
    Automated Tests
        ↓
    Auto Deploy to Vercel
        ↓
    Live on Vercel.app
```

---

## ✅ STEP 1: LOCAL DEVELOPMENT (Port 2589)

### 1.1 Start Your Local Environment

```powershell
# Terminal 1 - Start MongoDB
docker-compose up -d

# Terminal 2 - Start Backend
cd server
npm install
npm run dev
# Server running on http://localhost:5000

# Terminal 3 - Start Frontend
cd client
npm install
npm start
# App running on http://localhost:2589
```

### 1.2 Test Everything Works
```
✅ Visit http://localhost:2589
✅ Register test account
✅ Login
✅ See dashboard
✅ Check console for no errors
```

---

## 🔧 STEP 2: GIT SETUP

### 2.1 Connect to Your Repository

Your repo: `https://github.com/LuxusEle/ShopmateAI.git`

```powershell
# Already in saas-crm-platform folder
cd c:\Users\840 G6 New Version\Documents\ShopMateAi\saas-crm-platform

# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/LuxusEle/ShopmateAI.git

# Verify
git remote -v
# origin  https://github.com/LuxusEle/ShopmateAI.git (fetch)
# origin  https://github.com/LuxusEle/ShopmateAI.git (push)
```

### 2.2 Create Branches for Different Environments

```powershell
# Main branch (production)
git branch main

# Development/staging branch
git branch develop

# Feature branch (for current work)
git checkout -b feature/uat-setup
```

### 2.3 First Push (Configure Git)

```powershell
# Configure git (if first time)
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"

# Add all files
git add .

# Commit
git commit -m "feat: Initial MVP setup with port 2589 and Vercel config"

# Push to develop branch first
git push origin develop

# Or if main doesn't exist yet
git push -u origin main
```

---

## 📤 STEP 3: WORKFLOW - YOUR DAILY UAT CYCLE

### 3.1 Make Your Changes

```
1. Edit files locally (e.g., add new component)
2. Test on http://localhost:2589
3. Check backend on http://localhost:5000/api/health
4. Fix any bugs
```

### 3.2 Upload to Git (Every Few Hours or End of Day)

```powershell
# Check what changed
git status

# Add changes
git add .

# Commit with clear message
git commit -m "feat: Add ProjectList component with CRUD operations"

# Push to your feature branch
git push origin feature/uat-setup

# Or push directly to develop for UAT
git push origin develop

# Or push to main for production
git push origin main
```

### 3.3 Automatic Deployment Triggers

When you push:
- ✅ GitHub Actions automatically runs
- ✅ Tests run (if configured)
- ✅ Build happens
- ✅ Deploys to Vercel
- ✅ You get a live preview URL

---

## 🌐 STEP 4: VERCEL DEPLOYMENT

### 4.1 Setup Vercel Account (One Time)

```
1. Go to https://vercel.com
2. Sign up (free)
3. Connect GitHub account
4. Select repository: LuxusEle/ShopmateAI
```

### 4.2 Create Two Projects on Vercel

#### For Frontend (React)
```
Project Name: shopmate-client
Framework: Create React App
Root Directory: ./client
Environment Variables:
  REACT_APP_API_URL = https://shopmate-server.vercel.app
```

#### For Backend (Node.js)
```
Project Name: shopmate-server
Framework: Other
Root Directory: ./server
Environment Variables:
  NODE_ENV = production
  MONGODB_URI = [your MongoDB Atlas connection]
  JWT_SECRET = [generate a random secure string]
  CORS_ORIGIN = https://shopmate-client.vercel.app
```

### 4.3 Get Your Vercel Secrets

After creating projects:

```
For GitHub Actions automation, get these:
1. VERCEL_TOKEN
   - Go to https://vercel.com/account/tokens
   - Create a new token
   - Copy it

2. VERCEL_ORG_ID
   - From Vercel dashboard (team or personal)

3. VERCEL_PROJECT_ID_CLIENT
   - From client project settings

4. VERCEL_PROJECT_ID_SERVER
   - From server project settings
```

### 4.4 Add Secrets to GitHub

```
1. Go to: https://github.com/LuxusEle/ShopmateAI
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - VERCEL_TOKEN
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID_CLIENT
   - VERCEL_PROJECT_ID_SERVER
   - MONGODB_URI
   - JWT_SECRET
```

---

## 🔄 STEP 5: COMPLETE WORKFLOW (With Real Example)

### Scenario: You Add a New Feature

#### 5.1 Local Development (Day 1)
```powershell
# Create feature branch
git checkout -b feature/add-contacts-page

# Make changes to add ContactManager.tsx
# Test on http://localhost:2589 ✅

# Push to feature branch
git add .
git commit -m "feat: Add ContactManager component with full CRUD"
git push origin feature/add-contacts-page
```

#### 5.2 Create Pull Request for Review
```
1. Go to GitHub: https://github.com/LuxusEle/ShopmateAI
2. Click "Compare & pull request"
3. Base: develop, Compare: feature/add-contacts-page
4. Add description of changes
5. Click "Create pull request"
```

#### 5.3 Automated UAT Preview
```
When PR is created:
✅ GitHub Actions runs tests
✅ Builds frontend & backend
✅ Deploys to staging URLs
✅ Comments PR with preview links

You get URLs like:
- https://shopmate-client-pr-123.vercel.app (Preview)
- https://shopmate-server-pr-123.vercel.app (API Preview)

Verify changes work on preview URLs
```

#### 5.4 Merge to Develop (For Staging)
```powershell
# After verifying on preview URLs
1. Click "Merge pull request" on GitHub

# Or locally
git checkout develop
git merge feature/add-contacts-page
git push origin develop
```

#### 5.5 Deploy to Production (Main Branch)
```powershell
# When ready for production
git checkout main
git merge develop
git push origin main

# This triggers:
✅ Production build
✅ All tests run
✅ Deploy to production Vercel URLs
✅ Go live!
```

---

## 📊 ENVIRONMENT BREAKDOWN

### Development Environment (Your Machine)
```
Frontend: http://localhost:2589
Backend:  http://localhost:5000
Database: MongoDB local
Status:   Your testing ground
```

### Staging Environment (Vercel - PR Preview)
```
Frontend: https://shopmate-client-staging.vercel.app
Backend:  https://shopmate-server-staging.vercel.app
Database: MongoDB Atlas (dev)
Status:   Preview/UAT testing
```

### Production Environment (Vercel - Main Branch)
```
Frontend: https://shopmate-client.vercel.app
Backend:  https://shopmate-server.vercel.app
Database: MongoDB Atlas (production)
Status:   Live for users
```

---

## 🛠️ COMMON COMMANDS REFERENCE

### Git Commands You'll Use Frequently

```powershell
# Check status
git status

# Add changes
git add .                          # All files
git add src/components/New.tsx     # Specific file

# Commit
git commit -m "feat: description"

# Push
git push origin develop            # Push to develop
git push origin main               # Push to main

# Pull latest changes
git pull origin develop

# Create and switch branches
git checkout -b feature/my-feature
git checkout develop

# View branches
git branch -a

# Delete branch
git branch -d feature/my-feature
```

### NPM Commands

```powershell
# Start development
npm install                        # Install deps
npm run dev                        # Server (with auto-reload)
npm start                          # Client (with auto-reload)

# Build for production
npm run build                      # Both client & server

# Testing
npm test
npm run lint
```

---

## 🚨 TROUBLESHOOTING

### "Port 2589 already in use"
```powershell
# Find what's using the port
netstat -ano | findstr :2589

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port
set PORT=2590
npm start
```

### "Git push fails - authentication error"
```powershell
# Use GitHub token instead of password
# 1. Go to GitHub → Settings → Developer settings → Personal access tokens
# 2. Create new token (select 'repo' scope)
# 3. Use token as password when prompted
# Or setup SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### "Vercel deployment failed"
```
Check Vercel logs:
1. Go to https://vercel.com/dashboard
2. Click project
3. Click "Deployments"
4. Click failed deployment
5. Check "Build logs"

Common issues:
- Missing environment variables
- Wrong MongoDB connection string
- Port conflicts
- Node modules not installed
```

### "Environment variables not working"
```
For Vercel:
1. Go to project settings
2. Environment Variables
3. Make sure variables are set for correct environment
   (Development, Preview, Production)
4. Redeploy after changing

For local:
1. Check .env.local exists
2. Restart npm start
3. Check file isn't in .gitignore
```

---

## ✨ BEST PRACTICES

### 1. Branch Strategy
```
main       → Production (stable, tested)
develop    → Staging (merged features)
feature/*  → Your work (feature branches)

Never push directly to main!
Always merge through develop first.
```

### 2. Commit Messages
```
Good:
- feat: Add user authentication
- fix: Resolve dashboard loading issue
- docs: Update API documentation
- style: Fix CSS grid alignment

Bad:
- changes
- update
- bug fix
- test
```

### 3. Testing Before Push
```
ALWAYS do locally first:
1. npm run build (catches build errors)
2. npm test (catches logic errors)
3. Manual testing (catches UX errors)
4. Check console for warnings

THEN push to git
```

### 4. Environment Variables
```
NEVER commit .env files!
They're already in .gitignore

For secrets:
1. Use .env.local (local only)
2. Use Vercel dashboard (production)
3. Use GitHub Secrets (CI/CD)
```

### 5. Database Backups
```
Before major changes:
- Export MongoDB locally
- Backup Atlas database
- Tag git commit with version

After successful UAT:
- Create production backup
- Keep migration scripts
```

---

## 📈 YOUR UAT CHECKLIST

For each feature before pushing:

```
□ Tested locally on http://localhost:2589
□ No console errors or warnings
□ No TypeScript errors (npm run build)
□ Tested all happy paths
□ Tested error cases
□ Tested mobile responsiveness
□ Tested with different browsers
□ Database changes tested
□ API endpoints tested with Postman/cURL
□ Updated documentation if needed
□ Committed with clear message
□ Ready for production review
```

---

## 🎯 YOUR DEPLOYMENT FLOW

### Quick Reference

```
1. LOCAL: Edit → Test on :2589 → npm run build
2. GIT:   git add . → git commit → git push
3. ACTIONS: Tests run → Build completes
4. VERCEL: Auto deploy → Live in minutes
5. VERIFY: Test preview/production URL
6. DONE:  Feature in UAT ✅
```

---

## 📞 QUICK START (First Time)

```powershell
# 1. Setup
cd saas-crm-platform
git remote add origin https://github.com/LuxusEle/ShopmateAI.git
git branch main
git branch develop

# 2. First push
git add .
git commit -m "Initial commit: MVP ready for UAT"
git push -u origin main
git push -u origin develop

# 3. Go to Vercel
# - Connect GitHub account
# - Select ShopmateAI repo
# - Create two projects (client & server)
# - Add environment variables

# 4. Done! 
# From now on, just: make changes → git push → auto deployed
```

---

## 🔗 USEFUL LINKS

- **Your Repository**: https://github.com/LuxusEle/ShopmateAI
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Secrets**: https://github.com/LuxusEle/ShopmateAI/settings/secrets/actions
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **GitHub Actions**: https://github.com/LuxusEle/ShopmateAI/actions
- **Postman**: https://www.postman.com/ (Test API endpoints)

---

## ✅ Summary

Your UAT & Deployment workflow:

1. ✅ **Port 2589** configured for local development
2. ✅ **GitHub integration** ready for your repo
3. ✅ **Automated CI/CD** via GitHub Actions
4. ✅ **Vercel deployment** for staging & production
5. ✅ **Environment separation** with proper .env files
6. ✅ **Preview URLs** for every pull request
7. ✅ **One-click merges** to deploy to production

**Ready to test? Start with step 1 and follow the workflow!**

---

**Last Updated**: October 16, 2025  
**Status**: 🟢 Ready for UAT  
**Next**: Configure Vercel and GitHub Secrets
