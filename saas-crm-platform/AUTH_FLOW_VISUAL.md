# 🔐 Complete Authentication Flow (Visual Guide)

## Registration Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. User clicks "Create one" button                                │
│     ↓                                                               │
│  2. React LoginPage renders RegisterForm                           │
│     ↓                                                               │
│  3. User fills in:                                                 │
│     • Full Name: "John Doe"                                        │
│     • Organization: "Acme Corp"                                    │
│     • Email: "john@acme.com"                                       │
│     • Password: "SecurePass123"                                    │
│     • Confirm Password: "SecurePass123"                            │
│     ↓                                                               │
│  4. User clicks "Create Account" button                            │
│     ↓                                                               │
│  5. React validation:                                              │
│     ✓ All fields filled                                            │
│     ✓ Passwords match                                              │
│     ✓ Password >= 6 chars                                          │
│     ↓                                                               │
│  6. APIClient.register() sends:                                    │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ POST /auth/register                                     │  │
│     │ Content-Type: application/json                          │  │
│     │                                                          │  │
│     │ {                                                        │  │
│     │   "email": "john@acme.com",                            │  │
│     │   "password": "SecurePass123",                         │  │
│     │   "fullName": "John Doe",                             │  │
│     │   "organizationName": "Acme Corp"                     │  │
│     │ }                                                        │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│  7. Loading spinner shown, inputs disabled                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ HTTP
┌─────────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  8. Request arrives at POST /auth/register                         │
│     ↓                                                               │
│  9. Route handler validates:                                       │
│     ✓ Email format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/                 │
│     ✓ Password length: >= 6 chars                                 │
│     ↓                                                               │
│ 10. Check if email exists in StaffModel:                          │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ const existingStaff =                                    │  │
│     │   await StaffModel.findOne({ email })                   │  │
│     │                                                          │  │
│     │ if (existingStaff) {                                    │  │
│     │   return 409 "Email already registered"                │  │
│     │ }                                                        │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│ 11. Hash password with bcryptjs:                                   │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ const salt = await bcryptjs.genSalt(10)                 │  │
│     │ const hashedPassword =                                  │  │
│     │   await bcryptjs.hash(password, salt)                   │  │
│     │                                                          │  │
│     │ Result:                                                 │  │
│     │ $2a$10$nOUIs5kJ...someLongHashString...                │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│ 12. Create Organization in database:                              │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ const org = new OrganizationModel({                      │  │
│     │   id: "org_" + uuidv4(),                               │  │
│     │   name: "Acme Corp",                                   │  │
│     │   createdAt: new Date()                                │  │
│     │ })                                                       │  │
│     │                                                          │  │
│     │ await org.save()                                        │  │
│     │ // MongoDB creates record                              │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│ 13. Create Staff member (admin) in database:                       │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ const staff = new StaffModel({                           │  │
│     │   id: "staff_" + uuidv4(),                             │  │
│     │   organizationId: org.id,                              │  │
│     │   email: "john@acme.com",                              │  │
│     │   password: hashedPassword,  // bcrypt hash             │  │
│     │   name: "John Doe",                                    │  │
│     │   role: "admin",                // First user = admin    │  │
│     │   status: "active"                                      │  │
│     │ })                                                       │  │
│     │                                                          │  │
│     │ await staff.save()                                      │  │
│     │ // MongoDB creates record                              │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│ 14. Generate JWT tokens:                                           │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ const tokenPayload = {                                  │  │
│     │   staffId: staff.id,                                   │  │
│     │   organizationId: org.id,                              │  │
│     │   email: staff.email,                                  │  │
│     │   role: "admin"                                         │  │
│     │ }                                                        │  │
│     │                                                          │  │
│     │ // Access Token (24 hours)                             │  │
│     │ const accessToken = jwt.sign(                          │  │
│     │   tokenPayload,                                         │  │
│     │   JWT_SECRET,                                           │  │
│     │   { expiresIn: "24h" }                                │  │
│     │ )                                                        │  │
│     │                                                          │  │
│     │ // Refresh Token (7 days)                              │  │
│     │ const refreshToken = jwt.sign(                         │  │
│     │   tokenPayload,                                         │  │
│     │   JWT_SECRET,                                           │  │
│     │   { expiresIn: "7d" }                                 │  │
│     │ )                                                        │  │
│     │                                                          │  │
│     │ // Tokens are base64 JWT strings                       │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│ 15. Send response (200 OK):                                        │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ {                                                        │  │
│     │   "success": true,                                     │  │
│     │   "data": {                                            │  │
│     │     "staffId": "staff_abc123xyz",                     │  │
│     │     "organizationId": "org_xyz789abc",               │  │
│     │     "email": "john@acme.com",                        │  │
│     │     "role": "admin",                                  │  │
│     │     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5...",   │  │
│     │     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5...",  │  │
│     │     "expiresIn": "24h"                               │  │
│     │   },                                                  │  │
│     │   "message": "Account created successfully"           │  │
│     │ }                                                        │  │
│     └──────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ HTTP
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ 16. JavaScript receives response:                                  │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ if (response.success) {                                 │  │
│     │   // Save tokens to browser storage                    │  │
│     │   localStorage.setItem(                                │  │
│     │     'accessToken',                                     │  │
│     │     response.data.accessToken                          │  │
│     │   )                                                     │  │
│     │                                                          │  │
│     │   localStorage.setItem(                                │  │
│     │     'refreshToken',                                    │  │
│     │     response.data.refreshToken                         │  │
│     │   )                                                     │  │
│     │                                                          │  │
│     │   localStorage.setItem(                                │  │
│     │     'organizationId',                                  │  │
│     │     response.data.organizationId                       │  │
│     │   )                                                     │  │
│     │                                                          │  │
│     │   localStorage.setItem(                                │  │
│     │     'user',                                            │  │
│     │     JSON.stringify({                                  │  │
│     │       staffId: response.data.staffId,                │  │
│     │       email: response.data.email,                    │  │
│     │       role: response.data.role                       │  │
│     │     })                                                 │  │
│     │   )                                                     │  │
│     │ }                                                        │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│ 17. localStorage now contains:                                     │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ localStorage = {                                        │  │
│     │   accessToken: "eyJhbGci...",                          │  │
│     │   refreshToken: "eyJhbGci...",                         │  │
│     │   organizationId: "org_xyz789abc",                    │  │
│     │   user: {                                              │  │
│     │     staffId: "staff_abc123xyz",                       │  │
│     │     email: "john@acme.com",                          │  │
│     │     role: "admin"                                     │  │
│     │   }                                                     │  │
│     │ }                                                        │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│ 18. APIClient sets Authorization header:                           │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ APIClient.setAuthHeader(accessToken)                   │  │
│     │ // Now all future requests include:                    │  │
│     │ // Authorization: Bearer eyJhbGci...                   │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│ 19. Clear form and redirect to Dashboard:                          │
│     ┌──────────────────────────────────────────────────────────┐  │
│     │ setRegisterForm({                                       │  │
│     │   email: '',                                            │  │
│     │   password: '',                                         │  │
│     │   confirmPassword: '',                                 │  │
│     │   fullName: '',                                         │  │
│     │   organizationName: ''                                 │  │
│     │ })                                                       │  │
│     │                                                          │  │
│     │ navigate('/dashboard')  // React Router redirect       │  │
│     └──────────────────────────────────────────────────────────┘  │
│     ↓                                                               │
│ 20. User now sees Dashboard with welcome message:                  │
│     "Welcome back, john@acme.com!"                                │
│                                                                     │
│     ✅ Registration Complete! 🎉                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Login Flow (Existing User)

