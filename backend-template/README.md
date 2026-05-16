# Backend Configuration Templates

Este directorio contiene archivos de **configuración y tipos para el backend API**. 

⚠️  **IMPORTANTE:** Estos archivos **NO pertenecen a la app móvil**. Son para tu proyecto backend separado.

---

## 📦 Cómo Usar

### Opción 1: Backend Node.js/Express en mismo monorepo

```bash
# Si tu backend está en backend/src/lib/
cp database.config.ts ../backend/src/lib/
cp api.config.ts ../backend/src/lib/
```

### Opción 2: Backend en repositorio separado

1. Crea un repositorio nuevo para tu backend:
   ```bash
   mkdir ../gaia-pacha-backend
   cd ../gaia-pacha-backend
   npm init -y
   npm install express cors dotenv @prisma/client
   npx prisma init
   ```

2. Copia estos archivos:
   ```bash
   cp database.config.ts src/lib/
   cp api.config.ts src/lib/
   ```

3. Configura tu `.env`:
   ```
   DATABASE_HOST=cochatech-baconteam-ucb-2025.a.aivencloud.com
   DATABASE_PORT=16933
   DATABASE_NAME=defaultdb
   DATABASE_USER=avnadmin
   DATABASE_PASSWORD=AVNS_CONTRA_GENERICA
   DATABASE_URL=postgresql://avnadmin:AVNS_CONTRA_GENERICA@cochatech-baconteam-ucb-2025.a.aivencloud.com:16933/defaultdb?sslmode=require
   
   APP_ENV=development
   API_PORT=3000
   JWT_SECRET=your-secret-key
   ```

---

## 📄 Archivos

| Archivo | Propósito |
|---------|----------|
| **database.config.ts** | Funciones para conectar a PostgreSQL. Usa con `pg`, `typeorm`, `knex`, etc. |
| **api.config.ts** | Tipos TypeScript y funciones para estructurar configuración del backend |

---

## 🚀 Ejemplo: Express + Prisma

### 1. Prisma Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String
}
```

### 2. Express Server

```typescript
// src/index.ts
import express from 'express';
import cors from 'cors';
import { getBackendConfig } from '@/lib/api.config';

const app = express();
const config = getBackendConfig();

app.use(cors({ origin: config.api.corsOrigins }));
app.use(express.json());

// Routes
app.post('/auth/login', async (req, res) => {
  // Tu lógica aquí
});

app.listen(config.api.port, () => {
  console.log(`🚀 API running on port ${config.api.port}`);
});
```

### 3. Migrations

```bash
npx prisma migrate dev --name init
npm run dev
```

---

## 🔐 Environment Variables

Le mobile app espera que tu backend esté available en:

- **Development:** `http://localhost:3000/api`
- **Production:** `https://api.gaia-pacha.com/api`

Estos valores están configurados en `eas.json` de la app móvil.

---

## ✅ Endpoints Requeridos

La app móvil consume estos endpoints:

```
POST   /auth/login
POST   /auth/register
POST   /auth/logout
GET    /auth/me

GET    /catalog
GET    /catalog/:id
POST   /catalog/search

GET    /orders
POST   /orders
GET    /orders/:id

GET    /services/nearby
GET    /inventory
GET    /metrics
```

Ver `src/repositories/` en la app móvil para ver las formas exactas de request/response.

---

## 📚 Recursos

- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Express.js](https://expressjs.com/)
- [Aiven Console](https://console.aiven.io/)
