import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase.js'

const sampleProducts = [
  {
    name: 'iPhone 15 Pro Max 256GB',
    price: 1200000,
    oldPrice: 1350000,
    category: 'phones',
    subcategory: 'iphone',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1696446702055-b0e1e15c9dd3?w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1696446702055-b0e1e15c9dd3?w=400&q=80',
      'https://images.unsplash.com/photo-1696446702052-f86886ae7b0a?w=400&q=80'
    ],
    description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',
    specs: {
      'Storage': '256GB',
      'RAM': '8GB',
      'Display': '6.7" Super Retina XDR',
      'Camera': '48MP Main',
      'Battery': '4422mAh',
      'Processor': 'A17 Pro'
    },
    stock: 15,
    featured: true,
    sale: true,
    inStock: true,
    warranty: '1 Year Apple Warranty',
    delivery: 'Free delivery within UI',
    createdAt: new Date()
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 450000,
    oldPrice: 520000,
    category: 'phones',
    subcategory: 'samsung',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80'],
    description: 'Flagship Samsung with 200MP camera and S Pen.',
    specs: {
      'Storage': '256GB',
      'RAM': '12GB',
      'Display': '6.8" Dynamic AMOLED',
      'Camera': '200MP Main',
      'Battery': '5000mAh'
    },
    stock: 20,
    featured: true,
    sale: false,
    inStock: true,
    warranty: '1 Year Samsung Warranty',
    delivery: 'Free delivery within UI',
    createdAt: new Date()
  },
  {
    name: 'MacBook Pro M3 14"',
    price: 850000,
    oldPrice: 950000,
    category: 'laptops',
    subcategory: 'macbook',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80'],
    description: 'Supercharged by M3 chip with up to 22 hours battery life.',
    specs: {
      'Storage': '512GB SSD',
      'RAM': '16GB',
      'Display': '14.2" Liquid Retina XDR',
      'Processor': 'Apple M3 Pro',
      'Battery': 'Up to 22 hours'
    },
    stock: 8,
    featured: true,
    sale: false,
    inStock: true,
    warranty: '1 Year Apple Warranty',
    delivery: 'Free delivery within UI',
    createdAt: new Date()
  },
  {
    name: 'AirPods Pro 2nd Gen',
    price: 120000,
    category: 'accessories',
    subcategory: 'earpods',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80'],
    description: 'Active Noise Cancellation with Adaptive Audio.',
    specs: {
      'Battery': 'Up to 6 hours',
      'Charging': 'MagSafe + USB-C',
      'Features': 'ANC, Transparency Mode'
    },
    stock: 30,
    featured: true,
    sale: true,
    inStock: true,
    warranty: '1 Year Apple Warranty',
    delivery: 'Free delivery within UI',
    createdAt: new Date()
  },
  {
    name: 'Dell XPS 15 i7',
    price: 650000,
    category: 'laptops',
    subcategory: 'dell',
    brand: 'Dell',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80',
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80'],
    description: 'Powerful Dell laptop for productivity and creativity.',
    specs: {
      'Processor': 'Intel Core i7-12th Gen',
      'RAM': '16GB DDR4',
      'Storage': '512GB SSD',
      'Display': '15.6" Full HD'
    },
    stock: 12,
    featured: false,
    sale: false,
    inStock: true,
    warranty: '1 Year Dell Warranty',
    delivery: 'Free delivery within UI',
    createdAt: new Date()
  }
]

async function seedProducts() {
  console.log('🌱 Seeding products...')
  
  try {
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, 'products'), product)
      console.log(`✅ Added: ${product.name} (ID: ${docRef.id})`)
    }
    console.log('🎉 All products added successfully!')
  } catch (error) {
    console.error('❌ Error adding products:', error)
  }
}

seedProducts()