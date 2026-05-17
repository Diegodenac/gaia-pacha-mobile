require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const JWT_SECRET = process.env.JWT_SECRET || 'gaia-pacha-dev-secret-change-in-prod';
const JWT_EXPIRES_IN = '30d';

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// ── DB Pool ───────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
  } else {
    console.log('✅ Conexión EXITOSA a la base de datos PostgreSQL en Aiven!');
    release();
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Converts any Google Drive share/view URL to a direct thumbnail URL.
 * Handles: open?id=, file/d/, uc?id= formats.
 */
function convertDriveUrl(url) {
  if (!url || !url.includes('drive.google.com')) return url;

  const fileMatch = url.match(/\/file\/d\/([^/?&#]+)/);
  if (fileMatch) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1200`;
  }
  const idMatch = url.match(/[?&]id=([^&#]+)/);
  if (idMatch) {
    return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1200`;
  }
  return url;
}

/**
 * Uploads a file buffer to Google Drive using a Service Account.
 */
async function uploadToDrive(fileBuffer, fileName, mimeType) {
  const credentialsPath = path.join(__dirname, 'google-credentials.json');
  if (!fs.existsSync(credentialsPath)) {
    console.warn('⚠️ No google-credentials.json found. Using mock image URL.');
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const folderId = '1VM3QIftPvHOPw_L2cb893iD2L1to1DpR';

  const stream = new Readable();
  stream.push(fileBuffer);
  stream.push(null);

  const fileMetadata = {
    name: fileName,
    parents: [folderId]
  };

  const media = {
    mimeType: mimeType,
    body: stream
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    // Make public
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: { role: 'reader', type: 'anyone' }
    });

    return `https://drive.google.com/thumbnail?id=${file.data.id}&sz=w1200`;
  } catch (error) {
    console.error('Error uploading to Drive:', error.message);
    throw new Error('No se pudo subir la imagen a Google Drive.');
  }
}

/**
 * Maps a nombre_categoria from the DB to one of the EcoCategory values
 * used by the frontend (organic_food | sustainable_fashion | recycling | renewable_energy | other).
 */
function mapCategory(nombre) {
  if (!nombre) return 'other';
  const n = nombre.toLowerCase();
  if (n.includes('aliment') || n.includes('bebida') || n.includes('orgán') || n.includes('organic')) return 'organic_food';
  if (n.includes('moda') || n.includes('textil') || n.includes('tejido') || n.includes('ropa') || n.includes('fashion')) return 'sustainable_fashion';
  if (n.includes('recicl') || n.includes('2da vida') || n.includes('cartón') || n.includes('carton') || n.includes('residuo')) return 'recycling';
  if (n.includes('energí') || n.includes('energia') || n.includes('solar') || n.includes('transporte ecológ') || n.includes('renovable')) return 'renewable_energy';
  return 'other';
}

/**
 * Extracts a human-readable location string from the raw DB value.
 * tipo_ubicacion values are verbose dropdown options, so we clean them up.
 */
function parseLocation(tipoUbicacion, linkMaps) {
  if (tipoUbicacion) {
    const lower = tipoUbicacion.toLowerCase();
    if (lower.includes('virtual') || lower.includes('negocio virtual')) return 'Negocio Virtual';
    if (lower.includes('punto de entrega')) return 'Punto de Entrega · Bolivia';
    if (lower.includes('punto de venta')) return 'Punto de Venta · Bolivia';
    if (lower.includes('mi casa')) return 'Entrega a Domicilio · Bolivia';
  }
  if (linkMaps && !linkMaps.startsWith('http')) {
    // It's a text description, not an actual link — use first 35 chars
    return linkMaps.substring(0, 35).trim();
  }
  return 'Bolivia';
}

/**
 * Infers an impactSummary from the available sustainability fields.
 */
function buildImpactSummary(row) {
  if (row.resuelve_problematica_ambiental) return row.resuelve_problematica_ambiental;
  if (row.actividades_sostenibles) return row.actividades_sostenibles;
  if (row.descripcion_detallada) return row.descripcion_detallada.substring(0, 120);
  return '';
}

/**
 * Builds greenSignals from available DB fields.
 * Returns array of { label, value } objects.
 */
function buildGreenSignals(row) {
  const signals = [];
  if (row.tiempo_mercado) {
    signals.push({ label: 'En el mercado', value: row.tiempo_mercado });
  }
  if (row.reduce_empaques) {
    const val = ['si', 'sí', 'yes', 'true'].includes(row.reduce_empaques.toLowerCase()) ? 'Sí' : row.reduce_empaques;
    signals.push({ label: 'Reduce empaques', value: val });
  }
  if (row.horario_atencion) {
    const horario = row.horario_atencion.substring(0, 30).trim();
    signals.push({ label: 'Horario', value: horario });
  }
  return signals;
}

/**
 * Builds impact badges from validaciones_indicadores and validation status.
 */
function buildImpactBadges(row) {
  const badges = [];
  if (['validado', 'activo'].includes((row.estado_validacion ?? '').toLowerCase())) {
    badges.push('Eco Verificado');
  }
  if (row.validaciones_indicadores) {
    const parts = String(row.validaciones_indicadores)
      .split(/[,;|\n]+/)
      .map((b) => b.trim())
      .filter((b) => b.length > 2 && b.length < 60);
    badges.push(...parts.slice(0, 3));
  }
  return badges;
}

/**
 * Maps a raw ecoservices row + joined category row → GreenEnterprise shape.
 */
function mapEnterprise(row) {
  return {
    id: String(row.id_ecoservice ?? ''),
    name: (row.nombre_emprendimiento ?? '').trim(),
    description: (row.descripcion_detallada ?? '').trim(),
    category: mapCategory(row.nombre_categoria),
    categoryLabel: row.nombre_categoria ?? 'Eco Emprendimiento',
    imageUrl: convertDriveUrl(row.foto_principal_url ?? ''),
    logoUrl: '',  // no logo column in DB — frontend will use mock fallback
    location: parseLocation(row.tipo_ubicacion, row.link_google_maps),
    impactSummary: buildImpactSummary(row),
    greenSignals: buildGreenSignals(row),
    impactBadges: buildImpactBadges(row),
    keywords: [],
  };
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gaia-pacha-backend' });
});

// GET /api/enterprises — list with optional ?category=&search=&page=&limit= filters
app.get('/api/enterprises', async (req, res) => {
  try {
    const { search, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const params = [];
    const clauses = [];

    if (search) {
      params.push(`%${String(search).toLowerCase()}%`);
      const n = params.length;
      clauses.push(`(LOWER(e.nombre_emprendimiento) LIKE $${n} OR LOWER(e.descripcion_detallada) LIKE $${n})`);
    }

    if (category && category !== 'all') {
      let catNames = [];
      if (category === 'organic_food') catNames = ['aliment', 'bebida', 'orgán', 'organic'];
      else if (category === 'sustainable_fashion') catNames = ['moda', 'textil', 'tejido', 'ropa', 'fashion'];
      else if (category === 'recycling') catNames = ['recicl', '2da vida', 'cartón', 'carton', 'residuo'];
      else if (category === 'renewable_energy') catNames = ['energí', 'energia', 'solar', 'transporte ecológ', 'renovable'];

      if (catNames.length > 0) {
        const catClauses = catNames.map(name => {
          params.push(`%${name}%`);
          return `LOWER(c.nombre_categoria) LIKE $${params.length}`;
        });
        clauses.push(`(${catClauses.join(' OR ')})`);
      }
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

    const joins = `
      LEFT JOIN LATERAL (
        SELECT id_categoria FROM studio_contenido WHERE id_ecoservice = e.id_ecoservice
        UNION
        SELECT id_categoria FROM productos WHERE id_ecoservice = e.id_ecoservice
        LIMIT 1
      ) sc_link ON true
      LEFT JOIN categorias c ON c.id_categoria = sc_link.id_categoria
    `;

    // 1. Get total count for pagination metadata
    const countSql = `SELECT COUNT(*) FROM ecoservices e ${joins} ${where}`;
    const countResult = await pool.query(countSql, params);
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    // 2. Add LIMIT and OFFSET params
    params.push(limit, offset);
    const limitIdx = params.length - 1;
    const offsetIdx = params.length;

    const sql = `
      SELECT
        e.*,
        c.id_categoria,
        c.nombre_categoria,
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'id', p.id_producto,
                'name', p.nombre_producto,
                'description', p.descripcion_producto,
                'price', p.precio,
                'imageUrl', p.foto_producto_url,
                'available', p.disponible
              )
            ),
            '[]'
          )
          FROM productos p
          WHERE p.id_ecoservice = e.id_ecoservice
        ) as productos_json
      FROM ecoservices e
      LEFT JOIN LATERAL (
        SELECT id_categoria FROM studio_contenido WHERE id_ecoservice = e.id_ecoservice
        UNION
        SELECT id_categoria FROM productos WHERE id_ecoservice = e.id_ecoservice
        LIMIT 1
      ) sc_link ON true
      LEFT JOIN categorias c ON c.id_categoria = sc_link.id_categoria
      ${where}
      ORDER BY e.id_ecoservice
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;

    const result = await pool.query(sql, params);
    console.log(`[GET /api/enterprises] page=${page} rows=${result.rows.length}`);

    res.json({
      success: true,
      data: result.rows.map(mapEnterprise),
      count: result.rows.length,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (err) {
    console.error('[GET /api/enterprises] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/enterprises/:id
app.get('/api/enterprises/:id', async (req, res) => {
  try {
    const sql = `
      SELECT e.*, c.nombre_categoria
      FROM ecoservices e
      LEFT JOIN LATERAL (
        SELECT sc.id_categoria FROM studio_contenido sc
        WHERE sc.id_ecoservice = e.id_ecoservice LIMIT 1
      ) sc_link ON true
      LEFT JOIN categorias c ON c.id_categoria = sc_link.id_categoria
      WHERE e.id_ecoservice = $1
    `;
    const result = await pool.query(sql, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Enterprise not found' });
    }

    res.json({ success: true, data: mapEnterprise(result.rows[0]) });
  } catch (err) {
    console.error('[GET /api/enterprises/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/categories
app.get('/api/categories', async (req, res) => {
  try {
    const sql = `SELECT * FROM categorias ORDER BY nombre_categoria ASC`;
    const result = await pool.query(sql);
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('[GET /api/categories] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products — list products (with optional filtering by ?ecoservice_id=)
app.get('/api/products', async (req, res) => {
  try {
    const { ecoservice_id } = req.query;
    let sql = `
      SELECT p.*, e.nombre_emprendimiento, c.nombre_categoria
      FROM productos p
      LEFT JOIN ecoservices e ON p.id_ecoservice = e.id_ecoservice
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    `;
    const params = [];

    if (ecoservice_id) {
      sql += ` WHERE p.id_ecoservice = $1`;
      params.push(ecoservice_id);
    }

    sql += ` ORDER BY p.id_producto DESC`;

    const result = await pool.query(sql, params);
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('[GET /api/products] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id — get a single product by id
app.get('/api/products/:id', async (req, res) => {
  try {
    const sql = `
      SELECT p.*, e.nombre_emprendimiento, c.nombre_categoria
      FROM productos p
      LEFT JOIN ecoservices e ON p.id_ecoservice = e.id_ecoservice
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = $1
    `;
    const result = await pool.query(sql, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('[GET /api/products/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products — create a new product (handles image upload)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, categoryId, ecoServiceId } = req.body;

    if (!name || !price || !categoryId || !ecoServiceId) {
      return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToDrive(req.file.buffer, req.file.originalname || 'product.jpg', req.file.mimetype);
    } else if (req.body.image) {
      imageUrl = req.body.image;
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';
    }

    const sql = `
      INSERT INTO productos (nombre_producto, descripcion_producto, precio, foto_producto_url, disponible, id_ecoservice, id_categoria)
      VALUES ($1, $2, $3, $4, true, $5, $6)
      RETURNING *
    `;
    const params = [name, description || '', price, imageUrl, ecoServiceId, categoryId];

    const result = await pool.query(sql, params);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('[POST /api/products] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── Auth — DB Init ────────────────────────────────────────────────────────────

pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id_usuarios    SERIAL PRIMARY KEY,
    email          VARCHAR(255) UNIQUE NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    tipo_usuario   VARCHAR(50)  NOT NULL DEFAULT 'customer'
                   CHECK (tipo_usuario IN ('customer', 'ecoservice')),
    fecha_registro TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  )
`).then(() => console.log('✅ Tabla usuarios lista'))
  .catch((err) => console.error('❌ Error creando tabla usuarios:', err.message));

// ── Auth — Helpers ────────────────────────────────────────────────────────────

function makeUserPayload(row) {
  return {
    id:        String(row.id_usuarios),
    email:     row.email,
    role:      row.tipo_usuario,
    createdAt: row.fecha_registro,
  };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization ?? '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No autorizado' });
  }
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
  }
}

// ── Auth — Routes ─────────────────────────────────────────────────────────────

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, role = 'customer' } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email y contraseña son requeridos' });
    }
    if (!['customer', 'ecoservice'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Tipo de usuario inválido' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await pool.query('SELECT id_usuarios FROM usuarios WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'El email ya está registrado' });
    }
    const result = await pool.query(
      'INSERT INTO usuarios (email, password_hash, tipo_usuario) VALUES ($1, $2, $3) RETURNING *',
      [normalizedEmail, password, role],
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id_usuarios, email: user.email, role: user.tipo_usuario }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    console.log(`[POST /auth/register] id=${user.id_usuarios} tipo=${user.tipo_usuario}`);
    res.status(201).json({ success: true, data: { user: makeUserPayload(user), token } });
  } catch (err) {
    console.error('[POST /auth/register]', err.message);
    res.status(500).json({ success: false, error: 'Error al crear la cuenta' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email y contraseña son requeridos' });
    }
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email.trim().toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }
    const user = result.rows[0];
    if (password !== user.password_hash) {
      return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }
    const token = jwt.sign({ id: user.id_usuarios, email: user.email, role: user.tipo_usuario }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    console.log(`[POST /auth/login] id=${user.id_usuarios}`);
    res.json({ success: true, data: { user: makeUserPayload(user), token } });
  } catch (err) {
    console.error('[POST /auth/login]', err.message);
    res.status(500).json({ success: false, error: 'Error al iniciar sesión' });
  }
});

app.post('/auth/logout', (_req, res) => res.json({ success: true }));

app.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id_usuarios = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: makeUserPayload(result.rows[0]) });
  } catch (err) {
    console.error('[GET /auth/me]', err.message);
    res.status(500).json({ success: false, error: 'Error al obtener usuario' });
  }
});

app.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email es requerido' });
  console.log(`[POST /auth/forgot-password] solicitado para ${email}`);
  res.json({ success: true, message: 'Si el email existe, recibirás un enlace de recuperación' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gaia Pacha Backend running on http://localhost:${PORT}`);
});

