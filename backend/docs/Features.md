# Backend Features

## Implemented Features

### Authentication & User Management

- **User Registration** - Create account with email and password
- **User Login** - Authenticate with credentials, receive JWT token
- **User Logout** - Invalidate session (token-based)
- **JWT Token Management** - 30-day expiration, auto-refresh (planned)
- **Password Hashing** - bcrypt for secure storage
- **Session Persistence** - Token stored in SecureStore on mobile

### Product Management (CRUD)

- **List Products** - Paginated, filterable by category
- **Get Product Details** - Full product information
- **Create Product** - EcoService only, with image upload
- **Update Product** - Edit price, description, availability
- **Delete Product** - Remove from marketplace
- **Category Assignment** - Link products to categories
- **Price & Inventory** - Track product pricing and stock (basic)

### EcoService Management

- **Get EcoService Profile** - Public profile information
- **Update EcoService Profile** - Edit name, description, contact info
- **List EcoService Products** - Products by provider
- **View EcoService Stats** - Performance metrics (planned)
- **Validation Workflow** - Status tracking (pendiente, aprobado, rechazado)
- **Profile Verification** - Admin approval process (planned)

### File Uploads

- **Image Upload to Google Drive** - Multipart form-data handling
- **URL Generation** - Return shareable links
- **File Type Validation** - Accept jpg, png, gif
- **Size Limits** - 10MB max per file
- **Multiple Uploads** - Batch upload support
- **Automatic Permissions** - Set public read on Drive

### Recommendation Engine Integration

- **Category Recommendations** - Top user interests from BackAlgoritmo
- **EcoService Recommendations** - Personalized providers (10 per request)
- **Product Recommendations** - Suggested items (20 per request)
- **Proxy Integration** - Backend routes to `https://motor-recomendaciones-api.onrender.com`
- **Result Caching** - Mobile app caches results

### API Features

- **CORS Support** - Cross-origin requests from mobile app
- **Error Handling** - Standardized error responses
- **Request Validation** - Input sanitization
- **Rate Limiting** - (planned) Prevent abuse
- **Request Logging** - (planned) Monitor API usage
- **Health Check** - (planned) Endpoint status monitoring

---

## Core Modules & Their Responsibilities

### Module: Authentication

**Core Endpoints**:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

**Responsibilities**:
- Validate email format and uniqueness
- Hash passwords with bcrypt
- Generate JWT tokens with 30-day expiration
- Extract and verify tokens from Authorization header
- Prevent duplicate registrations

**Key Data**:
- users table: id, email, password_hash, name, user_type, created_at, updated_at
- JWT payload: userId, email, userType, iat, exp

**Dependencies**:
- PostgreSQL (users table)
- JWT library (token generation/verification)
- bcrypt (password hashing)

**Error Cases**:
- Email already registered (409 Conflict)
- Invalid password format (400 Bad Request)
- User not found (404 Not Found)
- Token expired (401 Unauthorized)

### Module: Product Management

**Core Endpoints**:
- `GET /products` (list)
- `GET /products/:id` (detail)
- `POST /products` (create)
- `PUT /products/:id` (update)
- `DELETE /products/:id` (delete)

**Responsibilities**:
- Fetch products with pagination (default: 10 per page)
- Filter by category
- Validate product ownership (only owner can edit/delete)
- Link products to EcoServices and categories
- Handle product metadata (price, description, images)

**Key Data**:
- productos table: id, ecoservices_id, category_id, name, description, price, image_url, created_at, updated_at
- categories table: id, name, description

**Dependencies**:
- PostgreSQL (productos, categories tables)
- JWT verification (check owner)
- Upload module (if image updates)

**Query Examples**:
```sql
-- List customer-visible products
SELECT * FROM productos 
WHERE estado_validacion = 'aprobado'
LIMIT 10 OFFSET 0

-- Get EcoService products
SELECT * FROM productos 
WHERE ecoservices_id = $1

-- Filter by category
SELECT * FROM productos 
WHERE category_id = $1 AND estado_validacion = 'aprobado'
```

