// services/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { 
    obtenerCategoriasPonderadas, 
    obtenerRecomendaciones,
    obtenerProductosRecomendados 
} = require('./recomendacion');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint 1: Obtener las categorías top de un usuario
app.get('/api/recomendaciones/categorias/:id_customer', async (req, res) => {
    try {
        const { id_customer } = req.params;
        const categoriasTop = await obtenerCategoriasPonderadas(id_customer);
        res.json({
            status: "success",
            id_customer: parseInt(id_customer),
            categorias_top_ids: categoriasTop.map(c => c.id_categoria)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error interno del servidor al obtener categorías" });
    }
});

// Endpoint 2: Obtener Feed de Ecoservices (80/20)
app.get('/api/recomendaciones/ecoservices/:id_customer', async (req, res) => {
    try {
        const { id_customer } = req.params;
        const recomendaciones = await obtenerRecomendaciones(id_customer);
        res.json({
            status: "success",
            id_customer: parseInt(id_customer),
            recomendaciones_ids: recomendaciones
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error interno del servidor al obtener recomendaciones" });
    }
});

// Endpoint 3: Obtener Feed de Productos Mezclados
app.get('/api/recomendaciones/productos/:id_customer', async (req, res) => {
    try {
        const { id_customer } = req.params;
        const productosIds = await obtenerProductosRecomendados(id_customer);
        res.json({
            status: "success",
            id_customer: parseInt(id_customer),
            productos_ids: productosIds
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error interno del servidor al obtener productos" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Motor de recomendaciones corriendo en el puerto ${PORT}`);
});