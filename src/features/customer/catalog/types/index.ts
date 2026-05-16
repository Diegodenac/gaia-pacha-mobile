export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  category: Category;
  tags: Tag[];
  products: Product[];
  ecoScore: number; // e.g., 4.8
  image: string;
  location: string;
  ecoIndicator: 'high' | 'medium' | 'low'; // Defines the color/impact level
}

export interface GreenFact {
  id: string;
  message: string;
  icon: string;
  bgColor: string;
}