```
USER LOGIN FLOW (SIMPLIFIED)

1. User enters email & password
2. Click "Sign In"
3. Frontend sends:
   POST /auth/login
   {
     "email": "john@acme.com",
     "password": "SecurePass123"
   }

4. Server:
   ✓ Find user by email in StaffModel
   ✓ bcrypt.compare(providedPassword, storedHash)
   ✓ If match: Generate tokens
   ✓ If no match: Return 401

5. Frontend receives tokens:
   {
     "success": true,
     "data": {
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc...",
       ...
     }
   }

6. Save to localStorage
7. Set Authorization header
8. Redirect to Dashboard
```

---

## API Request with Token

```
EVERY API REQUEST INCLUDES AUTH

Example: GET /api/projects

Frontend Code:
┌──────────────────────────────────────┐
│ const token = localStorage.getItem(  │
│   'accessToken'                      │
│ )                                    │
│                                      │
│ const response = await fetch(        │
│   'http://localhost:5000/api/...',   │
│   {                                  │
│     headers: {                       │
│       'Authorization':               │
│         `Bearer ${token}`            │
│     }                                │
│   }                                  │
│ )                                    │
└──────────────────────────────────────┘

HTTP Header Sent:
┌──────────────────────────────────────┐
│ Authorization: Bearer                │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 │
│ eyJzdGFmZklkIjoic3RhZmZfYWJjMTIz...  │
│ eyJleHAiOjE3MjkxODEyMDB9...          │
└──────────────────────────────────────┘

Server Middleware (authenticate):
┌──────────────────────────────────────┐
│ 1. Extract "Bearer eyJhbGc..." from  │
│    Authorization header              │
│                                      │
│ 2. Remove "Bearer " prefix           │
│                                      │
│ 3. jwt.verify(token, JWT_SECRET)     │
│                                      │
│ 4. If valid: req.user = {            │
│      staffId: "staff_abc123",        │
│      organizationId: "org_xyz",      │
│      email: "john@acme.com",         │
│      role: "admin"                   │
│    }                                 │
│                                      │
│ 5. If invalid: return 401            │
│                                      │
│ 6. If expired: return 401 + error    │
│    "Token expired"                   │
└──────────────────────────────────────┘

Controller receives req.user:
┌──────────────────────────────────────┐
│ // Every query filtered by org       │
│ const projects = await Project.find({│
│   organizationId: req.user.organizationId
│   // Only this org's projects!       │
│ })                                   │
│                                      │
│ // Return 200 with data              │
│ res.json({ success: true, data })    │
└──────────────────────────────────────┘
```

