# 🔐 Authentication System Guide

## Quick Overview

The app uses **JWT (JSON Web Tokens)** for stateless authentication. Here's the flow:

```
User enters credentials
    ↓
POST /auth/register or /auth/login
    ↓
Server validates & hashes password
    ↓
Server returns 2 tokens:
  1. accessToken (expires in 24h)
  2. refreshToken (expires in 7d)
    ↓
Frontend stores tokens in localStorage
    ↓
Every API request includes:
  Authorization: Bearer <accessToken>
    ↓
Server validates token in middleware
    ↓
If valid → Allow request ✅
If expired → Use refreshToken to get new accessToken 🔄
If invalid → Return 401 Unauthorized ❌
```

---

## 🚀 How It Works (Step by Step)

### **1. REGISTRATION**

```
POST /auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "organizationName": "My Company",
  "fullName": "John Doe"
}

Response: {
  "success": true,
  "data": {
    "staffId": "staff_...",
    "organizationId": "org_...",
    "email": "user@example.com",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": "24h"
  }
}
```

**What happens:**
1. Email is checked (must be unique)
2. Password is hashed using bcryptjs with salt 10
3. New Staff + Organization created
4. JWT tokens generated with payload:
   ```
   {
     staffId: "staff_123",
     organizationId: "org_456",
     email: "user@example.com",
     role: "admin"  // or manager, staff, viewer
   }
   ```

---

### **2. LOGIN**

```
POST /auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "data": {
    "staffId": "staff_...",
    "organizationId": "org_...",
    "role": "admin",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": "24h"
  }
}
```

**What happens:**
1. User found by email
2. Password compared with bcrypt
3. If match → tokens generated ✅
4. If no match → 401 Unauthorized ❌

---

### **3. MAKING API REQUESTS**

Every API request needs the token in the header:

```
GET /api/projects
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (if valid):
{
  "success": true,
  "data": [{ projects... }]
}

Response (if expired):
{
  "success": false,
  "error": "Token expired"
}
```

---

### **4. TOKEN REFRESH**

When access token expires, use refresh token:

```
POST /auth/refresh
Body: {
  "refreshToken": "eyJhbGc..."
}

Response: {
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "expiresIn": "24h"
  }
}
```

**What happens in React:**
```typescript
// API request returns 401 (token expired)
// Automatically call refresh endpoint
// Get new access token
// Retry original request
// User doesn't notice anything! ✨
```

---

## 🛡️ Authentication Middleware

Every request goes through `authenticate()` middleware:

```typescript
// ✅ Checks:
1. Authorization header exists
2. Token format is "Bearer <token>"
3. Token is valid JWT
4. Token hasn't expired
5. Organization exists

// Sets on req.user:
{
  staffId: string
  organizationId: string
  email: string
  role: "admin" | "manager" | "staff" | "viewer"
}

// This ensures:
- Only logged-in users can access protected routes
- Each user only sees their organization's data
- Multi-tenant isolation is enforced
```

---

## 💾 Frontend Storage

### **Where tokens are stored:**
```typescript
// localStorage (survives page refresh)
localStorage.setItem('accessToken', token)
localStorage.setItem('refreshToken', token)
localStorage.setItem('organizationId', orgId)
localStorage.setItem('user', JSON.stringify({ staffId, email, role }))
```

### **When to clear:**
```typescript
// On logout
localStorage.removeItem('accessToken')
localStorage.removeItem('refreshToken')
localStorage.removeItem('organizationId')
localStorage.removeItem('user')
```

### **When tokens are sent:**
```typescript
// APIClient automatically includes in all requests
const config = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
}
```

---

## 🔄 Auto-Refresh Flow

### **Scenario: User has been inactive for 25 hours**

```
1. User makes API request
2. accessToken expired (was 24h)
3. Server returns 401

4. APIClient catches 401
5. Calls POST /auth/refresh with refreshToken
6. refreshToken still valid (7d) ✅
7. Server returns new accessToken

8. APIClient retries original request
9. Request succeeds ✅

User sees NO loading, NO errors, NO prompts!
```

### **Scenario: Both tokens expired (7+ days inactive)**

```
1. User makes API request
2. accessToken expired
3. Server returns 401

4. APIClient tries refresh
5. refreshToken also expired ❌
6. Refresh fails

7. User redirected to login
8. User logs in again
```

---

## 🔑 Token Anatomy

### **Access Token (24 hours)**
```json
{
  "staffId": "staff_abc123",
  "organizationId": "org_xyz789",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1729104000,
  "exp": 1729190400
}
```

### **Refresh Token (7 days)**
```json
{
  "staffId": "staff_abc123",
  "organizationId": "org_xyz789",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1729104000,
  "exp": 1729536000
}
```

---

## 🚨 Error Handling

### **Authentication Errors**

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | No token in header | Login again |
| 401 Invalid token | Token tampered with | Login again |
| 401 Token expired | > 24 hours old | Auto-refresh (if refreshToken valid) |
| 401 Refresh expired | > 7 days old + not using refreshToken | Login again |
| 403 Forbidden | User role lacks permission | Use account with higher role |
| 400 Bad Request | Invalid email/password format | Check input format |

---

## ✨ Multi-Tenant Isolation

Every operation is automatically scoped to the user's organization:

```typescript
// In all controllers
const query = { organizationId: req.user.organizationId }

// Example: Get projects
// Only returns projects where organizationId matches!
const projects = await ProjectModel.find({
  organizationId: req.user.organizationId  // ← Enforced
})

// This means:
// - Company A cannot see Company B's data
// - Even if they guess a project ID
// - The database query filters it out
// - Complete data isolation ✅
```

---

## 🎯 Environment Variables

```env
# .env file (server)
JWT_SECRET=your-super-secret-key-minimum-32-chars
JWT_EXPIRATION=24h
MONGODB_URI=mongodb://localhost:27017/shopmate
PORT=5000
```

⚠️ **Important:** Change JWT_SECRET in production!

---

## 📋 Summary

| Concept | Details |
|---------|---------|
| **Method** | JWT (JSON Web Tokens) |
| **Access Token Lifetime** | 24 hours |
| **Refresh Token Lifetime** | 7 days |
| **Password Hashing** | bcryptjs (salt 10) |
| **Multi-tenant** | ✅ Yes (enforced via organizationId) |
| **Auto-refresh** | ✅ Yes (seamless) |
| **Storage** | localStorage (client-side) |
| **Header Format** | `Authorization: Bearer <token>` |
| **Endpoints** | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` |

---

## 🎨 User Login Flow in UI

```
┌─────────────┐
│  Login Page │
└──────┬──────┘
       │ User enters email & password
       ↓
┌──────────────────┐
│ POST /auth/login │ ← API call
└──────┬───────────┘
       │
       ├─ Success (200) ✅
       │   ├─ Save accessToken to localStorage
       │   ├─ Save refreshToken to localStorage
       │   ├─ Save organizationId to localStorage
       │   └─ Redirect to Dashboard
       │
       └─ Failed (401) ❌
           └─ Show "Invalid email or password"
```

---

**Now you're ready to build the UI! The token stuff is handled automatically by the APIClient.** 🚀
