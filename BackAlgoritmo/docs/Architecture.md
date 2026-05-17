# Recommendation Engine Architecture

## Architectural Pattern

Isolated **microservice** for recommendations, separate from main backend.

- **Deployment**: Independent Render instance
- **Database**: Read-only access to PostgreSQL
- **Purpose**: Calculate personalized recommendations
- **Pattern**: Pure function with no side effects

---

## System Design

### Request/Response Flow

```
Backend /recommendations/:userId
    ↓
BackAlgoritmo /api/recomendaciones/:type/:userId
    ↓
Database Query (customer_intereses, productos, ecoservices)
    ↓
Algorithm Calculation
    ↓
JSON Response
    ↓
Backend Proxies to Mobile App
```

### Data Flow for Recommendations

```
Mobile App
    ↓
Backend receives /recommendations/:userId request
    ↓
Axios: GET https://motor-recomendaciones-api.onrender.com/api/recomendaciones/...
    ↓
Query PostgreSQL:
  - customer_intereses (user interests)
  - ecoservices (provider profiles)
  - productos (product listings)
    ↓
Algorithm Process:
  1. Calculate scores for all EcoServices
  2. Select top 8 (exploitation)
  3. Add 2 random (exploration)
  4. Shuffle array
    ↓
Return JSON (10 EcoServices)
    ↓
Backend returns to Mobile
    ↓
Mobile caches result (session-wide)
```

---

## File Structure

```
BackAlgoritmo/
├── index.js                 # Express app, route definitions
├── db.js                    # PostgreSQL connection pool
├── services/
│   └── recomendacion.js     # Three core algorithms
├── .env                     # Environment variables
├── package.json
└── docs/
    ├── Architecture.md      # This file
    ├── Setup.md
    ├── Features.md
    └── ALGORITHM_SPECIFICATION.md
```

### index.js

Express app setup:
- Routes for three endpoints
- CORS configuration
- Error handling
- Listen on PORT from .env

### db.js

Database connection:
- PostgreSQL pool configuration
- Query functions for recommendations
- Connection string from DATABASE_URL

### services/recomendacion.js

Three recommendation algorithms:
1. `obtenerCategoriasPonderadas(customer_id)` - Top categories
2. `obtenerRecomendaciones(customer_id)` - EcoServices (10)
3. `obtenerProductosRecomendados(customer_id)` - Products (20)

---

## API Endpoints

### Three Endpoints (All GET)

1. **Categories**
   - `GET /api/recomendaciones/categorias/:id_customer`
   - Returns: Array of {category_id, name, score}

2. **EcoServices**
   - `GET /api/recomendaciones/ecoservices/:id_customer`
   - Returns: Array of {id, name, description, score}
   - Strategy: 8 top-scored + 2 random + shuffled

3. **Products**
   - `GET /api/recomendaciones/productos/:id_customer`
   - Returns: Array of {id, name, price, category_id}
   - Derived from top 5 EcoServices

---

## Algorithm Architecture

### Input

- customer_id: User identifier from authentication

### Processing

```
Step 1: Load customer interests from database
        SELECT category_id, score FROM customer_intereses
        WHERE customer_id = $1

Step 2: For each EcoService, calculate total score
        score = sum(interests[category] for each product's category)

Step 3: Sort by score descending
        Take top 8 (exploitation)

Step 4: Add 2 random EcoServices
        Random selection from all approved services

Step 5: Shuffle array
        Prevent always showing top 2

Step 6: Return JSON to caller
```

### Output Format

```json
{
  "status": "success",
  "id_customer": 1,
  "data": [
    { "id": 5, "name": "EcoService A", "score": 145.3 },
    { "id": 12, "name": "EcoService B", "score": 89.1 },
    ...
  ]
}
```

---

## Performance Characteristics

### Time Complexity
- Category recommendations: O(n) where n = categories
- EcoService recommendations: O(m*c) where m = EcoServices, c = categories
- Product recommendations: O(m + p) where m = top EcoServices, p = products

### Typical Latencies (MVP)
- Category query: 5-10ms
- EcoService query: 10-20ms
- Product query: 15-30ms

### Scalability
- Current: Adequate for 10K+ users
- Bottleneck: Database query time
- Future: Cache top recommendations in Redis

---

## Database Access Pattern

### Read-Only Access

BackAlgoritmo only reads from PostgreSQL:

```sql
SELECT ci.category_id, ci.score 
FROM customer_intereses ci
WHERE ci.customer_id = $1;

SELECT e.*, COUNT(p.id) as product_count
FROM ecoservices e
LEFT JOIN productos p ON e.id = p.ecoservices_id
WHERE e.estado_validacion = 'aprobado'
GROUP BY e.id;
```

No writes, inserts, or deletes. Recommendations are ephemeral.

---

## Error Handling

### Success Case
- HTTP 200
- Return recommendation data

### Error Cases

1. **User not found**: 404 Not Found
   - No customer_intereses records exist
   - Return empty array or default recommendations

2. **No EcoServices**: 200 OK with empty array
   - No approved services to recommend

3. **Database error**: 500 Server Error
   - Connection timeout, query failure

4. **Request error**: 400 Bad Request
   - Invalid customer_id (non-numeric)

---

## Integration Points

### Backend Integration

Backend acts as proxy:

```javascript
// Backend route
app.get('/recommendations/:userId', async (req, res) => {
  const response = await axios.get(
    `https://motor-recomendaciones-api.onrender.com/api/recomendaciones/ecoservices/${req.params.userId}`
  );
  res.json(response.data);
});
```

### Mobile Integration

Mobile caches results for session:

```javascript
// Mobile hook
const { data: recommendations, isLoading } = useQuery({
  queryKey: ['recommendations', userId],
  queryFn: () => recommendationRepository.getEcoServices(userId),
  staleTime: Infinity  // Cache for entire session
});
```

---

## Deployment Architecture

### Render Deployment

```
GitHub → Render CI/CD → Build → Deploy → Live
  ↓
  npm install
  npm start (or npm run dev)
  ↓
  Listen on PORT (environment variable)
  ↓
  https://motor-recomendaciones-api.onrender.com
```

### Environment Variables

```
DATABASE_URL=postgresql://...  # Aiven PostgreSQL
PORT=4000                       # Listen port
NODE_ENV=production             # Environment
```

---

## Caching Strategy

### Current (MVP)
- No caching in BackAlgoritmo
- Database queries on every request
- Fresh calculations each time

### Mobile-Side Caching
- TanStack Query: Cache entire recommendation list
- Duration: Entire app session (infinity)
- Refresh: Manual only or on app restart

### Future (Post-MVP)
- Redis cache for top-N recommendations
- Update cache nightly via batch job
- Reduce database load 90%

---

## Monitoring

### Production Monitoring

Check in Render dashboard:
- Request count and latency
- Error rates
- Database connection health
- Memory and CPU usage

### Local Development

- Terminal logs show request/response
- Manual testing via curl
- Response timing in browser network tab

---

## Future Improvements

### Algorithm Enhancements
- Matrix factorization (SVD) for latent features
- Contextual bandits for dynamic 80/20 ratio
- Temporal dynamics (trends)

### Scalability
- Redis caching layer
- Database read replica
- Batch processing of recommendations
- GraphQL instead of REST

### Feature Additions
- Personalization by time of day
- Seasonal recommendations
- Similar product suggestions
- Click-through rate optimization

---

## Summary

BackAlgoritmo is a lightweight, isolated microservice calculating personalized recommendations. The 80/20 exploitation/exploration split balances relevance with discovery. Read-only database access ensures no side effects. Adequate performance for MVP, with clear scaling path for larger user bases.
