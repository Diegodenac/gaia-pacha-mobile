import { apiClient } from '@/lib/apiClient';

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  ecoServiceId: number;
  imageUri: string; // local file uri
}

export const inventoryRepository = {
  getCategories: async () => {
    // We use the full URL if we need to hit Render, but if the local backend is used, it should be configurable.
    const BACKEND_URL = 'https://gaia-pacha-backend.onrender.com';
    const response = await apiClient.get(`${BACKEND_URL}/api/categories`);
    return response.data;
  },

  createProduct: async (data: CreateProductDTO) => {
    const BACKEND_URL = 'https://gaia-pacha-backend.onrender.com';
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('categoryId', data.categoryId.toString());
    formData.append('ecoServiceId', data.ecoServiceId.toString());

    if (data.imageUri) {
      formData.append('image', data.imageUri);
    }

    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      body: formData as any,
      // Do not manually set Content-Type header; fetch will automatically generate the multipart boundary string
    });

    if (!response.ok) {
      throw new Error(`Error en la subida: ${response.statusText}`);
    }

    const result: any = await response.json();
    return result.data;
  }
};
