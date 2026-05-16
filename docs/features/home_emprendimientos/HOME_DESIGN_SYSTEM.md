# HOME_DESIGN_SYSTEM.md
## Feature: Home — Emprendimientos Verdes (Customer Feed)

> **Branch origen:** `feat/show-emprendimientos`
> **Merged a:** `main` — commit `31822d37`
> **Autor:** BetoHerbas
> **Estado:** ✅ Mergeado en main. Pendiente integración con `feature-explorer`.

---

## 1. Propósito

La pantalla Home del Customer muestra un feed vertical de **emprendimientos verdes** (empresas eco-sostenibles de Bolivia). Los datos vienen del backend PostgreSQL (Aiven) y hacen fallback al mock local cuando el backend no está disponible.

---

## 2. Mapa de Componentes

```
app/(customer)/index.tsx
       │
       │ usa hook
       ▼
src/features/customer/home/hooks/useEnterprisesQuery.ts
       │
       │ llama al repositorio
       ▼
src/repositories/enterprises.repository.ts
       │
       │ fetch + enrichWithMockFallback
       ▼
src/features/customer/home/mockData.ts   ← datos de relleno / seed visual
       │
       │ datos renderizados por
       ▼
src/components/molecules/ImpactServiceCard.tsx   ← componente principal de card
```

---

## 3. Design Tokens — Paleta del Feature

Todos los colores están definidos inline en `ImpactServiceCard.tsx` vía `StyleSheet.create`.
Esta sección los centraliza como referencia.

### 3.1 Fondos de Tarjeta

| Elemento            | Color             | Uso                                      |
|---------------------|-------------------|------------------------------------------|
| Card base           | `#FFFFFF`         | Fondo principal de la card               |
| Image overlay       | `rgba(6,78,59,0.22)` | Tinte verde-bosque sobre hero image  |
| Impact box bg       | `#F0FDF4`         | Caja de resumen de impacto               |
| Signal box bg       | `#F0FDF4`         | Cajas de Green Signals                   |
| Badge bg            | `#ECFDF5`         | Pills de impact badges                   |

### 3.2 Bordes y Sombras

| Elemento            | Valor                            |
|---------------------|----------------------------------|
| Card border-radius  | `22px`                           |
| Card shadow color   | `#064E3B` (verde oscuro)         |
| Card shadow opacity | `0.14` (normal) / `0.05` (pressed) |
| Card elevation      | `7` (normal) / `2` (pressed)    |
| Impact box border   | Left `3px solid #10B981`         |
| Signal box border   | `1px solid #BBF7D0`              |
| Badge border        | `1px solid #A7F3D0`              |

### 3.3 Tipografía

| Elemento           | Size | Weight | Color     |
|--------------------|------|--------|-----------|
| Nombre empresa     | 19   | 800    | `#111827` |
| Descripción        | 14   | 400    | `#374151` |
| Ubicación          | 13   | 500    | `#6B7280` |
| Impact summary     | 13   | 400    | `#065F46` (italic) |
| Signal label       | 10   | 700    | `#059669` (uppercase) |
| Signal value       | 13   | 600    | `#111827` |
| Badge text         | 11   | 600    | `#065F46` |
| CTA text           | 14   | 700    | `#FFFFFF` |
| Eco badge text     | 11   | 700    | `#6EE7B7` |

### 3.4 Colores de Acento por Categoría

Definidos en `CATEGORY_STYLES` dentro de `ImpactServiceCard.tsx`:

| Categoría              | `bg`      | `text`    | Emoji |
|------------------------|-----------|-----------|-------|
| `organic_food`         | `#DCFCE7` | `#14532D` | 🌾    |
| `other` (Biodiversidad)| `#D1FAE5` | `#064E3B` | 🦁    |
| `sustainable_fashion`  | `#FEF3C7` | `#92400E` | 🧵    |
| `recycling`            | `#DCFCE7` | `#14532D` | ♻️    |
| `renewable_energy`     | `#DBEAFE` | `#1E3A8A` | ☀️    |
| `eco_tourism`          | `#CFFAFE` | `#164E63` | 🏔️    |
| `green_transport`      | `#F0FDF4` | `#166534` | 🚲    |

### 3.5 CTA Button

| Propiedad       | Valor       |
|-----------------|-------------|
| Background      | `#3B82F6` (azul) |
| Border-radius   | `14px`      |
| Padding vertical| `12px`      |
| Icono           | `arrow-forward` (Ionicons) |

---

## 4. Anatomía de `ImpactServiceCard`

