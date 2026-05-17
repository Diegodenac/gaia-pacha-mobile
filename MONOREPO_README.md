# Gaia Pacha Monorepo

Complete technical documentation for the Gaia Pacha MVP - a React Native mobile marketplace connecting customers with ecosystem service providers.

## Projects

### 1. Mobile Application (React Native + Expo)

User-facing marketplace where customers discover EcoServices and providers manage product listings.

- **Location**: Root directory (`app/`, `src/`)
- **README**: [mobile-project/README.md](README.md)
- **Key Docs**:
  - [Architecture.md](docs/Architecture.md) - Feature-first Clean Architecture, Zustand + TanStack Query
  - [Setup.md](docs/Setup.md) - Local development environment
  - [Features.md](docs/Features.md) - Implemented features and roadmap

### 2. Backend API (Express.js)

REST API providing authentication, product management, file uploads, and recommendation integration.

- **Location**: `backend/`
- **README**: [backend/README.md](backend/README.md)
- **Key Docs**:
  - [Architecture.md](backend/docs/Architecture.md) - Monolithic service design
  - [Setup.md](backend/docs/Setup.md) - Database and environment configuration
  - [Features.md](backend/docs/Features.md) - Module inventory
  - [API_SPECIFICATION.md](backend/docs/API_SPECIFICATION.md) - Complete endpoint reference with curl examples
  - [DATABASE_SCHEMA.md](backend/docs/DATABASE_SCHEMA.md) - PostgreSQL schema and relationships

### 3. Recommendation Engine (Node.js)

Isolated microservice implementing collaborative filtering recommendations with 80/20 exploitation/exploration.

- **Location**: `BackAlgoritmo/`
- **README**: [BackAlgoritmo/README.md](BackAlgoritmo/README.md)
- **Key Docs**:
  - [Architecture.md](BackAlgoritmo/docs/Architecture.md) - Microservice design and integration
  - [Setup.md](BackAlgoritmo/docs/Setup.md) - Local development
  - [Features.md](BackAlgoritmo/docs/Features.md) - Three algorithms and API
  - [ALGORITHM_SPECIFICATION.md](BackAlgoritmo/docs/ALGORITHM_SPECIFICATION.md) - Mathematical specification

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    Mobile Application                         │
│            React Native + Expo SDK 54                         │
│  (app/, src/ - Expo Router, Zustand, TanStack Query)        │
└────────────────┬─────────────────────────────────────────────┘
                 │ HTTP/HTTPS (Axios)
                 ↓
┌──────────────────────────────────────────────────────────────┐
│                      Backend API                              │
│            Express.js on Render                               │
│  /auth (register, login), /products (CRUD),                 │
│  /ecoservices, /uploads (Google Drive),                     │
│  /recommendations (proxy)                                    │
└────────────────┬──────────────────┬──────────────────────────┘
                 │                  │
                 │ PostgreSQL       │ Axios HTTP
                 │ (Aiven)          │
                 ↓                  ↓
        ┌──────────────┐    ┌──────────────────────────┐
        │ PostgreSQL   │    │ Recommendation Engine    │
        │ Database     │    │ (BackAlgoritmo)         │
        │              │    │ Node.js on Render       │
        │ users        │    │                        │
        │ productos    │    │ /api/recomendaciones/  │
        │ ecoservices  │    │   categorias/:id       │
        │ categories   │    │   ecoservices/:id      │
        │ interests    │    │   productos/:id        │
        └──────────────┘    └──────────────────────────┘
```

---

## Technology Stack Summary

| Concern | Technology | Version |
|---------|-----------|---------|
| **Mobile** | React Native | 0.81.5 |
| **Mobile Routing** | Expo Router | v6 |
| **Mobile Styling** | NativeWind | v4 |
| **Mobile State** | Zustand + TanStack Query | v5 |
| **Mobile Forms** | React Hook Form + Zod | Latest |
| **Backend** | Express.js | 4.19.2 |
| **Database** | PostgreSQL (Aiven) | Latest |
| **Auth** | JWT | jsonwebtoken |
| **HTTP Clients** | Axios | Latest |
| **Recommendation** | Node.js + Express | 5.2 |
| **Build/Deploy** | EAS Build / Render | Cloud |

---

## Development Workflow

### Prerequisites

- Node.js v18+
- PostgreSQL (local or Aiven cloud)
- Google Cloud account (Drive API)
- Git

### Start All Services (Separate Terminals)

```bash
# Terminal 1: Mobile App
cd mobile-project
npm install
npm run dev
# Port: 8081

# Terminal 2: Backend API
cd backend
npm install
npm run dev
# Port: 3000

