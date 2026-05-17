# Recommendation Engine Features

## Core Algorithms

The recommendation engine implements three collaborative filtering algorithms.

---

## Algorithm 1: Top User Interest Categories

**Function**: `obtenerCategoriasPonderadas(customer_id)`

**Purpose**: Identify user's top interests by category

**Input**: customer_id (integer)

**Output**: Array of {category_id, name, score} sorted by score DESC

**Query**:
```sql
SELECT ci.category_id, c.name, ci.score
FROM customer_intereses ci
JOIN categories c ON ci.category_id = c.id
WHERE ci.customer_id = $1
ORDER BY ci.score DESC
LIMIT 5
```

**Response**:
```json
{
  "status": "success",
  "id_customer": 1,
  "categorias": [
    { "category_id": 1, "name": "Coffee", "score": 95.5 },
    { "category_id": 3, "name": "Tea", "score": 87.2 },
    { "category_id": 2, "name": "Spices", "score": 72.1 }
  ]
}
```

**Use Case**: Understand user preferences, filter by interest

---

## Algorithm 2: EcoService Recommendations

**Function**: `obtenerRecomendaciones(customer_id)`

**Purpose**: Personalized ecosystem service discovery

**Input**: customer_id (integer)

**Output**: 10 EcoServices (shuffled) with {id, name, description, score}

**Algorithm Steps**:

```
Step 1: For each approved EcoService, calculate score
        score = SUM(customer_intereses.score)
                where product.category_id matches user interests

Step 2: Sort by score descending
        Take top 8 (exploitation)

Step 3: Add 2 random EcoServices
        Random from all approved (exploration)

Step 4: Shuffle entire array
        Prevent always showing highest-scored first

Step 5: Return 10 total EcoServices
```

**Exploitation/Exploration Rationale**:
- **80% Exploitation** (8 services): High relevance to user interests
- **20% Exploration** (2 random): Discover new categories, avoid filter bubble
- **Shuffle**: Fairness, show variety even among top services

**Example Response**:
```json
{
  "status": "success",
  "id_customer": 1,
  "ecoservices": [
    { "id": 5, "name": "Green Beans Co", "description": "Coffee", "score": 145.3 },
    { "id": 12, "name": "Tea House", "description": "Premium tea", "score": 89.1 },
    { "id": 7, "name": "Spice Traders", "description": "Exotic spices", "score": 72.4 },
    ...10 total
  ]
}
```

**Performance**: 10-20ms typical

---

## Algorithm 3: Product Recommendations

**Function**: `obtenerProductosRecomendados(customer_id)`

**Purpose**: Personalized product discovery

**Input**: customer_id (integer)

**Output**: Up to 20 products {id, name, price, category_id, ecoservices_id}

**Algorithm Steps**:

```
Step 1: Get top 5 EcoServices via Algorithm 2
        Use highest-scored for best product quality

Step 2: Fetch all products from these 5 EcoServices
        Typically 50-100 products

Step 3: Score each product by its category's interest score
        score = customer_intereses[product.category_id].score

Step 4: Sort by score descending
        Take top 20

Step 5: Return as list
```

**Example Response**:
```json
{
  "status": "success",
  "id_customer": 1,
  "productos": [
    { "id": 1, "name": "Organic Coffee", "price": 12.99, "category_id": 1, "ecoservices_id": 5 },
    { "id": 25, "name": "Green Tea", "price": 8.99, "category_id": 3, "ecoservices_id": 12 },
    ...20 total
  ]
}
```

**Performance**: 15-30ms typical

---

## API Endpoints Summary

| Endpoint | Purpose | Algorithm | Response Size |
|----------|---------|-----------|---|
| `/api/recomendaciones/categorias/:id_customer` | Top user interests | Algorithm 1 | 3-5 categories |
| `/api/recomendaciones/ecoservices/:id_customer` | Personalized services | Algorithm 2 | 10 EcoServices |
| `/api/recomendaciones/productos/:id_customer` | Personalized products | Algorithm 3 | up to 20 products |

---

## Data Requirements

### Required Tables

1. **customer_intereses**
   - Tracks user interest scores (0-100) by category
   - Created by app tracking or admin input
   - Must have records for recommendations to work

2. **ecoservices**
   - Provider profiles
   - Filtered by estado_validacion='aprobado'
   - Returns only approved providers

3. **productos**
   - Product listings
   - Linked to category and EcoService
   - Associated with ecoservices (via foreign key)