---

## Token Refresh on Expiry

```
SCENARIO: AccessToken Expired (> 24 hours)

Timeline:
─────────────────────────────────────────
T=0h:     User logs in
          accessToken generated (24h expiry)
          refreshToken generated (7d expiry)
          Both stored in localStorage

T=24h:    User makes API request
          accessToken sent in header

Server Response:
┌─────────────────────────────────┐
│ 401 Unauthorized                │
│ {                               │
│   "error": "Token expired"      │
│ }                               │
└─────────────────────────────────┘

Frontend Interceptor:
┌─────────────────────────────────┐
│ if (error.status === 401) {     │
│   // Try to refresh token       │
│   const refreshToken =          │
│     localStorage.getItem(       │
│       'refreshToken'            │
│     )                           │
│                                 │
│   POST /auth/refresh            │
│   {                             │
│     "refreshToken": "eyJ..."    │
│   }                             │
│ }                               │
└─────────────────────────────────┘

Server (refresh endpoint):
┌─────────────────────────────────┐
│ jwt.verify(refreshToken)        │
│ // Still valid (< 7 days) ✓     │
│                                 │
│ Generate NEW accessToken        │
│ (24h from now)                  │
│                                 │
│ Return new token                │
└─────────────────────────────────┘

Frontend:
┌─────────────────────────────────┐
│ // Save new accessToken         │
│ localStorage.setItem(           │
│   'accessToken',                │
│   response.data.accessToken     │
│ )                               │
│                                 │
│ // Set new header               │
│ APIClient.setAuthHeader(        │
│   response.data.accessToken     │
│ )                               │
│                                 │
│ // Retry original request       │
│ return retryOriginalRequest()   │
│                                 │
│ // User sees NO interruption! ✨│
│ Request succeeds                │
└─────────────────────────────────┘

Result: User stays logged in seamlessly!
```

---

## Password Security

```
PASSWORD STORAGE (bcryptjs)

User enters: "MyPassword123"
         ↓
   bcryptjs hashing process:
         ↓
   1. Generate random salt (10 rounds)
      Salt: $2a$10$nOUIs5kJ...abcdef
         ↓
   2. Hash password with salt
      Hash: $2a$10$nOUIs5kJ...
            alongstringof64charactershere...
            ...verysequreandunique
         ↓
   3. Store ONLY the hash in database
      
   Database:
   {
     email: "john@acme.com",
     password: "$2a$10$nOUIs5kJ...(full hash)"
                                  ↑ NOT the actual password!
   }

Login with password: "MyPassword123"
         ↓
   bcryptjs.compare("MyPassword123", hash)
         ↓
   1. Hash provided password using stored salt
   2. Compare two hashes
   3. If match: ✓ Correct password
      If no match: ✗ Wrong password
         ↓
   Result: Original password NEVER stored!
          Even admin can't see original password
          Even if database hacked, passwords safe
```

---

## Multi-Tenant Isolation

```
COMPANY A (organizationId: "org_company_a")
│
├─ John (staffId: "staff_john")
│  └─ accessToken contains org_company_a
│
├─ Projects:
│  ├─ Website Redesign
│  ├─ Mobile App
│  └─ Server Migration
│
└─ Customers:
   ├─ Client A
   └─ Client B

─────────────────────────────────────────

COMPANY B (organizationId: "org_company_b")
│
├─ Jane (staffId: "staff_jane")
│  └─ accessToken contains org_company_b
│
├─ Projects:
│  ├─ CRM System
│  └─ Data Analysis
│
└─ Customers:
   ├─ Customer X
   └─ Customer Y

─────────────────────────────────────────

ISOLATION ENFORCED AT THREE LEVELS:

1. JWT Token Level:
   John's token: { organizationId: "org_a", ... }
   Jane's token: { organizationId: "org_b", ... }

2. Middleware Level:
   req.user.organizationId extracted from token
   Every route checks this value

3. Database Query Level:
   GET /api/projects
   ↓
   Query: { organizationId: req.user.organizationId }
   ↓
   Only returns "org_a" projects for John
   Only returns "org_b" projects for Jane

RESULT:
✓ John CANNOT see Jane's projects
✓ Jane CANNOT see John's projects
✓ Even if they guess a project ID
✓ Database filtering prevents access
✓ Complete data isolation
```

---

**Summary: Secure, multi-tenant, token-based authentication! 🔐**
