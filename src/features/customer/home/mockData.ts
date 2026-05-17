import type { EcoCategory } from '@/types';

export interface GreenSignal {
  label: string;
  value: string;
}

export interface GreenEnterprise {
  id: string;
  name: string;
  description: string;
  category: EcoCategory;
  categoryLabel: string;
  imageUrl: string;
  logoUrl: string;
  location: string;
  impactSummary: string;
  greenSignals: GreenSignal[];
  impactBadges: string[];
  keywords: string[];
  // Detail fields — populated from full DB row
  phone?: string;
  socialNetworksRaw?: string;
  schedule?: string;
  linkGoogleMaps?: string;
  isVirtual?: boolean;
  ecoActivities?: string;
  environmentalProblem?: string;
  entrepreneurName?: string;
}

// ── Mock product catalog (displayed in detail screen until real products load) ──
export interface MockProduct {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  description: string;
  badge?: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'mp-1',
    name: 'Pack Eco Básico',
    price: 'Bs. 45',
    badge: 'Destacado',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    description: 'Kit de inicio sostenible',
  },
  {
    id: 'mp-2',
    name: 'Cesta Orgánica',
    price: 'Bs. 80',
    badge: 'Popular',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
    description: 'Productos de temporada',
  },
  {
    id: 'mp-3',
    name: 'Kit Reciclaje',
    price: 'Bs. 35',
    badge: 'Nuevo',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80',
    description: 'Empaques reutilizables',
  },
  {
    id: 'mp-4',
    name: 'Cosméticos Nat.',
    price: 'Bs. 120',
    badge: 'Premium',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    description: 'Sin químicos artificiales',
  },
  {
    id: 'mp-5',
    name: 'Artesanía Local',
    price: 'Bs. 60',
    badge: 'Artesanal',
    imageUrl: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=400&q=80',
    description: 'Hecho con amor',
  },
];

export const HOME_CATEGORIES: Array<{ id: 'all' | EcoCategory; label: string }> = [
  { id: 'all',                label: 'Todas' },
  { id: 'organic_food',       label: 'Alimentacion' },
  { id: 'other',              label: 'Biodiversidad' },
  { id: 'sustainable_fashion',label: 'Moda Sostenible' },
  { id: 'recycling',          label: 'Reciclaje' },
  { id: 'renewable_energy',   label: 'Energia Limpia' },
];

export const GREEN_ENTERPRISES: GreenEnterprise[] = [
  {
    id: 'eco-1',
    name: 'Raiz Viva Alimentos',
    description: 'Canastas de temporada con productores agroecologicos locales.',
    category: 'organic_food',
    categoryLabel: 'Alimentacion',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    logoUrl:  'https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=200&q=80',
    location: 'Cochabamba',
    impactSummary: 'Emprendimiento familiar que prioriza proveedores locales y temporadas naturales.',
    greenSignals: [
      { label: 'Practica verde', value: 'Compostaje barrial' },
      { label: 'Compromiso',     value: 'Compras de cercania' },
    ],
    impactBadges: ['Consumo Consciente', 'Comercio Justo'],
    keywords: ['agroecologico', 'canastas', 'organico', 'local'],
  },
  {
    id: 'eco-2',
    name: 'BioFauna Andina',
    description: 'Experiencias de conservacion y adopcion simbolica de fauna nativa.',
    category: 'other',
    categoryLabel: 'Biodiversidad',
    imageUrl: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=1200&q=80',
    logoUrl:  'https://images.unsplash.com/photo-1474511016488-7db0ff3fb112?auto=format&fit=crop&w=200&q=80',
    location: 'Sacaba',
    impactSummary: 'Proyecto comunitario que sensibiliza sobre fauna nativa y cuidado del entorno.',
    greenSignals: [
      { label: 'Practica verde', value: 'Educacion ambiental' },
      { label: 'Compromiso',     value: 'Red de voluntariado' },
    ],
    impactBadges: ['Biodiversidad', 'Educacion Verde'],
    keywords: ['fauna', 'conservacion', 'animales', 'restauracion'],
  },
  {
    id: 'eco-3',
    name: 'Trama Circular',
    description: 'Moda etica hecha con fibras recuperadas y tintes de bajo impacto.',
    category: 'sustainable_fashion',
    categoryLabel: 'Moda Sostenible',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    logoUrl:  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&q=80',
    location: 'Quillacollo',
    impactSummary: 'Marca local que transforma sobrantes textiles en prendas de larga duracion.',
    greenSignals: [
      { label: 'Practica verde', value: 'Reuso de telas' },
      { label: 'Compromiso',     value: 'Produccion artesanal' },
    ],
    impactBadges: ['Economia Circular', 'Hecho Local'],
    keywords: ['moda', 'textil', 'upcycling', 'etico'],
  },
  {
    id: 'eco-4',
    name: 'ReCiclo Barrio Norte',
    description: 'Recoleccion puerta a puerta y trazabilidad de materiales reciclables.',
    category: 'recycling',
    categoryLabel: 'Reciclaje',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    logoUrl:  'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=200&q=80',
    location: 'Tiquipaya',
    impactSummary: 'Iniciativa barrial que conecta hogares con rutas de reciclaje inclusivo.',
    greenSignals: [
      { label: 'Practica verde', value: 'Separacion en origen' },
      { label: 'Compromiso',     value: 'Trabajo con recicladores' },
    ],
    impactBadges: ['Residuo Cero', 'Impacto Comunitario'],
    keywords: ['reciclaje', 'plastico', 'vidrio', 'logistica'],
  },
  {
    id: 'eco-5',
    name: 'Sol de Valle Energia',
    description: 'Micro soluciones solares para hogares y pequenos negocios rurales.',
    category: 'renewable_energy',
    categoryLabel: 'Energia Limpia',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    logoUrl:  'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=200&q=80',
    location: 'Colcapirhua',
    impactSummary: 'Emprendimiento que acerca soluciones solares sencillas a familias y pequenos negocios.',
    greenSignals: [
      { label: 'Practica verde', value: 'Instalacion limpia' },
      { label: 'Compromiso',     value: 'Energia renovable' },
    ],
    impactBadges: ['Energia Limpia', 'Cero Emisiones'],
    keywords: ['solar', 'paneles', 'energia', 'renovable'],
  },
];
