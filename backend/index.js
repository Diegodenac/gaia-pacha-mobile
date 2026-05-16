require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection on startup
pool.connect()
  .then(client => {
    console.log('✅ Conexión EXITOSA a la base de datos PostgreSQL en Aiven!');
    client.release();
  })
  .catch(err => {
    console.error('❌ FALLO en la conexión a la base de datos:', err.message);
  });

app.get('/api/catalog', async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id_ecoservice as id,
        e.nombre_emprendimiento as name,
        e.descripcion_detallada as description,
        e.foto_principal_url as image,
        e.estado_validacion,
        e.tipo_ubicacion as location,
        e.actividades_sostenibles as tags_string,
        (
          SELECT json_build_object('id', CAST(c.id_categoria AS TEXT), 'name', c.nombre_categoria)
          FROM productos p
          JOIN categorias c ON c.id_categoria = p.id_categoria
          WHERE p.id_ecoservice = e.id_ecoservice
          LIMIT 1
        ) as category,
        (
          SELECT COALESCE(json_agg(json_build_object('id', CAST(p2.id_producto AS TEXT), 'name', p2.nombre_producto)), '[]')
          FROM productos p2
          WHERE p2.id_ecoservice = e.id_ecoservice
        ) as products
      FROM ecoservices e
    `;
    const { rows } = await pool.query(query);

    const formattedCompanies = rows.map(row => {
      // Parse tags
      let tags = [];
      if (row.tags_string) {
        tags = row.tags_string.split(',').map((t, index) => ({
          id: `tag-${row.id}-${index}`,
          name: t.trim()
        })).filter(t => t.name.length > 0);
      }

      // Default category if none found
      const category = row.category || { id: '0', name: 'Sin categoría' };

      // Map eco indicator
      const ecoIndicator = row.estado_validacion === 'aprobado' ? 'high' : 'medium';
      
      // Calculate a fake score for MVP since score isn't in DB ecoservices table yet
      const ecoScore = row.estado_validacion === 'aprobado' ? 4.8 : 4.0;

      return {
        id: String(row.id),
        name: row.name || 'Empresa sin nombre',
        description: row.description || '',
        category,
        tags,
        products: row.products || [],
        ecoScore,
        image: row.image || 'https://images.unsplash.com/photo-1550009158-9effb61970eb?auto=format&fit=crop&w=500&q=80',
        location: row.location || 'Bolivia',
        ecoIndicator
      };
    });

    res.json(formattedCompanies);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint just to check DB connection
app.get('/api/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gaia Pacha Backend running on http://localhost:${PORT}`);
});
