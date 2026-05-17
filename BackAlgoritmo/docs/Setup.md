# BackAlgoritmo Setup Guide

## Prerequisites

- Node.js v18+
- PostgreSQL client (psql)
- Git
- Same PostgreSQL database as backend (Aiven)

## Installation

### 1. Navigate to Directory

```bash
cd BackAlgoritmo
```

### 2. Install Dependencies

```bash
npm install
```

Installs:
- express v5.2 - Web framework
- pg - PostgreSQL client
- dotenv - Environment variables
- nodemon - Auto-restart on changes (dev)

### 3. Environment Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit with your database connection:

```
DATABASE_URL=postgresql://user:password@host:port/gaia_pacha
PORT=4000
NODE_ENV=development
```

### DATABASE_URL

**Format**: `postgresql://user:password@host:port/dbname`

**Local Development**:
```
postgresql://postgres:password@localhost:5432/gaia_pacha_dev
```

**Cloud (Aiven)**:
```
postgresql://user:password@host.aivencloud.com:12345/gaia_pacha
```

Get from Aiven dashboard or backend team.

---

## Running Locally

### Start Development Server

```bash
npm run dev
```

Expected output:
```
Server running on port 4000
Database connected
Recommendation engine ready
```

### Test Endpoints

```bash
# Test category recommendations
curl http://localhost:4000/api/recomendaciones/categorias/1

# Test EcoService recommendations
curl http://localhost:4000/api/recomendaciones/ecoservices/1

# Test product recommendations
curl http://localhost:4000/api/recomendaciones/productos/1
```

Expected response:
```json
{
  "status": "success",
  "id_customer": 1,
  "data": [...]
}
```

---

## Integration with Backend & Mobile

### Full Stack Testing

1. Start Backend:
   ```bash
   cd ../backend
   npm run dev
   ```

2. Start BackAlgoritmo:
   ```bash
   cd ../BackAlgoritmo
   npm run dev
   ```

3. Start Mobile:
   ```bash
   cd ../mobile-project
   npm run dev
   ```

4. Test flow:
   - Login in mobile app
   - Browse products
   - Recommendations should load from BackAlgoritmo

### Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| ECONNREFUSED :4000 | Service not running | npm run dev |
| DATABASE_URL not set | Missing .env | Create .env with connection string |
| No data returned | Empty customer_intereses | Check if user has interests in DB |
| Slow responses | Database query timeout | Verify database connection |

---

## Database Verification

### Check Connection

```bash
psql $DATABASE_URL -c "SELECT 1"
```

Should return `1` if connected.

### Verify Tables Exist

```bash
psql $DATABASE_URL -c "
  SELECT table_name FROM information_schema.tables
  WHERE table_schema='public'
"
```

Should show: users, ecoservices, productos, categories, customer_intereses

### Check Customer Interests

```bash
psql $DATABASE_URL -c "
  SELECT COUNT(*) FROM customer_intereses
  WHERE customer_id = 1
"
```

If 0, user has no interests. Add test data:

```bash
psql $DATABASE_URL -c "
  INSERT INTO customer_intereses (customer_id, category_id, score)
  VALUES (1, 1, 85.5), (1, 2, 72.3), (1, 3, 45.0)
"
```

---

## Environment Setup for Different Stages

### Development

```
DATABASE_URL=postgresql://localhost/gaia_pacha_dev
PORT=4000
NODE_ENV=development
```

### Testing (QA)

```
DATABASE_URL=postgresql://qa-host:5432/gaia_pacha
PORT=4000
NODE_ENV=staging
```

### Production

```
DATABASE_URL=postgresql://prod-host/gaia_pacha
PORT=4000
NODE_ENV=production
```

---

## Deployment to Render

### Prerequisites

- GitHub repository with BackAlgoritmo code
- Render account

### Deploy Steps

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create New → Web Service
4. Connect GitHub repository (BackAlgoritmo directory)
5. Set environment variables:
   - DATABASE_URL (Aiven PostgreSQL - same as backend)
   - PORT=4000
   - NODE_ENV=production
6. Deploy

### After Deployment

- Note the URL: `https://motor-recomendaciones-api.onrender.com`
- Test endpoint: `curl https://motor-recomendaciones-api.onrender.com/api/recomendaciones/categorias/1`
- Update backend to proxy to this URL

---

## Debugging

### Enable Logging

Add to index.js (temporary):

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})
```

### Check Database Queries

Add to services/recomendacion.js:

```javascript
console.log('Query:', query)
console.log('Result:', result.rows)
```

### Monitor Render Logs

View in Render dashboard:
- Real-time logs
- Error messages
- Database connection issues

---

## Performance Tuning

### Check Query Performance

```bash
psql $DATABASE_URL -c "
  EXPLAIN ANALYZE
  SELECT e.*, COUNT(p.id) as product_count
  FROM ecoservices e
  LEFT JOIN productos p ON e.id = p.ecoservices_id
  WHERE e.estado_validacion = 'aprobado'
  GROUP BY e.id
"
```

If slow, check indexes exist (see DATABASE_SCHEMA.md)

### Optimize Connection Pool

Edit db.js if needed:
- max: 5-10 connections
- idleTimeoutMillis: 30000ms
- connectionTimeoutMillis: 5000ms

---

## Testing Checklist

Before deployment:
- [ ] Local server starts without errors
- [ ] Category recommendations return data
- [ ] EcoService recommendations return shuffled results
- [ ] Product recommendations derived correctly
- [ ] Backend can reach service at localhost:4000
- [ ] Error handling works (404, 500, etc)
- [ ] Response times <100ms typical

---

## Common Issues

### Port Already in Use

```bash
# Use different port
PORT=4001 npm run dev

# Or kill process using port 4000
lsof -ti:4000 | xargs kill -9  # macOS/Linux
```

### Module Not Found

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database Connection Timeout

- Verify DATABASE_URL is correct
- Check PostgreSQL is accessible
- Verify credentials (username, password)
- Test with psql directly

### No Recommendations Returned

- Check customer_intereses table has data
- Verify customer_id exists
- Check ecoservices have estado_validacion='aprobado'
- Check productos linked to categories

---

## File Structure After Setup

```
BackAlgoritmo/
├── node_modules/        # Dependencies
├── index.js             # Express server
├── db.js                # Database pool
├── services/
│   └── recomendacion.js # Algorithms
├── docs/                # Documentation
├── .env                 # Configuration (created)
├── .env.example         # Template
├── package.json
└── package-lock.json
```

---

## Next Steps

1. Complete setup above
2. Test endpoints with curl
3. Integrate with backend (it should proxy to localhost:4000)
4. Test full flow: Mobile → Backend → BackAlgoritmo
5. Deploy to Render
6. Monitor performance

---

## Support

See [Features.md](Features.md) for API documentation.
See [ALGORITHM_SPECIFICATION.md](ALGORITHM_SPECIFICATION.md) for algorithm details.
See [Architecture.md](Architecture.md) for system design.
