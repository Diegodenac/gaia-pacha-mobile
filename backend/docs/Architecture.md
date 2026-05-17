# Backend API Architecture

## Architectural Pattern

**Monolithic Express.js REST API** - Single server handling all endpoints for authentication, products, EcoServices, and file uploads.

### Design Philosophy

- Single responsibility per route handler
- Centralized database connection pool
- JWT for stateless authentication
- Google Drive API for scalable file storage
- CORS enabled for mobile client access

---

## File Organization

```
backend/
├── index.js                  # Express app, routes, middleware, error handling
├── .env                      # Environment variables (local only)
├── .env.example              # Template
├── package.json              # Dependencies
└── docs/                     # Documentation
    ├── Architecture.md       # This file
    ├── Setup.md
    ├── Features.md
    ├── API_SPECIFICATION.md
    └── DATABASE_SCHEMA.md
```

### Current Structure

All code currently in `index.js` (monolithic). Future refactoring could separate into:

```
backend/
├── config/                   # Database, environment setup
├── routes/                   # Express route handlers
├── controllers/              # Request logic
├── services/                 # Business logic
├── models/                   # Database queries
└── middleware/               # Auth, CORS, error handling
```

---

## Request/Response Architecture

### Request Flow Diagram

```
HTTP Request (from mobile app or external client)
    ↓
Express Router
    ↓
CORS Middleware (validate origin)
    ↓
Auth Middleware (verify JWT token)
    ↓
Route Handler (parse request body/params)
    ↓
Business Logic (validate input, interact with DB)
    ↓
Database Query (PostgreSQL via connection pool)
    ↓
Response Transform (format JSON)
    ↓
HTTP Response (send to client)
    ↓
Error Handler (catch exceptions, send error response)
```

### Response Format

All endpoints return JSON in consistent format:

```json
{
  "success": true,
  "data": { /* response payload */ },
  "error": null,
  "timestamp": "2026-05-17T10:00:00Z"
}
```

Error response:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired JWT token"
  },
  "timestamp": "2026-05-17T10:00:00Z"
}
```

---

## Modules & Responsibilities

### 1. Authentication Module

**Files**: `index.js` (routes: `/auth/register`, `/auth/login`, `/auth/logout`)

**Responsibilities**:
- User registration with email validation
- Password hashing (bcrypt)
- JWT token generation (30-day expiration)
- Token verification middleware

**Flow**:
```
POST /auth/register
  ↓
Validate email format & uniqueness
  ↓
Hash password
  ↓
Insert into users table
  ↓
Generate JWT token
  ↓
Return token + user data
```

**Token Format**:
```
{
  "userId": 123,
  "email": "user@example.com",
  "userType": "customer|ecoservice",
  "iat": 1672531200,
  "exp": 1705149600  # 30 days later
}
```

### 2. Product Management Module

**Files**: `index.js` (routes: `/products`, `/products/:id`)

**Responsibilities**:
- List products with pagination & filtering
- Get individual product details
- Create products (EcoService only)
- Update products (owner only)
- Delete products (owner only)

**Key Features**:
- Category assignment (foreign key to categories table)
- EcoService ownership validation
- Pagination (default 10 items per page)
- Filtering by category

### 3. EcoService Module

**Files**: `index.js` (routes: `/ecoservices/:id`, `/ecoservices/:id/products`)

**Responsibilities**:
- Get EcoService profile
- Update EcoService info
- List EcoService products
- View EcoService stats (planned)
- Manage validation status (admin only)

**Validation Workflow**:
- Status: `pendiente`, `aprobado`, `rechazado`
- Only approved EcoServices show products in marketplace

### 4. File Upload Module

**Files**: `index.js` (route: `/uploads`)

**Responsibilities**:
- Receive multipart/form-data uploads
- Validate file type and size
- Upload to Google Drive
- Return cloud URL to client
- Manage Google Drive folder permissions

**Integration with Google Drive**:
```
File upload request
  ↓
Multer middleware (store in memory)
  ↓
Google Service Account auth
  ↓
Create file in Drive folder
  ↓
Set public read permission
  ↓
Return shareable URL
```

### 5. Recommendation Engine Integration

**Files**: `index.js` (route: `/recommendations/:userId`)

**Responsibilities**:
- Proxy requests to BackAlgoritmo microservice
- Forward user ID to algorithm
- Return recommendations to mobile app

**Flow**:
```
GET /recommendations/:userId (from mobile)
  ↓
Verify JWT token
  ↓
Axios call to BackAlgoritmo
  ↓ (GET /api/recomendaciones/ecoservices/:userId)
BackAlgoritmo processes request
  ↓
Return 10 EcoServices
  ↓
Proxy response back to mobile
```

**Endpoint**: `https://motor-recomendaciones-api.onrender.com`

---

## Database Connection

### Connection Pool Configuration

```
Node.js PostgreSQL Pool (pg library)
    ↓
Aiven PostgreSQL (cloud-hosted)
    ↓
Connection string: postgresql://user:pass@host:port/dbname
```

### Pool Parameters

- **max**: 10 concurrent connections
- **idle**: 30 seconds before closing
- **connection timeout**: 5 seconds
- **statement timeout**: 30 seconds (per query)

### Query Execution

```typescript
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]  // Parameterized to prevent SQL injection
)
```

---

## Authentication & Authorization

### JWT Token Lifecycle

1. **Generation** (on login/register)
   - Payload includes userId, email, userType
   - Expiration: 30 days from now
   - Signed with JWT_SECRET from .env