# Terminal 3: Recommendation Engine (optional for local testing)
cd BackAlgoritmo
npm install
npm run dev
# Port: 4000
```

### First-Time Setup

1. **Mobile Environment**:
   ```bash
   cp mobile-project/.env.example mobile-project/.env
   # Edit: EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
   ```

2. **Backend Environment**:
   ```bash
   cp backend/.env.example backend/.env
   # Edit: DATABASE_URL, JWT_SECRET, GOOGLE credentials
   ```

3. **BackAlgoritmo Environment** (if local):
   ```bash
   cp BackAlgoritmo/.env.example BackAlgoritmo/.env
   # Edit: DATABASE_URL (same as backend), PORT=4000
   ```

### Testing Workflow

1. Register account in mobile app
2. Toggle between Customer and EcoService profiles
3. Browse products as Customer
4. Create/edit products as EcoService
5. Verify recommendations load
6. Check backend logs for errors

---

## Key Decisions

### Architecture

- **Mobile**: Feature-first with Clean Architecture (vertical slicing)
- **Backend**: Monolithic Express for MVP simplicity
- **Recommendation**: Isolated microservice for independent scaling
- **Database**: Single PostgreSQL shared across backend + recommendation engine

### State Management

- **Client State** (User auth, profile toggle): Zustand + SecureStore
- **Server State** (Products, recommendations): TanStack Query with 5-min cache
- **Global State**: Zustand stores in src/store/

### Deployment

- **Mobile**: EAS Build → App Store / Play Store
- **Backend**: GitHub → Render CI/CD (auto-deploy on push)
- **Recommendation**: GitHub → Render (independent service)

---

## Data Flow

### User Registration → Product Discovery → Recommendation

```
1. Mobile: User registers (email, password)
   POST /auth/register
   → Backend stores in users table
   → Returns JWT token

2. Mobile: Stores token in SecureStore
   → Token included in all subsequent requests

3. Mobile: User browses products (as Customer)
   GET /products?category=1
   → Backend queries productos table
   → Returns matching products

4. Mobile: User views product
   GET /products/123
   → Backend queries with EcoService details
   → Mobile app logs interaction (internally)

5. Mobile: App launches, requests recommendations
   GET /recommendations/ecoservices/:userId
   → Backend proxies to BackAlgoritmo
   → BackAlgoritmo queries customer_intereses
   → Calculates 80/20 split (8 top + 2 random)
   → Shuffles and returns
   → Mobile caches for session
```

---

## Performance Targets

| Operation | Target | Current |
|-----------|--------|---------|
| App load | <3s | <2s |
| Login | <2s | <1s |
| Product list fetch | <1s | <500ms |
| Recommendations | <3s | <100ms |
| Backend response | <100ms | <50ms |
| Recommendation engine | <30ms | 10-20ms |

---

## Deployment Status

### Development

- Mobile: `npm run dev` on port 8081
- Backend: `npm run dev` on port 3000
- Recommendation: `npm run dev` on port 4000

### Staging / Production

- Mobile: Built via EAS Build, submitted to App Stores
- Backend: https://gaia-pacha-backend.onrender.com
- Recommendation: https://motor-recomendaciones-api.onrender.com

### Environment Variables (Render)

Backend:
```
DATABASE_URL=postgresql://...  # Aiven
JWT_SECRET=...
GOOGLE_DRIVE_FOLDER_ID=...
GOOGLE_SERVICE_ACCOUNT_KEY={}
CORS_ORIGIN=...
```

Recommendation Engine:
```
DATABASE_URL=postgresql://...  # Same as backend
PORT=4000
NODE_ENV=production
```

---

## Known Limitations (MVP)

1. **No Ordering System** - Products listed only, no checkout
2. **No Direct Messaging** - No customer-provider chat
3. **No Map Integration** - Geolocation not implemented
4. **No Push Notifications** - Alert system planned
5. **No Analytics** - Performance metrics not tracked
6. **Simple Recommendations** - No matrix factorization or ML

See [SESSION_PROGRESS.md](docs/SESSION_PROGRESS.md) for complete roadmap.

---

## File Structure (High-Level)

```
mobile-project/ (monorepo root)
├── app/                              # Mobile screens (Expo Router)
├── src/
│   ├── components/                   # Atomic Design UI
│   ├── features/                     # Business logic hooks
│   ├── repositories/                 # API layer
│   ├── store/                        # Zustand state
│   ├── lib/                          # Utilities
│   ├── types/                        # TypeScript
│   └── constants/                    # Configuration
├── docs/                             # Mobile documentation (NEW)
│   ├── Architecture.md               # System design
│   ├── Setup.md                      # Development setup
│   ├── Features.md                   # Feature inventory
│   └── [6 existing docs]            # Existing documentation
├── backend/
│   ├── index.js                      # Express app
│   ├── .env                          # Configuration
│   └── docs/                         # Backend docs (NEW)
│       ├── Architecture.md
│       ├── Setup.md
│       ├── Features.md
│       ├── API_SPECIFICATION.md
│       └── DATABASE_SCHEMA.md
├── BackAlgoritmo/
│   ├── index.js                      # Express server
│   ├── services/recomendacion.js     # Algorithms
│   ├── db.js                         # Database connection
│   ├── .env                          # Configuration
│   └── docs/                         # Algorithm docs (NEW)
│       ├── Architecture.md
│       ├── Setup.md
│       ├── Features.md
│       └── ALGORITHM_SPECIFICATION.md
├── README.md                         # Mobile project README
├── MONOREPO_README.md               # This file (NEW)
└── package.json                      # Mobile dependencies
```

---

## Quick Reference: Common Tasks

### Add New Mobile Feature

1. Create hook in `src/features/{module}/use{Feature}.ts`
2. Create repository in `src/repositories/{module}Repository.ts`
3. Create screen in `app/{route}/` or component in `src/components/`
4. Follow Atomic Design: atoms → molecules → organisms → screens
5. Update docs/Features.md

### Add New Backend Endpoint

1. Add route in `backend/index.js`
2. Implement business logic
3. Return standardized JSON response
4. Add to backend/docs/API_SPECIFICATION.md
5. Update backend/docs/Features.md

### Update Recommendation Algorithm

1. Edit `BackAlgoritmo/services/recomendacion.js`
2. Update mathematical details in ALGORITHM_SPECIFICATION.md
3. Test locally: curl http://localhost:4000/api/recomendaciones/...
4. Deploy to Render

---

## Onboarding Checklist for New Developers

- [ ] Clone repository: `git clone {repo}`
- [ ] Read this file (MONOREPO_README.md)
- [ ] Read mobile [Architecture.md](docs/Architecture.md)
- [ ] Read backend [Architecture.md](backend/docs/Architecture.md)
- [ ] Read [BackAlgoritmo/Architecture.md](BackAlgoritmo/docs/Architecture.md)
- [ ] Complete mobile [Setup.md](docs/Setup.md)
- [ ] Complete backend [Setup.md](backend/docs/Setup.md)
- [ ] Start all three services
- [ ] Test login flow in mobile app
- [ ] Verify recommendations load
- [ ] Read coding guidelines (DEVELOPMENT_GUIDELINES_AI.md)
- [ ] Make first feature contribution

---

## Documentation Structure

### For Understanding System Design
1. Start: This file (MONOREPO_README.md)
2. Mobile: docs/Architecture.md
3. Backend: backend/docs/Architecture.md
4. Recommendation: BackAlgoritmo/docs/Architecture.md

### For Setting Up Locally
1. Mobile: docs/Setup.md
2. Backend: backend/docs/Setup.md
3. BackAlgoritmo: BackAlgoritmo/docs/Setup.md

### For Understanding Features
1. Mobile: docs/Features.md
2. Backend: backend/docs/Features.md
3. Recommendation: BackAlgoritmo/docs/Features.md

### For Implementation Details
1. Backend API: backend/docs/API_SPECIFICATION.md
2. Database: backend/docs/DATABASE_SCHEMA.md
3. Algorithms: BackAlgoritmo/docs/ALGORITHM_SPECIFICATION.md

### For Development Standards
- Mobile: docs/DEVELOPMENT_GUIDELINES_AI.md
- Mobile: docs/ARCHITECTURE_AND_DIRECTORIES.md

---

## Troubleshooting

### Mobile App Won't Connect to Backend

1. Check backend running: `curl http://localhost:3000/health`
2. Verify mobile .env: `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000`
3. Ensure on same network for physical device testing
4. Check firewall allows port 3000

