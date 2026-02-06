'use client'

import ProductCard from '@/components/ProductCard'
import { useState } from 'react'

export default function PopularProductsPage() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  // All popular products (later from Firebase)
  const allProducts = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 1200000, image: 'https://images.unsplash.com/photo-1696446702055-b0e1e15c9dd3?w=400&q=80', sale: true, category: 'phones' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 450000, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80', sale: false, category: 'phones' },
    { id: 4, name: 'AirPods Pro 2nd Gen', price: 120000, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80', sale: true, category: 'accessories' },
    { id: 3, name: 'MacBook Pro M3 14"', price: 850000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', sale: false, category: 'laptops' },
    { id: 7, name: 'iPad Air M2', price: 550000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', sale: false, category: 'phones' },
    { id: 8, name: 'Sony WH-1000XM5', price: 180000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80', sale: false, category: 'accessories' },
    { id: 5, name: 'Dell XPS 15 i7', price: 650000, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80', sale: false, category: 'laptops' },
    { id: 11, name: 'Apple Watch Series 9', price: 320000, image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80', sale: false, category: 'accessories' },
  ]

  // Filter products
  const filteredProducts = filter === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === filter)

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0 // Keep original order for 'popular'
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-[430px] mx-auto">
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="mr-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              <h1 className="text-lg font-bold text-gray-900">Popular Products</h1>
            </div>
            <span className="text-sm text-gray-600">
              {sortedProducts.length} items
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-700">FILTER BY</span>
            <button 
              onClick={() => { setFilter('all'); setSortBy('popular') }}
              className="text-xs text-blue-600 font-medium"
            >
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('phones')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                filter === 'phones' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📱 Phones
            </button>
            <button
              onClick={() => setFilter('laptops')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                filter === 'laptops' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💻 Laptops
            </button>
            <button
              onClick={() => setFilter('accessories')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                filter === 'accessories' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎧 Accessories
            </button>
          </div>

          {/* Sort */}
          <div className="mt-3">
            <span className="text-xs font-semibold text-gray-700 block mb-2">SORT BY</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 py-4">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No products found</p>
              <button 
                onClick={() => setFilter('all')}
                className="text-blue-600 text-sm mt-2 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}