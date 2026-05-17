# Backend Setup Guide

## Prerequisites

Ensure you have the following before starting:

1. **Node.js v18 or higher**
   ```bash
   node -v
   ```

2. **PostgreSQL client** (for database management)
   ```bash
   psql --version
   ```

3. **Google Cloud account** (for Drive API credentials)
   - Create service account in [Google Cloud Console](https://console.cloud.google.com)
   - Download JSON key file

4. **Git**
   ```bash
   git --version
   ```

---

## Installation

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- express - Web framework
- pg - PostgreSQL client
- jsonwebtoken - JWT authentication
- axios - HTTP client for BackAlgoritmo
- multer - File upload handling
- dotenv - Environment variable management
- cors - Cross-origin support

### 3. Environment Configuration

Create `.env` file:

```bash
cp .env.example .env
```

### 4. Edit .env with Your Values

```
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your-secret-key-min-32-chars
GOOGLE_DRIVE_FOLDER_ID=your-google-folder-id
GOOGLE_SERVICE_ACCOUNT_KEY={}
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
```

---

## Environment Variables Explained

### DATABASE_URL
PostgreSQL connection string

**Local Development**:
```
postgresql://postgres:password@localhost:5432/gaia_pacha_dev
```

**Cloud (Aiven)**:
```
postgresql://user:password@host.aivencloud.com:12345/gaia_pacha
```

Get this from Aiven dashboard.

### JWT_SECRET
Secret key for signing JWT tokens

**Requirements**:
- Minimum 32 characters
- Must be unique and secure
- Never commit to git or share publicly

**Generate**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Examples**:
```
dev: dev-secret-key-change-in-production-12345
prod: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

### GOOGLE_DRIVE_FOLDER_ID
Google Drive folder ID where files will be uploaded

**How to find**:
1. Open Google Drive
2. Create a folder for product images
3. Right-click → Share
4. Share with service account email
5. Copy folder ID from URL: `https://drive.google.com/drive/folders/{FOLDER_ID}`

**Example**:
```
1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9
```

### GOOGLE_SERVICE_ACCOUNT_KEY
JSON credentials for Google Drive API

**How to get**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Drive API
4. Create Service Account
5. Generate JSON key
6. Copy entire JSON content (including braces)

**Format**:
```json
{"type":"service_account","project_id":"...","private_key":"..."}
```

**Store in .env**:
```
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### Other Variables

| Variable | Description | Example |
|----------|---|---|
| PORT | Port to listen on | 3000 |
| NODE_ENV | Environment | development / production |
| CORS_ORIGIN | Allowed origin for mobile app | http://localhost:8081 |

---

## Database Setup

### Option 1: Local PostgreSQL

#### macOS (Homebrew)

```bash
# Install PostgreSQL
brew install postgresql

# Start service
brew services start postgresql

# Create database
createdb gaia_pacha_dev

# Create .env
DATABASE_URL=postgresql://localhost/gaia_pacha_dev
```

#### Windows (PostgreSQL Installer)

1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer, remember password
3. Open pgAdmin or psql

```
Database: gaia_pacha_dev
User: postgres
Password: (your choice)
```

#### Ubuntu/Linux

```bash
# Install
sudo apt install postgresql

# Start
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb gaia_pacha_dev
```

### Option 2: Cloud Database (Aiven)

1. Sign up at [aiven.io](https://aiven.io)
2. Create PostgreSQL service
3. Copy connection string to DATABASE_URL
4. Whitelist your IP address

```
DATABASE_URL=postgresql://avnadmin:xxx@pg-xxx.aivencloud.com:12345/gaia_pacha
```

---

## Running the Backend

### Start Development Server

```bash
npm run dev
```

Expected output:
```
Server running on port 3000
Database connected
Ready to accept requests
```

### Verify It's Working

```bash
# Test health check (if implemented)
curl http://localhost:3000/health

# Test products endpoint
curl http://localhost:3000/products

# Should return JSON with products
```

---

## Testing the API

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

**Response**:
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "test@example.com", "name": "Test User" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "error": null,
  "timestamp": "2026-05-17T10:00:00Z"
}
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

**Response**: Same as register (returns token)

### Get Products

```bash
curl http://localhost:3000/products
```

### Create Product (Requires Token)

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Organic Coffee",
    "description": "Fair trade coffee",
    "price": 12.99,
    "category_id": 1
  }'
```

---

## Connecting Mobile App

### 1. Update Mobile .env

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 2. For Physical Device Testing

1. Find your machine's IP:
   ```bash
   ipconfig getifaddr en0  # macOS
   hostname -I             # Linux
   ipconfig                # Windows
   ```

2. Update mobile .env:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:3000
   ```

3. Ensure phone and PC on same WiFi

### 3. Verify Connection

```bash
# From mobile, try login
# Should reach backend and get response
```

---

## Connecting Recommendation Engine

### Local BackAlgoritmo

1. Start BackAlgoritmo:
   ```bash
   cd ../BackAlgoritmo
   npm run dev
   ```

2. Backend should auto-discover at `http://localhost:4000`

### Production BackAlgoritmo

Recommendation engine at `https://motor-recomendaciones-api.onrender.com`

Test connection:
```bash
curl https://motor-recomendaciones-api.onrender.com/api/recomendaciones/categorias/1
```

---

## Google Drive Setup (File Uploads)

### Step 1: Create Service Account

1. Open [Google Cloud Console](https://console.cloud.google.com)
2. Create new project (or use existing)
3. Enable Google Drive API
4. Go to Service Accounts
5. Create Service Account
6. Generate JSON key

### Step 2: Add to .env

Copy JSON key content to `GOOGLE_SERVICE_ACCOUNT_KEY`:

```
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}
```

### Step 3: Share Drive Folder

1. In Google Drive, create folder for product images
2. Get folder ID from URL
3. Share folder with service account email (found in JSON key)
4. Grant Editor permissions
5. Add folder ID to .env

```
GOOGLE_DRIVE_FOLDER_ID=1ABC2DEF3GHI4JKL5MNO6PQR
```

### Step 4: Test Upload

```bash
# Upload a file (requires JWT token and auth)
curl -X POST http://localhost:3000/uploads \
  -H "Authorization: Bearer {token}" \
  -F "file=@/path/to/image.jpg"
```

---

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Cause**: PostgreSQL not running

**Solution**:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
Services → PostgreSQL → Start
```

### Error: "JWT_SECRET not set"

**Solution**:
```bash
# Add to .env
JWT_SECRET=your-secret-key-min-32-chars

# Restart server
npm run dev
```

### Error: "GOOGLE_SERVICE_ACCOUNT_KEY invalid"

**Solution**:
- Verify JSON is valid (copy directly from Google Cloud)
- Ensure folder is shared with service account email
- Check service account has Drive API enabled

### Error: "EADDRINUSE :::3000"

**Cause**: Port 3000 already in use

**Solution**:
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Cause**: Mobile URL not in CORS_ORIGIN

**Solution**:
```bash
# .env
CORS_ORIGIN=http://localhost:8081,http://192.168.1.100:8081

# Separate multiple origins with commas
```

### Slow Database Queries

**Solution**:
- Check DATABASE_URL points to correct DB
- Verify network connectivity
- Add indexes for frequent queries (see DATABASE_SCHEMA.md)

---

## Development Workflow

### Daily Development Loop

1. Start backend: `npm run dev`
2. Start mobile: `cd ../mobile-project && npm run dev`
3. Start algorithm: `cd ../BackAlgoritmo && npm run dev` (if local testing)
4. Make changes to `index.js`
5. Server auto-restarts (via nodemon)
6. Test endpoints with curl or Postman

### Making Code Changes

```javascript
// Example: Add new endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Save file → nodemon detects → auto-restart
// curl http://localhost:3000/health
// Response: { status: 'ok' }
```

### Testing Workflow

1. Write code in `index.js`
2. Test with curl/Postman
3. Check logs in terminal
4. Verify database queries (psql)
5. Test mobile app integration

---

## Production Deployment (Render)

### Prerequisites

- GitHub repository with backend code
- Render account

### Deploy Steps

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create New → Web Service
4. Connect GitHub repository
5. Set environment variables:
   - DATABASE_URL (Aiven PostgreSQL)
   - JWT_SECRET (production key)
   - GOOGLE_DRIVE_FOLDER_ID
   - GOOGLE_SERVICE_ACCOUNT_KEY
6. Deploy

### Production Monitoring

- View logs in Render dashboard
- Monitor database performance on Aiven
- Check request rates and errors
- Set up alerting (optional)

---

## Next Steps

1. Complete setup above
2. Test endpoints with curl
3. Connect mobile app and test login flow
4. Read [Architecture.md](Architecture.md) for system design
5. Read [API_SPECIFICATION.md](API_SPECIFICATION.md) for all endpoints
6. Read [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for schema details

## Getting Help

- [Express.js docs](https://expressjs.com)
- [PostgreSQL docs](https://www.postgresql.org/docs/)
- [Google Drive API docs](https://developers.google.com/drive/api/guides/about-sdk)
- Check [Features.md](Features.md) for endpoint details
- Review backend/index.js for implementation examples