### Recommendations Not Loading

1. Check BackAlgoritmo running (if local)
2. Backend must be able to reach recommendation engine
3. Verify customer_intereses table has data
4. Check backend logs for Axios errors

### Database Connection Errors

1. Verify PostgreSQL running
2. Check .env has correct DATABASE_URL
3. Test: `psql $DATABASE_URL -c "SELECT 1"`
4. For Aiven: Verify IP whitelist

---

## Support & Escalation

### Questions About

- **Mobile code**: Check docs/Architecture.md, docs/DEVELOPMENT_GUIDELINES_AI.md
- **Backend API**: Check backend/docs/API_SPECIFICATION.md
- **Database**: Check backend/docs/DATABASE_SCHEMA.md
- **Recommendations**: Check BackAlgoritmo/docs/ALGORITHM_SPECIFICATION.md
- **Setup issues**: Check respective Setup.md files

---

## Next Steps After MVP

### Phase 2 (3-6 months)

- [ ] Order management system
- [ ] Map view for discovery
- [ ] Direct messaging
- [ ] User ratings & reviews
- [ ] Push notifications

### Phase 3 (6-12 months)

- [ ] Advanced analytics
- [ ] Admin dashboard
- [ ] Matrix factorization recommendations
- [ ] Real-time messaging
- [ ] Payment integration

### Technical Debt

- [ ] Refactor backend into modular structure (routes/, controllers/, services/)
- [ ] Add comprehensive test coverage (unit + integration)
- [ ] Implement structured logging (Winston/Morgan)
- [ ] Add API rate limiting
- [ ] Database connection pooling optimization
- [ ] Redis cache layer for recommendations

---

## License

Proprietary - Gaia Pacha / AndeanUX

---

## Summary

Gaia Pacha is a well-architected MVP connecting customers with ecosystem service providers. Three independent services (mobile, backend, recommendation engine) communicate via clean interfaces. Comprehensive documentation ensures sustainability and rapid onboarding.

**Start here**: Pick a project above and read its README.md, then dive into the relevant documentation.
