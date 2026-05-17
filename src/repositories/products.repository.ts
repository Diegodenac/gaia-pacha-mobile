import axios from 'axios';

const BACKEND_URL = 'https://gaia-pacha-backend.onrender.com';

// ── Raw DB shape ──────────────────────────────────────────────────────────────
interface RawProduct {
  id_producto: number;
  id_ecoservice: number;
  id_categoria: number;
  nombre_producto: string;
  descripcion_producto: string;
  precio: string;
  foto_producto_url: string;
  disponible: boolean;
  nombre_emprendimiento: string;
  nombre_categoria: string;
}

// ── Public shape ──────────────────────────────────────────────────────────────
export interface EnterpriseProduct {
  id: number;
  enterpriseId: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  available: boolean;
  categoryName: string;
}

// ── Repository ────────────────────────────────────────────────────────────────
export const productsRepository = {
  getByEnterprise: async (enterpriseId: string): Promise<EnterpriseProduct[]> => {
    const response = await axios.get<{ success: boolean; data: RawProduct[] }>(
      `${BACKEND_URL}/api/products`,
      { timeout: 8000 },
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error('Invalid response from products endpoint');
    }

    const id = parseInt(enterpriseId, 10);
    return response.data.data
      .filter((p) => p.id_ecoservice === id)
      .map((p) => ({
        id:           p.id_producto,
        enterpriseId: p.id_ecoservice,
        name:         p.nombre_producto,
        description:  p.descripcion_producto,
        price:        p.precio,
        imageUrl:     p.foto_producto_url,
        available:    p.disponible,
        categoryName: p.nombre_categoria,
      }));
  },
};
