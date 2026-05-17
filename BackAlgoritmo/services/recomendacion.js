// services/recomendacion.js
const pool = require('./db');

// Funcionalidad 1: Obtener categorías favoritas del usuario
async function obtenerCategoriasPonderadas(id_customer) {
    const query = `
        SELECT id_categoria, SUM(score_interes) as puntaje 
        FROM customer_intereses 
        WHERE id_customer = $1 
        GROUP BY id_categoria 
        ORDER BY puntaje DESC
    `;
    const { rows } = await pool.query(query, [id_customer]);
    return rows.map(r => ({ id_categoria: r.id_categoria, puntaje: parseInt(r.puntaje) }));
}

// Funcionalidad 2: Feed de Ecoservices (Algoritmo 80/20)
async function obtenerRecomendaciones(id_customer) {
    const categoriasTop = await obtenerCategoriasPonderadas(id_customer);
    if (categoriasTop.length === 0) return [];

    const mapaPuntajes = {};
    categoriasTop.forEach(cat => {
        mapaPuntajes[cat.id_categoria] = cat.puntaje;
    });

    const negociosQuery = `
        SELECT 
            e.id_ecoservice,
            array_agg(DISTINCT p.id_categoria) AS categorias_ids
        FROM ecoservices e
        LEFT JOIN productos p ON e.id_ecoservice = p.id_ecoservice
        WHERE e.estado_validacion = 'aprobado'
        GROUP BY e.id_ecoservice;
    `;
    const { rows: ecoservicesDisponibles } = await pool.query(negociosQuery);

    const candidatosPuntuados = ecoservicesDisponibles.map(negocio => {
        let score = 0;
        if (negocio.categorias_ids && negocio.categorias_ids[0] !== null) {
            negocio.categorias_ids.forEach(catId => {
                if (mapaPuntajes[catId]) {
                    score += mapaPuntajes[catId];
                }
            });
        }
        return { id: negocio.id_ecoservice, score };
    });

    candidatosPuntuados.sort((a, b) => b.score - a.score);

    const BATCH_SIZE = 10;
    const EXPLOITATION_COUNT = 8;
    
    const limiteExplotacion = Math.min(EXPLOITATION_COUNT, candidatosPuntuados.length);
    const explotacion = candidatosPuntuados.slice(0, limiteExplotacion);
    
    const sobrantes = candidatosPuntuados.slice(limiteExplotacion);
    sobrantes.sort(() => 0.5 - Math.random());
    
    const limiteExploracion = Math.min(BATCH_SIZE - limiteExplotacion, sobrantes.length);
    const exploracion = sobrantes.slice(0, limiteExploracion);

    const loteFinal = [...explotacion, ...exploracion];
    loteFinal.sort(() => 0.5 - Math.random());

    return loteFinal.map(item => item.id);
}

// Funcionalidad 3: Feed de Productos mezclados de los mejores Ecoservices
async function obtenerProductosRecomendados(id_customer) {
    // 1. Obtenemos los IDs de los mejores ecoservices para este usuario (usando la Funcionalidad 2)
    const ecoservicesIds = await obtenerRecomendaciones(id_customer);

    // Si no hay ecoservices recomendados, devolvemos un arreglo vacío
    if (ecoservicesIds.length === 0) return [];

    // 2. Buscamos TODOS los productos que pertenecen a ese lote selecto de ecoservices
    const productosQuery = `
        SELECT id_producto 
        FROM productos 
        WHERE id_ecoservice = ANY($1::int[])
    `;
    // Pasamos el array de IDs directamente a la consulta SQL
    const { rows } = await pool.query(productosQuery, [ecoservicesIds]);

    // 3. Extraemos solo los números (IDs)
    const productosIds = rows.map(row => row.id_producto);

    // 4. La Magia: Mezclamos la lista completa al azar para que el feed sea variado
    productosIds.sort(() => 0.5 - Math.random());

    return productosIds;
}

module.exports = {
    obtenerCategoriasPonderadas,
    obtenerRecomendaciones,
    obtenerProductosRecomendados
};