4. **categories**
   - Product categories
   - Used to match user interests with products

---

## Scoring Mechanism

### Customer Interest Score

```
Range: 0 to 100 (floating point allowed)
0 = Not interested
100 = Highly interested

Examples:
- 95.5 = Very interested in this category
- 50.0 = Neutral
- 10.2 = Minimal interest
```

### EcoService Scoring

```
score(EcoService) = SUM(
  customer_intereses.score 
  FOR each product in EcoService 
  WHERE product.category_id matches interest
)

Example:
EcoService has:
  - 3 Coffee products (customer interest: 85)
  - 2 Tea products (customer interest: 72)
  
score = (3 * 85) + (2 * 72) = 255 + 144 = 399
```

---

## Edge Cases Handled

1. **New User (No Interests)**
   - No customer_intereses records
   - Return random 10 EcoServices
   - Return random 20 products

2. **User with Few Interests**
   - Less than 5 categories
   - Use all available, pad with random

3. **No EcoServices**
   - No approved providers exist
   - Return 200 OK with empty array

4. **No Products**
   - No products for recommended EcoServices
   - Return available products

---

## Performance Metrics

### Latencies (Measured on MVP)

| Operation | Time | Notes |
|-----------|------|-------|
| Category recommendations | 5-10ms | Single table query |
| EcoService recommendations | 10-20ms | Join multiple tables, sorting |
| Product recommendations | 15-30ms | Most complex, joins 3 tables |
| Total backend→mobile latency | <100ms | Includes serialization, network |

### Scalability

- **Current**: Adequate for 10K+ users
- **Bottleneck**: Database join operations
- **Future**: Redis cache, batch processing

---

## Integration with Backend

Backend proxies all three endpoints:

```javascript
// Backend route
app.get('/recommendations/:type/:userId', async (req, res) => {
  const algo_url = `https://motor-recomendaciones-api.onrender.com/api/recomendaciones/${req.params.type}/${req.params.userId}`;
  const response = await axios.get(algo_url);
  res.json(response.data);
});
```

### Usage from Mobile

```javascript
// Mobile hook
const { data: recommendations } = useQuery({
  queryKey: ['recommendations', 'ecoservices', userId],
  queryFn: () => axios.get(`/recommendations/ecoservices/${userId}`),
  staleTime: Infinity  // Cache for session
});
```

---

## Error Handling

### Success (200 OK)

```json
{
  "status": "success",
  "id_customer": 1,
  "data": [...]
}
```

### Not Found (404)

```json
{
  "status": "error",
  "message": "Customer not found"
}
```

### Server Error (500)

```json
{
  "status": "error",
  "message": "Database connection failed"
}
```

---

## Configuration & Tuning

### Exploitation/Exploration Ratio

Currently hardcoded 80/20:
- 8 top-scored EcoServices
- 2 random EcoServices

**To change** (in services/recomendacion.js):
```javascript
const exploitCount = 8;  // Change here
const exploreCount = 2;  // Change here
```

### Top Categories Limit

Currently returns top 5:
```javascript
LIMIT 5  // Change to any number
```

### Product Recommendations Limit

Currently returns up to 20:
```javascript
LIMIT 20  // Change to any number
```

---

## Future Enhancements

### Short Term
- User-based collaborative filtering (similar users)
- Time decay (recent interactions weighted more)
- Category diversity (force different categories in top 10)

### Medium Term
- Matrix factorization for latent features
- Contextual bandits for dynamic exploration ratio
- A/B testing framework

### Long Term
- Deep learning (neural networks)
- Real-time recommendation updates
- Cross-platform personalization (web, app, etc)

---

## Testing Endpoints

### Categories
```bash
curl http://localhost:4000/api/recomendaciones/categorias/1
```

### EcoServices
```bash
curl http://localhost:4000/api/recomendaciones/ecoservices/1
```

### Products
```bash
curl http://localhost:4000/api/recomendaciones/productos/1
```

---

## Monitoring

Check Render dashboard for:
- Request count by endpoint
- Response time distribution
- Error rates
- Database connection health

---

## Summary

Three algorithms provide progressive levels of recommendation:
1. Categories show what user likes
2. EcoServices match those interests with providers
3. Products surface specific items

The 80/20 split balances relevance with discovery for optimal engagement.

See [ALGORITHM_SPECIFICATION.md](ALGORITHM_SPECIFICATION.md) for mathematical details.
