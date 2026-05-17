# EcoService Registration — Design Prototype

**File:** `claude-designs/ecoservice-registration/index.html`
**Status:** ✅ Implemented

---

## What this is

A self-contained HTML design prototype for the **4-step EcoService registration form**. It runs directly in the browser — no build step, no npm. The visual design follows the Gaia Pacha Design System (forest theme, Inter font, Ionicons).

---

## Entry point (app flow)

A logged-in **customer** can tap "Crea tu EcoService" to launch this registration flow. After completing the 4 steps and submitting, a `POST /api/enterprises` request should be sent with the payload described below.

---

## Form steps

| Step | Title | Fields |
|------|-------|--------|
| 1 | Información del responsable | `nombre_entrepreneur`, `edad_emprendedor` |
| 2 | Identidad del emprendimiento | `nombre_emprendimiento`, `celular_ventas`, `tiempo_mercado`, `descripcion_detallada` |
| 3 | Operación y presencia digital | `horario_atencion`, `tipo_ubicacion`, `link_google_maps` (conditional), `redes_sociales` |
| 4 | Impacto sostenible y archivos | `reduce_empaques`, `actividades_sostenibles`, `resuelve_problematica_ambiental`, `foto_principal_url`, `catalogo_pdf_url` |

---

## DB payload shape (on submit)

```js
{
  nombre_emprendimiento:           string,   // VARCHAR, required
  nombre_entrepreneur:             string,   // VARCHAR
  edad_emprendedor:                string,   // VARCHAR (e.g. "25-34")
  celular_ventas:                  string,   // VARCHAR, 8 digits starting with 6 or 7
  descripcion_detallada:           string,   // TEXT
  horario_atencion:                string,   // VARCHAR — serialized schedule string
  tipo_ubicacion:                  string,   // VARCHAR: "Física" | "Solo negocio virtual"
  link_google_maps:                string,   // TEXT, only when tipo_ubicacion === "Física"
  redes_sociales:                  string,   // TEXT — JSON.stringify({fb, ig, tt})
  tiempo_mercado:                  string,   // VARCHAR (e.g. "1-3")
  actividades_sostenibles:         string,   // TEXT
  reduce_empaques:                 string,   // VARCHAR: "Si" | "En proceso" | "No"
  resuelve_problematica_ambiental: string,   // TEXT
  foto_principal_url:              File,     // File object — upload via multipart to backend
  catalogo_pdf_url:                string,   // TEXT — URL to catalog/website
}
```

On submit the prototype logs this payload to the browser console (`📦 EcoService Registration Payload`).

---

## Field notes

### `horario_atencion` (VARCHAR)
Serialized by `buildHorarioSummary(v)` into a compact string:
```
"Lun a Vie 08:00–18:00 · Sáb 09:00–13:00"
```
Can be reconstructed into the picker's `{active, ranges}` structure with `splitHorario(str)` (also exported to `window.splitHorario`).

### `redes_sociales` (TEXT)
Three separate inputs in the UI (FB / IG / TT). Serialized as JSON on submit:
```json
{"fb":"https://facebook.com/marca","ig":"https://instagram.com/marca","tt":""}
```

### `tipo_ubicacion` (VARCHAR)
Internal values `"fisica"` / `"virtual"` are mapped to DB values `"Física"` / `"Solo negocio virtual"` on submit.

### `reduce_empaques` (VARCHAR)
Internal values `"si"` / `"en_proceso"` / `"no"` are mapped to `"Si"` / `"En proceso"` / `"No"` on submit.

### `foto_principal_url` (File)
The drag-and-drop zone yields a File object. The backend at `POST /api/products` already handles multipart image uploads to Google Drive — a similar endpoint should be added for enterprise registration.

### Bolivia phone validation
8 digits, must start with 6 or 7: `/^[67]\d{7}$/`

---

## Pending backend work

- [ ] Add `POST /api/enterprises` endpoint that accepts the payload above
- [ ] Add image upload handling (Google Drive, same pattern as `POST /api/products`)
- [ ] Add `GET /api/enterprises/mine` to fetch the authenticated user's enterprise after registration

---

## TweaksPanel (design exploration only)

The prototype includes a floating Tweaks panel (lower-right corner) to toggle:
- **Surface:** Forest (light) / Dark
- **Accent:** Emerald / Earth / Blue
- **Stepper:** Numbered / Progress bar
- **Density:** Comfortable / Compact
