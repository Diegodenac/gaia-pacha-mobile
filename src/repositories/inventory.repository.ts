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
      const filename = data.imageUri.split('/').pop() || 'product.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', {
        uri: data.imageUri,
        name: filename,
        type,
      } as any);
    }

    const response = await apiClient.post(`${BACKEND_URL}/api/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
};
