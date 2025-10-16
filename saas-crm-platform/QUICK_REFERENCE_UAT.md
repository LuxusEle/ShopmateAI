# 🚀 QUICK REFERENCE - UAT & DEPLOYMENT

## 📌 Your Setup

| Component | Local | Production |
|-----------|-------|------------|
| Frontend Port | **2589** | Vercel |
| Backend Port | 5000 | Vercel |
| Database | MongoDB Local | MongoDB Atlas |
| Repository | - | github.com/LuxusEle/ShopmateAI |
| Git Branches | main, develop, feature/* | main (prod), develop (staging) |

---

## 🏃 ONE MINUTE QUICK START

```powershell
# Terminal 1
docker-compose up -d

# Terminal 2  
cd server && npm run dev

# Terminal 3
cd client && npm start

# Visit: http://localhost:2589
```

---

## 📝 DAILY WORKFLOW (TL;DR)

```powershell
# 1. Make changes locally
# 2. Test on http://localhost:2589
# 3. Commit changes
git add .
git commit -m "feat: your feature"

# 4. Push to git
git push origin develop              # Staging
# or
git push origin main                 # Production

# 5. Wait for Vercel auto-deploy ✅
```

---

## 🔑 Environment Variables

### Frontend (client/.env.local)
```
PORT=2589
REACT_APP_API_URL=http://localhost:5000
```

### Backend (server/.env)
```
PORT=5000
JWT_SECRET=your_secret_key
MONGODB_URI=mongodb://localhost:27017/shopmate-ai
CORS_ORIGIN=http://localhost:2589
```

---

## 📊 Git Branches Explained

```
main
├── Deployed to Production
├── Always stable & tested
└── Merge from develop only

develop  
├── Deployed to Staging
├── Integration testing
└── Merge PRs here first

feature/my-feature
├── Your work branch
├── Create from develop
└── Delete after merge
```

---

## 🔄 Complete Feature Flow

```
1. Create branch
   git checkout -b feature/new-component

2. Make changes
   • Edit code locally
   • Test on http://localhost:2589

3. Commit
   git add .
   git commit -m "feat: add new component"

4. Push
   git push origin feature/new-component

5. Create Pull Request
   • Go to GitHub
   • Click "Compare & pull request"
   • Get preview URLs

6. Verify Preview URLs
   • Test on staging links
   • Check mobile view
   • Verify API calls work

7. Merge to develop
   • Click "Merge pull request"
   • OR: git merge feature/...

8. Merge to main (Production)
   git checkout main
   git merge develop
   git push origin main

9. Vercel deploys automatically ✅
```

---

## 💻 Terminal Commands

### Development
```powershell
npm install              # Install dependencies
npm run dev              # Server with hot reload
npm start                # Frontend with hot reload
npm run build            # Production build
npm test                 # Run tests
npm run lint             # Check code quality
```

### Git
```powershell
git status               # See changes
git add .                # Stage all changes
git commit -m "..."      # Commit with message
git push origin develop  # Push to develop
git pull origin develop  # Pull latest
git checkout -b ...      # Create branch
git branch -a            # List all branches
```

### Docker
```powershell
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs -f   # View logs
```

---

## 🌐 URLs Reference

| Environment | Frontend | Backend | Status |
|------------|----------|---------|--------|
| **Local Dev** | http://localhost:2589 | http://localhost:5000 | 🟢 Local |
| **Staging** | shopmate-client-staging.vercel.app | shopmate-server-staging.vercel.app | 🟡 UAT |
| **Production** | shopmate-client.vercel.app | shopmate-server.vercel.app | 🔴 Live |

---

## 🧪 Testing Checklist

Before each commit:
```
□ Tested locally (npm run build)
□ No console errors (F12)
□ Mobile responsive
□ Dark/light mode (if applicable)
□ Edge cases tested
□ API calls working
□ Database queries working
```

---

## 🚨 Common Issues & Fixes

### Port 2589 already in use?
```powershell
# Find and kill process
netstat -ano | findstr :2589
taskkill /PID <PID> /F
```

### Git authentication fails?
```powershell
# Use personal access token instead of password
# Generate at: github.com/settings/tokens
```

### Vercel deployment fails?
```
1. Check: https://vercel.com/dashboard
2. Click project → Deployments → Failed build
3. Check Build Logs for errors
4. Fix locally, commit, and push again
```

### Environment variables not loading?
```
1. Check .env file exists
2. Restart npm start
3. For Vercel: Add to project settings
4. Redeploy after adding
```

---

## 📱 API Testing

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get projects (with token)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
```
1. Download from postman.com
2. Import collection (if provided)
3. Set environment variables
4. Test endpoints one by one
```

---

## 🔐 Secrets Management

### Never commit:
- .env files (passwords, keys)
- Tokens (API keys, JWT secrets)
- Database credentials

### Instead use:
- .env.local (local only, in .gitignore)
- GitHub Secrets (for CI/CD)
- Vercel Environment Variables (for production)

---

## 📈 Performance Tips

```
1. Use --production flag for builds
   npm install --production

2. Check bundle size
   npm run build

3. Monitor logs in production
   https://vercel.com/dashboard

4. Use CDN for static files (built-in Vercel)

5. Database indexes for queries
```

---

## 🎯 Release Process

```
Sprint Week → Merge to develop → Deploy to staging
                                      ↓
                            Full UAT & Testing
                                      ↓
                            Merge to main
                                      ↓
                            Deploy to production
                                      ↓
                            Monitor & Support
```

---

## 📞 Support Resources

- **GitHub Docs**: https://docs.github.com
- **Vercel Docs**: https://vercel.com/docs
- **Express.js Docs**: https://expressjs.com
- **React Docs**: https://react.dev
- **MongoDB Docs**: https://docs.mongodb.com

---

## ✅ Pre-Release Checklist

Before going to production:
```
□ All tests passing
□ No console errors/warnings
□ Tested on multiple browsers
□ Tested on mobile
□ Performance acceptable
□ All env variables set
□ Database backup created
□ Rollback plan ready
□ Team notified
□ Monitoring enabled
```

---

## 🚀 Your Next Steps

1. ✅ Run `setup.ps1` (or `setup.bat` on Windows)
2. ✅ Start services (docker, npm dev, npm start)
3. ✅ Test app locally
4. ✅ Make first commit
5. ✅ Push to GitHub
6. ✅ Configure Vercel
7. ✅ Set GitHub Secrets
8. ✅ Create production deployment
9. ✅ Celebrate! 🎉

---

**Status**: 🟢 Ready for UAT  
**Last Updated**: October 16, 2025  
**Your Repo**: https://github.com/LuxusEle/ShopmateAI
