# API Specification

Complete REST API documentation for Gaia Pacha backend.

## Base URL

- **Production**: https://gaia-pacha-backend.onrender.com
- **Development**: http://localhost:3000

## Authentication

All endpoints marked with Auth=Yes require JWT token:

```
Header: Authorization: Bearer {jwt_token}
```

Token obtained from `/auth/login` or `/auth/register`.

## Response Format

All responses follow standard format:

```json
{
  "success": true,
  "data": { /* endpoint-specific */ },
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
    "code": "ERROR_CODE",
    "message": "Human readable error"
  },
  "timestamp": "2026-05-17T10:00:00Z"
}
```

## Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created
- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Missing/invalid JWT
- **403 Forbidden** - User lacks permission
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Email already exists
- **413 Payload Too Large** - File exceeds limit
- **500 Server Error** - Internal error
- **503 Service Unavailable** - Recommendation engine offline

---

## Authentication Endpoints

### POST /auth/register

Create new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Cases**:
- 400: Missing required fields
- 409: Email already registered

---

### POST /auth/login

Authenticate user with email and password.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 2592000
  }
}
```

**Error Cases**:
- 400: Missing email or password
- 404: User not found
- 401: Invalid password

---

### POST /auth/logout

Logout current user. Token becomes invalid.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

**Auth**: Yes

---

## Product Endpoints

### GET /products

List all products with pagination and filtering.

**Query Parameters**:
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10, max 100
- `category` (optional): Filter by category ID
- `ecoservice` (optional): Filter by EcoService ID

**Request**:
```bash
GET /products?page=1&limit=10&category=1
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Organic Coffee",
        "description": "Fair trade coffee",
        "price": 12.99,
        "category_id": 1,
        "ecoservices_id": 5,
        "image_url": "https://...",
        "created_at": "2026-05-17T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

**Auth**: No

---

### GET /products/:id

Get single product details.

**Request**:
```bash
GET /products/1
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Organic Coffee",
    "description": "Fair trade coffee",
    "price": 12.99,
    "category_id": 1,
    "ecoservices_id": 5,
    "image_url": "https://...",
    "created_at": "2026-05-17T10:00:00Z",
    "ecoservice": {
      "id": 5,
      "name": "Green Beans Co",
      "description": "Eco-friendly coffee producer"
    }
  }
}
```

**Error Cases**:
- 404: Product not found

**Auth**: No

---

### POST /products

Create new product. EcoService only.

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request**:
```json
{
  "name": "Organic Coffee",
  "description": "Fair trade coffee",
  "price": 12.99,
  "category_id": 1
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Organic Coffee",
    "description": "Fair trade coffee",
    "price": 12.99,
    "category_id": 1,
    "ecoservices_id": 5,
    "created_at": "2026-05-17T10:00:00Z"
  }
}
```

**Error Cases**:
- 400: Missing required fields
- 401: Unauthorized (no JWT)
- 403: User is not an EcoService

**Auth**: Yes

---

### PUT /products/:id

Update product. Owner only.

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request**:
```json
{
  "name": "Premium Organic Coffee",
  "description": "Fair trade, single-origin",
  "price": 14.99,
  "category_id": 1
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Premium Organic Coffee",
    "description": "Fair trade, single-origin",
    "price": 14.99,
    "category_id": 1,
    "ecoservices_id": 5,
    "updated_at": "2026-05-17T11:00:00Z"
  }
}
```

**Error Cases**:
- 404: Product not found
- 401: Unauthorized
- 403: User doesn't own product

**Auth**: Yes

---

### DELETE /products/:id