```
┌─────────────────────────────────────────┐
│  [Hero Image — 200px height]            │
│  ┌──────────────────┐   ┌───────────┐  │
│  │ 🌾 Alimentacion  │   │🌿Eco Ver.│  │  ← catChip (top-left) + ecoBadge (top-right)
│  └──────────────────┘   └───────────┘  │
│                              ┌────────┐ │
│                              │ [Logo] │ │  ← logoThumb (bottom-right, -18px overflow)
│                              └────────┘ │
├─────────────────────────────────────────┤
│  Nombre Empresa                         │  ← name (19px/800)
│  📍 Cochabamba                          │  ← locationRow
│  Descripción breve...                   │  ← description (2 lines)
│  ┌─────────────────────────────────┐   │
│  │ 🌿 Resumen de impacto (italic)  │   │  ← impactBox (border-left verde)
│  └─────────────────────────────────┘   │
│  ┌──────────────┐ ┌──────────────────┐ │
│  │ Practica     │ │ Compromiso       │ │  ← signalsRow (2 signalBox)
│  │ verde: ...   │ │ ...              │ │
│  └──────────────┘ └──────────────────┘ │
│  [✓ Badge 1]  [✓ Badge 2]             │  ← badgesRow (flexWrap)
│  ┌─────────────────────────────────┐  │
│  │      Conocer empresa  →         │  │  ← CTA button (#3B82F6)
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 5. Categorías de Filtro (Filter Bar)

Definidas en `HOME_CATEGORIES` en `mockData.ts`:

| `id`                 | Label            |
|----------------------|------------------|
| `all`                | Todas            |
| `organic_food`       | Alimentacion     |
| `other`              | Biodiversidad    |
| `sustainable_fashion`| Moda Sostenible  |
| `recycling`          | Reciclaje        |
| `renewable_energy`   | Energia Limpia   |

---

## 6. Data Shape — `GreenEnterprise`

```typescript
interface GreenEnterprise {
  id:            string;        // 'eco-1', 'eco-2', ...
  name:          string;        // Nombre del emprendimiento
  description:   string;        // Descripción corta (max 2 líneas en card)
  category:      EcoCategory;   // union type del sistema
  categoryLabel: string;        // Label legible para el chip
  imageUrl:      string;        // Hero image (Unsplash / DB)
  logoUrl:       string;        // Logo thumbnail
  location:      string;        // Ciudad / localidad
  impactSummary: string;        // Texto de impacto (itálica en card)
  greenSignals:  GreenSignal[]; // Max 2 se muestran: { label, value }
  impactBadges:  string[];      // Pills de certificación (flexWrap)
  keywords:      string[];      // Usado para búsqueda/filtro
}
```

---

## 7. Estrategia de Datos — Fallback inteligente

El repositorio implementa `enrichWithMockFallback` para garantizar que **las cards siempre se vean completas**, incluso cuando la DB no tiene todos los campos visuales poblados:

| Campo           | Estrategia                                        |
|-----------------|---------------------------------------------------|
| `imageUrl`      | Real si existe, sino mock de Unsplash             |
| `logoUrl`       | Real si existe, sino mock de Unsplash             |
| `categoryLabel` | Real si existe, sino mock                         |
| `impactSummary` | Real si existe, sino mock                         |
| `greenSignals`  | Real si `length > 0`, sino mock (2 señales)       |
| `impactBadges`  | Real si `length > 0`, sino mock (2 badges)        |
| `keywords`      | Real si `length > 0`, sino mock                   |

---

## 8. Cache Policy (TanStack Query)

| Propiedad         | Valor                          | Razón                                           |
|-------------------|--------------------------------|-------------------------------------------------|
| `staleTime`       | `5 min`                        | El feed de emprendimientos cambia poco          |
| `retry`           | `1`                            | Un reintento, luego muestra placeholder         |
| `placeholderData` | `GREEN_ENTERPRISES` (mock)     | Feed visible instantáneamente sin flash         |
| `isFromBackend`   | `isSuccess && !isPlaceholderData` | Flag para UI: muestra badge "Datos en vivo" |

---

## 9. Auto-detección de URL del Backend

El repositorio detecta automáticamente la IP del backend en la misma red WiFi:

```typescript
// enterprises.repository.ts
function getBackendUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri; // "192.168.x.x:8081"
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3000`;  // Reemplaza puerto Metro con puerto backend
  }
  return 'http://localhost:3000';
}
```

**Requisito:** El teléfono y la PC deben estar en la **misma red WiFi**.

---

## 10. Datos Mock de Referencia (Seed visual)

| ID      | Nombre                  | Categoría            | Ciudad       |
|---------|-------------------------|----------------------|--------------|
| eco-1   | Raiz Viva Alimentos     | organic_food         | Cochabamba   |
| eco-2   | BioFauna Andina         | other                | Sacaba       |
| eco-3   | Trama Circular          | sustainable_fashion  | Quillacollo  |
| eco-4   | ReCiclo Barrio Norte    | recycling            | Tiquipaya    |
| eco-5   | Sol de Valle Energia    | renewable_energy     | Colcapirhua  |

---

## 11. Notas de Integración con `feature-explorer`

Al hacer merge de `feature-explorer` → `main`, considerar:

| Aspecto | Home (este feature) | Explorer Tab |
|---|---|---|
| Card principal | `ImpactServiceCard` — card expandida, luz/blanca | `ExplorerCard` — staggered, oscuro #333333 |
| Paleta | Light mode (`#fff`, verdes claros) | Dark mode (`#191616`, `#333333`) |
| Datos | `GreenEnterprise` (con greenSignals, badges) | `ExplorerItem` (normalizado de catalog) |
| Hook | `useEnterprisesQuery` → `enterprisesRepository` | `useExplorerFeedQuery` → `explorerRepository` |
| Backend | `POST /api/enterprises` (backend propio) | Catalog API + client normalizer |

**Decisión pendiente:** Definir si el Home final usa `ImpactServiceCard` o `ExplorerCard`, o si conviven en tabs diferentes.
