# Gaia Pacha - Guía de Configuración de Base de Datos (PostgreSQL)

Este documento detalla cómo levantar el backend local de la aplicación "Gaia Pacha" para conectarse a la base de datos PostgreSQL en la nube (Aiven) y permitir que la app móvil consuma los datos reales.

## Arquitectura

- **Base de Datos**: PostgreSQL alojado en Aiven (`cochatech-baconteam-ucb-2025.a.aivencloud.com`).
- **Backend**: API construida en Node.js y Express (ubicada en la carpeta `backend/`). Actúa como puente seguro entre la app móvil y la base de datos.
- **Frontend (App Móvil)**: React Native + Expo. Consume la API mediante `axios` y `TanStack Query`.

---

## Prerequisitos

Antes de comenzar en una máquina nueva, asegúrate de tener instalado:
- **Node.js** (versión 18 o superior)
- **Git**
- **Expo Go** en tu celular (para probar la app móvil)

---

## 1. Configuración del Backend

La aplicación móvil **NO** se conecta directamente a la base de datos por motivos de seguridad. Debe comunicarse a través del backend local.

### Paso 1: Instalar dependencias del Backend

Abre una terminal, navega a la carpeta del backend y ejecuta el comando de instalación:

```bash
cd backend
npm install
```

*(Esto instalará `express`, `pg` para PostgreSQL, `cors` y `dotenv`).*

### Paso 2: Configurar las Variables de Entorno

Dentro de la carpeta `backend/`, crea un archivo llamado `.env` (si no existe) y agrega la siguiente configuración:

```env
DATABASE_URL=postgres://avnadmin:AVNS_cPRirzaKUNdIlNvqWwP@cochatech-baconteam-ucb-2025.a.aivencloud.com:16933/defaultdb
PORT=3000
```

> [!WARNING]
> **Aviso Importante sobre SSL:**
> Si tu URL de Aiven venía con `?sslmode=require` al final, **debes quitárselo**. 
> El código en `backend/index.js` ya está configurado para forzar la conexión SSL sin validar el certificado (`ssl: { rejectUnauthorized: false }`). Si dejas el `sslmode=require` en el `.env`, el driver de Node chocará e impedirá la conexión.

### Paso 3: Levantar el Backend

Ejecuta el servidor:

```bash
npm run dev
```

Deberías ver los siguientes mensajes en la terminal:
```text
Gaia Pacha Backend running on http://localhost:3000
✅ Conexión EXITOSA a la base de datos PostgreSQL en Aiven!
```

**Mantén esta terminal abierta.**

---

## 2. Configuración de la App Móvil (Frontend)

Una vez que el backend esté corriendo exitosamente, es momento de levantar la aplicación móvil.

### Paso 1: Instalar dependencias (si es primera vez)

Abre **una nueva pestaña/ventana de terminal**, asegúrate de estar en la raíz del proyecto (no en la carpeta `backend/`) y ejecuta:

```bash
npm install
```

### Paso 2: Configurar la IP del Repositorio (Opcional/Avanzado)

> [!NOTE]
> La app utiliza una función dinámica en `src/repositories/catalogRepository.ts` para obtener automáticamente la IP que Expo le asigna a tu computadora:
> `const hostUri = Constants?.expoConfig?.hostUri;`
> 
> En el 90% de los casos, esto funciona automáticamente y la app en tu celular encontrará la API de tu computadora sin que toques el código.

**Si tienes un error de red o no carga en tu celular:**
1. Es posible que el Firewall de Windows esté bloqueando el puerto 3000. Intenta desactivarlo temporalmente para redes privadas.
2. Si sigue fallando, abre `src/repositories/catalogRepository.ts` y reemplaza la IP dinámica por la IPv4 fija de tu computadora (la puedes ver ejecutando `ipconfig` en Windows), por ejemplo:
   `const BACKEND_URL = 'http://192.168.1.50:3000';`

### Paso 3: Iniciar la App

Limpia el caché e inicia Expo:

```bash
npx expo start -c
```

Escanea el código QR con Expo Go en tu celular. Deberás ser dirigido automáticamente a la pantalla de "Descubre" y verás los datos de tu base de datos de Aiven cargando en tiempo real.

---

## Solución de Problemas Comunes

| Problema | Causa Posible | Solución |
|----------|---------------|----------|
| **`Error de conexión al servidor (backend)` en el celular** | El celular y la PC no están en el mismo WiFi, o el Firewall de la PC bloquea el puerto 3000. | Revisa tu conexión WiFi, deshabilita el Firewall temporalmente, o usa una IP fija en `catalogRepository.ts`. |
| **`self-signed certificate in certificate chain` en el backend** | Olvidaste quitar `?sslmode=require` del archivo `.env`. | Borra el parámetro de la URL en `.env` y reinicia el servidor. |
| **Aparece el Login en vez del Catálogo** | Caché antiguo de Expo Router. | Cierra el servidor de Expo y levántalo con el flag de limpieza: `npx expo start -c`. |
