# Gaia Pacha Backend API

Express.js REST API serving the Gaia Pacha mobile marketplace. Handles authentication, product management, EcoService profiles, and file uploads to Google Drive.

## Documentation

- **[Architecture.md](docs/Architecture.md)** - System design and file organization
- **[Setup.md](docs/Setup.md)** - Local development setup and configuration
- **[Features.md](docs/Features.md)** - API endpoints and module inventory
- **[API_SPECIFICATION.md](docs/API_SPECIFICATION.md)** - Complete endpoint reference with examples
- **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - PostgreSQL schema and relationships

## Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL (local or cloud via Aiven)
- Google Cloud Service Account (for file uploads)

### Installation

```bash
cd backend
npm install
```

### Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit with your values:

```
DATABASE_URL=postgresql://user:password@host:5432/gaia_pacha
JWT_SECRET=your-secret-key-min-32-chars
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
GOOGLE_SERVICE_ACCOUNT_KEY={}
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
```

### Run Development Server

```bash
npm run dev
```

Server starts on `http://localhost:3000`

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v4.19.2
- **Database**: PostgreSQL (Aiven cloud)
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: Google Drive API + Multer
- **HTTP Client**: Axios (for BackAlgoritmo integration)

## Project Structure

```
backend/
├── index.js              # Express app, all routes
├── .env                  # Environment variables (create locally)
├── .env.example          # Template for .env
├── package.json
└── docs/                 # Technical documentation
    ├── Architecture.md   # System design
    ├── Setup.md          # Local setup
    ├── Features.md       # Endpoints
    ├── API_SPECIFICATION.md
    └── DATABASE_SCHEMA.md
```

## Key Features

- User authentication (register, login, JWT tokens with 30-day expiration)
- Product CRUD operations with category assignment
- EcoService profile management with validation workflow
- Image/file uploads to Google Drive
- Proxy integration with BackAlgoritmo recommendation engine
- PostgreSQL connection pooling
- CORS configured for mobile app
- Error handling and logging

## API Endpoints (Summary)

| Method | Endpoint | Description |
|--------|----------|---|
| POST | `/auth/register` | Create user account |
| POST | `/auth/login` | Authenticate user |
| POST | `/auth/logout` | Logout user |
| GET | `/products` | List products with pagination |
| GET | `/products/:id` | Get product details |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/ecoservices/:id` | Get EcoService profile |
| PUT | `/ecoservices/:id` | Update EcoService |
| POST | `/uploads` | Upload file to Google Drive |
| GET | `/recommendations/:userId` | Get recommendations from BackAlgoritmo |

See [API_SPECIFICATION.md](docs/API_SPECIFICATION.md) for complete details.

## Database

PostgreSQL database hosted on Aiven. Schema includes:
- `users` - User accounts
- `ecoservices` - EcoService profiles
- `productos` - Product listings
- `categories` - Product categories
- `customer_intereses` - User interest tracking

See [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for detailed schema.

## Authentication

JWT-based stateless authentication:
- 30-day token expiration
- `Authorization: Bearer {token}` header
- Automatic token injection in mobile app
- Auto-logout on expiration

## Integration Points

- **Mobile App** (React Native/Expo) - Calls API endpoints via Axios
- **BackAlgoritmo** (Node.js microservice) - Recommendation engine integration
- **Google Drive API** - File storage for product images

## Environment Setup

### Development (Local)

```bash
DATABASE_URL=postgresql://localhost/gaia_pacha_dev
JWT_SECRET=dev-secret-key
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
```

### Production

Set environment variables on Render hosting:
- `DATABASE_URL` - Aiven PostgreSQL connection
- `JWT_SECRET` - Production secret (min 32 chars)
- `GOOGLE_DRIVE_FOLDER_ID` - Production folder ID
- `GOOGLE_SERVICE_ACCOUNT_KEY` - Service account JSON

## Deployment

Deployed to Render: https://gaia-pacha-backend.onrender.com

```bash
# Push to deploy
git push origin main
```

## Development Workflow

1. Start backend: `npm run dev`
2. Start mobile: `cd ../mobile-project && npm run dev`
3. Start algorithm: `cd ../BackAlgoritmo && npm run dev`
4. Test endpoints with curl or Postman
5. Monitor logs in Render dashboard

## Common Issues

### Database Connection Error
- Check DATABASE_URL in .env
- Verify Aiven PostgreSQL is accessible
- Test connection: `psql $DATABASE_URL`

### JWT Errors
- Ensure JWT_SECRET is set and consistent
- Check token expiration (30 days)
- Verify `Authorization` header format

### CORS Errors
- Check CORS_ORIGIN matches mobile app URL
- For physical devices, add device IP to CORS config

### File Upload Failures
- Verify Google Service Account has Drive API enabled
- Check GOOGLE_SERVICE_ACCOUNT_KEY is valid JSON
- Ensure service account has write permission to folder

## Testing

### Manual Testing with curl

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password","name":"User"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get products
curl http://localhost:3000/products
```

## Performance

- Backend latency: <100ms per request (typical)
- Database query time: <50ms (with indexes)
- File upload: <5 seconds (depending on size)

## Security

- Parameterized queries prevent SQL injection
- JWT tokens for stateless authentication
- HTTPS required in production
- Google Drive API for secure file storage
- CORS restrictions on cross-origin requests

## Monitoring

Check Render dashboard for:
- Request logs
- Error rates
- Database connection health
- Environment variable status

## Support

See [Setup.md](docs/Setup.md) for common issues.
For API details, see [API_SPECIFICATION.md](docs/API_SPECIFICATION.md).
For database questions, see [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md).

## License

Proprietary - Gaia Pacha / AndeanUX