Delete product. Owner only.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": { "message": "Product deleted" }
}
```

**Error Cases**:
- 404: Product not found
- 403: User doesn't own product

**Auth**: Yes

---

## EcoService Endpoints

### GET /ecoservices/:id

Get EcoService profile.

**Request**:
```bash
GET /ecoservices/5
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Green Beans Co",
    "description": "Eco-friendly coffee producer",
    "user_id": 1,
    "estado_validacion": "aprobado",
    "created_at": "2026-05-15T10:00:00Z",
    "product_count": 10
  }
}
```

**Error Cases**:
- 404: EcoService not found

**Auth**: No

---

### PUT /ecoservices/:id

Update EcoService profile. Owner only.

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request**:
```json
{
  "name": "Green Beans Co",
  "description": "Updated description",
  "contact_email": "hello@greenbeans.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Green Beans Co",
    "description": "Updated description",
    "updated_at": "2026-05-17T11:00:00Z"
  }
}
```

**Auth**: Yes

---

### GET /ecoservices/:id/products

List products by EcoService.

**Query Parameters**:
- `page` (optional): Default 1
- `limit` (optional): Default 10

**Request**:
```bash
GET /ecoservices/5/products?page=1&limit=5
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Organic Coffee",
        "price": 12.99,
        "category_id": 1,
        "created_at": "2026-05-17T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 10,
      "pages": 2
    }
  }
}
```

**Auth**: No

---

## Upload Endpoint

### POST /uploads

Upload file to Google Drive.

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Request**:
```bash
curl -X POST http://localhost:3000/uploads \
  -H "Authorization: Bearer {token}" \
  -F "file=@image.jpg"
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "file_url": "https://drive.google.com/file/d/1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9/view",
    "file_id": "1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9",
    "filename": "image.jpg"
  }
}
```

**Error Cases**:
- 400: No file provided or invalid type
- 413: File exceeds 10MB
- 401: Unauthorized
- 500: Google Drive API error

**Auth**: Yes

**Supported File Types**: jpg, png, gif

**Max File Size**: 10MB

---

## Recommendation Endpoints

### GET /recommendations/categories/:userId

Get top user interest categories.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```bash
GET /recommendations/categories/1
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "categories": [
      { "category_id": 1, "name": "Coffee", "score": 95.5 },
      { "category_id": 3, "name": "Tea", "score": 87.2 },
      { "category_id": 5, "name": "Spices", "score": 72.1 }
    ]
  }
}
```

**Auth**: Yes

---

### GET /recommendations/ecoservices/:userId

Get recommended EcoServices (personalized).

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```bash
GET /recommendations/ecoservices/1
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "ecoservices": [
      {
        "id": 5,
        "name": "Green Beans Co",
        "description": "Eco-friendly coffee",
        "score": 145.3
      },
      {
        "id": 12,
        "name": "Organic Tea House",
        "description": "Premium tea selection",
        "score": 89.1
      }
    ]
  }
}
```

Note: Returns 10 total (8 top-scored + 2 random for exploration)

**Auth**: Yes

---

### GET /recommendations/productos/:userId

Get recommended products.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```bash
GET /recommendations/productos/1
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Organic Coffee",
        "price": 12.99,
        "category_id": 1,
        "ecoservices_id": 5
      }
    ]
  }
}
```

Note: Returns up to 20 products

**Auth**: Yes

---

## Error Examples

### 400 Bad Request

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required"
  },
  "timestamp": "2026-05-17T10:00:00Z"
}
```

### 401 Unauthorized

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

### 404 Not Found

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Product with id 999 not found"
  },
  "timestamp": "2026-05-17T10:00:00Z"
}
```

### 500 Server Error

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Database connection failed"
  },
  "timestamp": "2026-05-17T10:00:00Z"
}
```

---

## Testing with curl

### Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Products

```bash
curl http://localhost:3000/products?page=1&limit=5
```

### Create Product (with token)

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Organic Coffee",
    "description": "Fair trade",
    "price": 12.99,
    "category_id": 1
  }'
```

### Upload File

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:3000/uploads \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@image.jpg"
```

---

## Rate Limits

Currently unlimited. Future versions will implement:
- 100 requests per minute per IP
- 1000 requests per minute per authenticated user

---

## CORS Headers

Responses include CORS headers for mobile app:

```
Access-Control-Allow-Origin: http://localhost:8081
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## API Versioning

Current version: v1 (no prefix)

Future versions will use `/v2/...` patterns if needed.

---

## Support

For API issues:
1. Check this specification
2. Review error code and message
3. Check backend logs
4. See Setup.md for troubleshooting
