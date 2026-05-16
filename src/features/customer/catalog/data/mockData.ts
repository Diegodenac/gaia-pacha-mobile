import { Company, Category, Tag, GreenFact } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Alimentos' },
  { id: 'cat2', name: 'Moda' },
  { id: 'cat3', name: 'Hogar' },
  { id: 'cat4', name: 'Tecnología' },
  { id: 'cat5', name: 'Cuidado Personal' },
];

export const MOCK_TAGS: Tag[] = [
  { id: 'tag1', name: 'Reciclaje' },
  { id: 'tag2', name: 'Orgánico' },
  { id: 'tag3', name: 'Eco Friendly' },
  { id: 'tag4', name: 'Comercio Justo' },
  { id: 'tag5', name: 'Artesanal' },
  { id: 'tag6', name: 'Tecnología Verde' },
  { id: 'tag7', name: 'Vegano' },
  { id: 'tag8', name: 'Zero Waste' },
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp1',
    name: 'EcoBite',
    description: 'Snacks orgánicos y saludables en empaques biodegradables.',
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[1], MOCK_TAGS[7]],
    products: [{ id: 'p1', name: 'Barras energéticas' }, { id: 'p2', name: 'Chips de vegetales' }],
    ecoScore: 4.8,
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=500&q=80',
    location: 'Cochabamba',
    ecoIndicator: 'high',
  },
  {
    id: 'comp2',
    name: 'Tejidos de los Andes',
    description: 'Ropa hecha a mano por artesanos usando algodón orgánico.',
    category: MOCK_CATEGORIES[1],
    tags: [MOCK_TAGS[4], MOCK_TAGS[3], MOCK_TAGS[2]],
    products: [{ id: 'p3', name: 'Chompas' }, { id: 'p4', name: 'Bufandas' }],
    ecoScore: 4.9,
    image: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&w=500&q=80',
    location: 'La Paz',
    ecoIndicator: 'high',
  },
  {
    id: 'comp3',
    name: 'GreenTech Solutions',
    description: 'Accesorios tecnológicos hechos de plásticos oceánicos reciclados.',
    category: MOCK_CATEGORIES[3],
    tags: [MOCK_TAGS[0], MOCK_TAGS[5]],
    products: [{ id: 'p5', name: 'Fundas de celular' }, { id: 'p6', name: 'Soportes de laptop' }],
    ecoScore: 4.5,
    image: 'https://images.unsplash.com/photo-1550009158-9effb61970eb?auto=format&fit=crop&w=500&q=80',
    location: 'Santa Cruz',
    ecoIndicator: 'medium',
  },
  {
    id: 'comp4',
    name: 'Natura Cosmética Local',
    description: 'Jabones y cremas naturales sin químicos ni empaques plásticos.',
    category: MOCK_CATEGORIES[4],
    tags: [MOCK_TAGS[6], MOCK_TAGS[7], MOCK_TAGS[2]],
    products: [{ id: 'p7', name: 'Jabón de avena' }, { id: 'p8', name: 'Champú sólido' }],
    ecoScore: 4.7,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=80',
    location: 'Cochabamba',
    ecoIndicator: 'high',
  },
  {
    id: 'comp5',
    name: 'Casa Viva',
    description: 'Muebles y decoración de hogar hechos con pallets recuperados.',
    category: MOCK_CATEGORIES[2],
    tags: [MOCK_TAGS[0], MOCK_TAGS[4]],
    products: [{ id: 'p9', name: 'Mesas ratonas' }, { id: 'p10', name: 'Estantes' }],
    ecoScore: 4.3,
    image: 'https://images.unsplash.com/photo-1595514535312-321111956e18?auto=format&fit=crop&w=500&q=80',
    location: 'El Alto',
    ecoIndicator: 'medium',
  },
];

export const MOCK_GREEN_FACTS: GreenFact[] = [
  {
    id: 'fact1',
    message: 'Cada compra en EcoBite evita el uso de 3 bolsas plásticas.',
    icon: 'leaf',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900',
  },
  {
    id: 'fact2',
    message: 'Apoyando a artesanos reduces la huella de carbono del transporte internacional.',
    icon: 'earth',
    bgColor: 'bg-teal-100 dark:bg-teal-900',
  },
  {
    id: 'fact3',
    message: 'Los productos Zero Waste pueden reducir tus residuos anuales en un 40%.',
    icon: 'water',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900',
  },
];
