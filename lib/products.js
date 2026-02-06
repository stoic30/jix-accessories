// lib/products.js - SINGLE SOURCE OF TRUTH

export const PRODUCTS_DATABASE = [
  {
    id: 1,
    name: 'Samsung Galaxy S24 Ultra 256GB',
    price: 450000,
    oldPrice: 520000,
    category: 'phones',
    subcategory: 'samsung',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
      'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600&q=80'
    ],
    description: 'The ultimate Samsung flagship with S Pen, powerful Snapdragon 8 Gen 3, and stunning 200MP camera system.',
    specs: {
      Storage: '256GB',
      RAM: '12GB',
      Display: '6.8" Dynamic AMOLED 2X',
      Camera: '200MP + 50MP + 12MP + 10MP',
      Battery: '5000mAh',
      Processor: 'Snapdragon 8 Gen 3',
      Color: 'Titanium Gray'
    },
    inStock: true,
    featured: true,
    sale: true
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max 256GB',
    price: 1200000,
    oldPrice: 1350000,
    category: 'phones',
    subcategory: 'iphone',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80'
    ],
    description: 'The ultimate iPhone with titanium design, A17 Pro chip, and groundbreaking camera system.',
    specs: {
      Storage: '256GB',
      RAM: '8GB',
      Display: '6.7" Super Retina XDR',
      Camera: '48MP + 12MP + 12MP',
      Battery: '4422mAh',
      Processor: 'A17 Pro',
      Color: 'Natural Titanium'
    },
    inStock: true,
    featured: true,
    sale: true
  },
  {
    id: 3,
    name: 'MacBook Pro M3 14"',
    price: 850000,
    category: 'laptops',
    subcategory: 'macbook',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80'
    ],
    description: 'Supercharged by M3 chip with up to 22 hours of battery life.',
    specs: {
      Processor: 'Apple M3 Pro',
      RAM: '16GB',
      Storage: '512GB SSD',
      Display: '14.2" Liquid Retina XDR',
      Graphics: '18-core GPU',
      Battery: 'Up to 22 hours',
      Color: 'Space Black'
    },
    inStock: true,
    featured: true,
    sale: false
  },
  {
    id: 4,
    name: 'AirPods Pro 2nd Gen',
    price: 120000,
    oldPrice: 145000,
    category: 'accessories',
    subcategory: 'earpods',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&q=80',
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&q=80'
    ],
    description: 'Active noise cancellation and personalized spatial audio.',
    specs: {
      'Noise Cancellation': 'Active',
      'Battery Life': 'Up to 6 hours',
      Chip: 'Apple H2',
      'Water Resistance': 'IPX4',
      Connectivity: 'Bluetooth 5.3'
    },
    inStock: true,
    featured: true,
    sale: true
  },
  {
    id: 5,
    name: 'Dell XPS 15 i7 16GB',
    price: 720000,
    oldPrice: 820000,
    category: 'laptops',
    subcategory: 'dell',
    brand: 'Dell',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80'
    ],
    description: 'Premium ultrabook with stunning InfinityEdge display.',
    specs: {
      Processor: 'Intel Core i7-12700H',
      RAM: '16GB DDR5',
      Storage: '512GB SSD',
      Display: '15.6" 3.5K OLED',
      Graphics: 'NVIDIA RTX 3050',
      OS: 'Windows 11'
    },
    inStock: true,
    featured: false,
    sale: true
  },
  {
    id: 6,
    name: 'Oraimo 27000mAh Power Bank',
    price: 18000,
    oldPrice: 22000,
    category: 'accessories',
    subcategory: 'powerbank',
    brand: 'Oraimo',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80'
    ],
    description: 'High-capacity power bank with fast charging.',
    specs: {
      Capacity: '27000mAh',
      Input: 'USB-C 18W',
      Output: '2x USB-A + USB-C',
      'Fast Charge': 'Yes',
      Weight: '520g'
    },
    inStock: true,
    featured: false,
    sale: true
  },
  {
    id: 7,
    name: 'iPad Air M2 11"',
    price: 550000,
    category: 'phones',
    subcategory: 'tablets',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80'
    ],
    description: 'Powerful iPad with M2 chip and stunning display.',
    specs: {
      Storage: '128GB',
      RAM: '8GB',
      Display: '11" Liquid Retina',
      Processor: 'Apple M2',
      Camera: '12MP',
      Battery: '10 hours'
    },
    inStock: true,
    featured: false,
    sale: false
  },
  {
    id: 8,
    name: 'Sony WH-1000XM5',
    price: 180000,
    category: 'accessories',
    subcategory: 'headset',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80'
    ],
    description: 'Industry-leading noise cancellation.',
    specs: {
      Type: 'Over-Ear',
      'Noise Cancellation': 'Active',
      Battery: '30 hours',
      Bluetooth: '5.2',
      Weight: '250g'
    },
    inStock: true,
    featured: false,
    sale: false
  },
  {
    id: 9,
    name: 'HP Pavilion 15 Gaming',
    price: 380000,
    oldPrice: 420000,
    category: 'laptops',
    subcategory: 'hp',
    brand: 'HP',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80'
    ],
    description: 'Gaming laptop with powerful graphics.',
    specs: {
      Processor: 'Intel Core i5-12450H',
      RAM: '16GB DDR4',
      Storage: '512GB SSD',
      Display: '15.6" 144Hz',
      Graphics: 'NVIDIA GTX 1650',
      OS: 'Windows 11'
    },
    inStock: true,
    featured: false,
    sale: true
  },
  {
    id: 10,
    name: 'Samsung Galaxy Buds Pro',
    price: 85000,
    category: 'accessories',
    subcategory: 'earpods',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1590658165737-15a047c1e03d?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658165737-15a047c1e03d?w=600&q=80',
      'https://images.unsplash.com/photo-1590658165737-15a047c1e03d?w=600&q=80'
    ],
    description: 'Premium earbuds with intelligent ANC.',
    specs: {
      Type: 'In-Ear TWS',
      'Noise Cancellation': 'Active',
      Battery: '5 hours',
      'Water Resistance': 'IPX7',
      Bluetooth: '5.0'
    },
    inStock: true,
    featured: false,
    sale: false
  },
]

// Helper functions
export const getAllProducts = () => PRODUCTS_DATABASE

export const getProductById = (id) => {
  return PRODUCTS_DATABASE.find(p => p.id === parseInt(id))
}

export const getProductsByCategory = (category) => {
  return PRODUCTS_DATABASE.filter(p => p.category === category)
}

export const getProductsBySubcategory = (subcategory) => {
  return PRODUCTS_DATABASE.filter(p => p.subcategory === subcategory)
}

export const getFeaturedProducts = () => {
  return PRODUCTS_DATABASE.filter(p => p.featured)
}

export const getProductsOnSale = () => {
  return PRODUCTS_DATABASE.filter(p => p.sale)
}