**Error Cases**:
- Product not found (404)
- User not authorized to edit (403 Forbidden)
- Invalid category_id (400 Bad Request)

### Module: EcoService Management

**Core Endpoints**:
- `GET /ecoservices/:id`
- `PUT /ecoservices/:id`
- `GET /ecoservices/:id/products`
- `GET /ecoservices/:id/stats` (planned)

**Responsibilities**:
- Retrieve EcoService profile
- Update profile information (name, description, contact)
- List all products by EcoService
- Track validation status
- Calculate performance metrics

**Key Data**:
- ecoservices table: id, user_id, name, description, estado_validacion, created_at, updated_at

**Validation Status**:
- `pendiente` - Awaiting admin review
- `aprobado` - Approved, visible in marketplace
- `rechazado` - Rejected, hidden from customers

**Query Examples**:
```sql
-- Get approved EcoServices only
SELECT * FROM ecoservices 
WHERE estado_validacion = 'aprobado'

-- Get products for EcoService
SELECT * FROM productos 
WHERE ecoservices_id = $1
```

**Error Cases**:
- EcoService not found (404)
- User not authorized to edit own profile (403)
- Invalid status update (400)

### Module: File Upload

**Core Endpoint**:
- `POST /uploads` (multipart/form-data)

**Responsibilities**:
- Receive file from multipart form
- Validate file type (jpg, png, gif)
- Validate file size (<10MB)
- Upload to Google Drive
- Set file permissions (public read)
- Return downloadable URL

**Google Drive Integration**:
- Service Account authentication
- File created in designated folder
- Automatic permission sharing
- Public URL returned to client

**Request Format**:
```
POST /uploads
Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: multipart/form-data

Body:
  file: <binary file data>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "file_url": "https://drive.google.com/file/d/...",
    "file_id": "1ABC2DEF3GHI..."
  }
}
```

**Error Cases**:
- Invalid file type (400)
- File too large (413 Payload Too Large)
- Google Drive API error (500)
- Missing authorization (401)

### Module: Recommendation Engine Integration

**Core Endpoint**:
- `GET /recommendations/:userId` (proxy)
- `GET /recommendations/categories/:userId`
- `GET /recommendations/ecoservices/:userId`
- `GET /recommendations/productos/:userId`

**Responsibilities**:
- Accept user ID from mobile app
- Forward request to BackAlgoritmo
- Proxy response back to client
- Handle recommendation engine errors

**Integration Details**:
```
Client Request
  ↓
Backend /recommendations/:userId
  ↓
Axios call to BackAlgoritmo API
  ↓ GET /api/recomendaciones/ecoservices/:userId
BackAlgoritmo processes
  ↓ (returns 10 EcoServices)
Proxy response back to client
```

**BackAlgoritmo Endpoint**: `https://motor-recomendaciones-api.onrender.com`

**Error Handling**:
- If BackAlgoritmo timeout: return cached or empty results
- If invalid userId: return 400 Bad Request
- If recommendation engine down: return 503 Service Unavailable

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|---|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Authenticate user |
| POST | `/auth/logout` | Yes | Logout |
| GET | `/products` | No | List products |
| GET | `/products/:id` | No | Get product details |
| POST | `/products` | Yes | Create product |
| PUT | `/products/:id` | Yes | Update product |
| DELETE | `/products/:id` | Yes | Delete product |
| GET | `/ecoservices/:id` | No | Get EcoService profile |
| PUT | `/ecoservices/:id` | Yes | Update EcoService |
| GET | `/ecoservices/:id/products` | No | List products by provider |
| POST | `/uploads` | Yes | Upload file |
| GET | `/recommendations/:userId` | Yes | Get recommendations (proxy) |

See [API_SPECIFICATION.md](API_SPECIFICATION.md) for complete endpoint documentation with examples.

---

## Database Tables Overview

