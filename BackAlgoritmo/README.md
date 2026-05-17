# Gaia Pacha — Recommendation Engine API

Lightweight Node.js microservice providing personalized ecosystem service and category recommendations using collaborative filtering with 80/20 exploitation/exploration.

## Documentation

- **[Architecture.md](docs/Architecture.md)** - System design and integration patterns
- **[Setup.md](docs/Setup.md)** - Local development configuration
- **[Features.md](docs/Features.md)** - Algorithm overview and capabilities
- **[ALGORITHM_SPECIFICATION.md](docs/ALGORITHM_SPECIFICATION.md)** - Mathematical specification

---

## 🚀 How to use this API (For Mobile Developers)

**You do NOT need to install or run this service locally.** It is already deployed and running in the cloud. You simply need to make standard HTTP `GET` requests from the React Native app using Axios or Fetch.

**Base URL (Production):** `https://motor-recomendaciones-api.onrender.com`

---

### 1. Get Top Categories (Customer Profile)
Returns a sorted array of Category IDs based on the user's historical affinity scores. Useful for quick filters or profile insights.

* **Endpoint:** `/api/recomendaciones/categorias/:id_customer`
* **Method:** `GET`
* **Example Request:** `GET https://motor-recomendaciones-api.onrender.com/api/recomendaciones/categorias/1`
* **Success Response:**
  ```json
  {
    "status": "success",
    "id_customer": 1,
    "categorias_top_ids": [1, 2, 5]
  }