2. **Storage** (on mobile)
   - Stored in SecureStore (encrypted)
   - Persists across app restarts

3. **Usage** (on requests)
   - Sent as `Authorization: Bearer {token}` header
   - Verified by auth middleware
   - If invalid: return 401 Unauthorized

4. **Expiration** (after 30 days)
   - Middleware detects expired token
   - Returns 401 Unauthorized
   - Mobile app logs out user

### Role-Based Access Control

```
Customer: Can browse products, register, login
EcoService: Can create/edit products + all customer features
Admin: (not yet implemented)
```

### Example: Product Update Authorization

```
PUT /products/123 (update product)
  ↓
Extract JWT token from header
  ↓
Verify token & extract userId
  ↓
Query product.ecoservices_id (owner check)
  ↓
IF userId owns product:
  ✓ Allow update
ELSE:
  ✗ Return 403 Forbidden
```

---

## Error Handling Strategy

### Error Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad request | Missing required field, invalid format |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | User doesn't own resource |
| 404 | Not found | Product ID doesn't exist |
| 409 | Conflict | Email already registered |
| 500 | Server error | Unexpected error (bug) |

### Error Handling Middleware

```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  if (err.code === 'UNIQUENESS_VIOLATION') {
    return res.status(409).json({
      success: false,
      error: { code: 'CONFLICT', message: 'Email already exists' }
    })
  }
  
  // Catch-all
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Server error' }
  })
})
```

---

## Integration Points

### 1. Mobile Application

**Connection**: Axios HTTP client on port 3000

**Protocol**: HTTPS (production) / HTTP (local dev)

**Base URL**: `https://gaia-pacha-backend.onrender.com` (production)

**Headers Required**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### 2. BackAlgoritmo Microservice

**Connection**: Axios outbound call to recommendation engine

**URL**: `https://motor-recomendaciones-api.onrender.com`

**Usage**: Proxy `/api/recomendaciones/*` endpoints

**Timeout**: 10 seconds (long polling acceptable)

### 3. Google Drive API

**Connection**: Service account authentication

**Permissions**: Read/Write in designated folder

**Usage**: Store product images, return URLs

**Error Handling**: Retry on network failure, fallback to local storage (if implemented)

---

## Performance Considerations

### Database Optimization

- Index on `users.email` (fast login lookup)
- Index on `productos.ecoservices_id` (filter by provider)
- Index on `customer_intereses.customer_id` (recommendations)
- Connection pooling prevents connection exhaustion

### Caching Strategy

- HTTP response caching: products cache for 5 minutes (mobile TanStack Query)
- Database query optimization: parameterized queries prevent reparsing
- No server-side caching (stateless REST API)

### Scalability Path

- Current: Single backend instance on Render (adequate for MVP)
- Future: Database connection pooling optimization
- Future: Read replicas for reporting queries
- Future: Cache layer (Redis) for recommendations

---

## Security Architecture

### Input Validation

- Email format validation (regex)
- Password minimum length (8+ characters)
- File upload type restrictions (.jpg, .png only)
- File size limits (10MB max)

### Data Protection

- Passwords hashed with bcrypt (not stored as plain text)
- JWT tokens signed with secret key
- CORS restricts cross-origin requests
- No sensitive data in error messages

### HTTPS (Production)

- All endpoints require HTTPS
- Enforced by .env `NODE_ENV=production`
- Render handles SSL/TLS termination

---

## Monitoring & Logging

### Current Implementation

- Console logs to stdout
- Render captures logs in dashboard
- Error stack traces logged for debugging

### Future Logging

- Structured logging (Winston/Morgan)
- Request timing metrics
- Database query performance tracking
- Error alerting (Sentry/Datadog)

---

## Deployment Architecture

### Render Deployment

```
GitHub Repository
    ↓ (git push)
Render CI/CD
    ↓
Build Docker image
    ↓
Deploy to Render instance
    ↓
Start Node.js process
    ↓
Listen on PORT from .env
    ↓
Health check (/health endpoint)
    ↓
Route traffic from https://gaia-pacha-backend.onrender.com
```

### Environment Configuration on Render

```
DATABASE_URL → Aiven PostgreSQL
JWT_SECRET → Production secret key
GOOGLE_DRIVE_FOLDER_ID → Production folder
GOOGLE_SERVICE_ACCOUNT_KEY → Service account JSON
PORT → 3000 (internal)
NODE_ENV → production
CORS_ORIGIN → https://app.example.com
```

---

## Future Architecture Improvements

### Refactoring (Low Priority)

- Separate `index.js` into routes/ controllers/ services/ models/
- Add validation middleware (Joi/Zod)
- Add request logging (Morgan)
- Add structured error classes

### Features (Medium Priority)

- Admin dashboard for EcoService validation
- Email notifications (nodemailer)
- Order management module
- User analytics tracking

### Scalability (High Priority for post-MVP)

- Kubernetes deployment (from Render)
- Read replica for reports
- Cache layer (Redis)
- Message queue (Bull) for async jobs

---

## Summary

The backend is a straightforward Express.js monolith providing RESTful access to PostgreSQL data, with JWT authentication and Google Drive integration. The architecture prioritizes **simplicity** for MVP development while maintaining **clean layers** (routes → logic → database) for future scaling.

See [API_SPECIFICATION.md](API_SPECIFICATION.md) for complete endpoint reference.
See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for schema details.