| Table | Purpose | Key Fields |
|-------|---------|---|
| users | User accounts | id, email, password_hash, name, user_type |
| ecoservices | Provider profiles | id, user_id, name, estado_validacion |
| productos | Product listings | id, ecoservices_id, category_id, name, price |
| categories | Product categories | id, name, description |
| customer_intereses | User interests (for recommendations) | id, customer_id, category_id, score |

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete schema.

---

## Internal Dependencies

### Dependency Graph

```
API Endpoints (Routes)
    ↓
Request Handlers
    ↓
Business Logic (Validation, Authorization)
    ↓
Database Queries (Parameterized SQL)
    ↓
PostgreSQL
    ↓
Google Drive API (for uploads)
    ↓
BackAlgoritmo API (for recommendations)
```

### Module Dependencies

1. **Auth Module** (independent)
   - Uses: users table, JWT library, bcrypt

2. **Product Module** (depends on)
   - Auth: JWT verification for ownership
   - Database: productos, categories tables

3. **EcoService Module** (depends on)
   - Auth: JWT for profile ownership
   - Product: Lists products by ecosystem

4. **Upload Module** (depends on)
   - Auth: JWT for user identification
   - Google Drive: External service

5. **Recommendation Module** (depends on)
   - Auth: JWT for user context
   - BackAlgoritmo: External microservice

---

## Validation Rules

### Email
- Must be valid email format
- Must be unique in users table
- Example: user@example.com

### Password
- Minimum 8 characters
- Should contain uppercase, lowercase, number (recommended)
- Never stored in plain text (bcrypt hashed)

### Product Name
- 1-255 characters
- Required field
- No SQL injection characters

### Price
- Positive number
- Decimal format (0.00+)
- Example: 12.99

### File Upload
- Max 10MB
- Allowed types: jpg, png, gif
- Filename sanitized

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  },
  "timestamp": "2026-05-17T10:00:00Z"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Product retrieved |
| 201 | Created | Product created |
| 400 | Bad request | Missing required field |
| 401 | Unauthorized | Invalid/missing JWT |
| 403 | Forbidden | User doesn't own resource |
| 404 | Not found | Product doesn't exist |
| 409 | Conflict | Email already registered |
| 413 | Payload too large | File exceeds 10MB |
| 500 | Server error | Database connection failed |
| 503 | Service unavailable | BackAlgoritmo offline |

---

## Performance Metrics

- Average response time: <100ms per request
- Database query time: <50ms (with indexes)
- File upload time: <5 seconds (depends on size)
- Recommendation engine latency: <3 seconds

---

## Security Features

- JWT tokens for stateless authentication
- Password hashing with bcrypt
- Parameterized SQL queries (prevent injection)
- CORS restrictions for mobile origin
- File upload validation (type, size)
- Error messages don't leak sensitive info

---

## Planned Features (Phase 2+)

- Order management system
- User ratings and reviews
- Search with full-text indexing
- Notification system
- Admin dashboard
- API rate limiting
- Structured logging

---

## Testing Checklist

Before deploying:
1. Test all auth endpoints (register, login, logout)
2. Test product CRUD (create, read, update, delete)
3. Test EcoService endpoints
4. Test file uploads to Google Drive
5. Test recommendation engine proxy
6. Test error handling (invalid inputs)
7. Test JWT token expiration
8. Test CORS with mobile app
9. Test with both customer and ecoservice users

See [Setup.md](Setup.md) for curl testing examples.

---

## Monitoring & Debugging

### Check Backend Health

```bash
curl http://localhost:3000/health
```

### View Recent Logs

```bash
# Terminal running backend shows real-time logs
# Production: Check Render dashboard
```

### Test Database Connection

```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Monitor BackAlgoritmo Availability

```bash
curl https://motor-recomendaciones-api.onrender.com/api/recomendaciones/categorias/1
```

---

## Summary

The backend provides a complete REST API for the Gaia Pacha marketplace, handling authentication, product management, user profiles, file uploads, and recommendation integration. The modular architecture supports independent feature development while maintaining clean separation between concerns.

Next steps: See [API_SPECIFICATION.md](API_SPECIFICATION.md) for detailed endpoint documentation.
