'use client'

import ProductCard from '@/components/ProductCard'
import { useState } from 'react'

export default function AllProductsPage() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')

  // All products (later from Firebase)
  const allProducts = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 1200000, image: 'https://images.unsplash.com/photo-1696446702055-b0e1e15c9dd3?w=400&q=80', sale: true, category: 'phones' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 450000, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80', sale: false, category: 'phones' },
    { id: 3, name: 'MacBook Pro M3 14"', price: 850000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', sale: false, category: 'laptops' },
    { id: 4, name: 'AirPods Pro 2nd Gen', price: 120000, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80', sale: true, category: 'accessories' },
    { id: 5, name: 'Dell XPS 15 i7', price: 650000, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80', sale: false, category: 'laptops' },
    { id: 6, name: 'Oraimo 27000mAh Power Bank', price: 18000, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80', sale: true, category: 'accessories' },
    { id: 7, name: 'iPad Air M2', price: 550000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', sale: false, category: 'phones' },
    { id: 8, name: 'Sony WH-1000XM5', price: 180000, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80', sale: false, category: 'accessories' },
    { id: 9, name: 'HP Pavilion 15', price: 380000, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', sale: true, category: 'laptops' },
    { id: 10, name: 'Samsung Galaxy Buds Pro', price: 85000, image: 'https://images.unsplash.com/photo-1590658165737-15a047c1e03d?w=400&q=80', sale: false, category: 'accessories' },
    { id: 11, name: 'Apple Watch Series 9', price: 320000, image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80', sale: false, category: 'accessories' },
    { id: 12, name: 'Anker USB-C Hub', price: 25000, image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&q=80', sale: true, category: 'accessories' },
  ]

  // Filter by category
  let filteredProducts = filter === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === filter)

  // Filter by price range
  if (priceRange !== 'all') {
    if (priceRange === 'under-100k') {
      filteredProducts = filteredProducts.filter(p => p.price < 100000)
    } else if (priceRange === '100k-500k') {
      filteredProducts = filteredProducts.filter(p => p.price >= 100000 && p.price < 500000)
    } else if (priceRange === '500k-plus') {
      filteredProducts = filteredProducts.filter(p => p.price >= 500000)
    }
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0 // Keep original order for 'newest'
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
              <h1 className="text-lg font-bold text-gray-900">All Products</h1>
            </div>
            <span className="text-sm text-gray-600">
              {sortedProducts.length} items
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-700">FILTERS</span>
            <button 
              onClick={() => { setFilter('all'); setSortBy('newest'); setPriceRange('all') }}
              className="text-xs text-blue-600 font-medium"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-600 block mb-2">Category</span>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('phones')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  filter === 'phones' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📱 Phones
              </button>
              <button
                onClick={() => setFilter('laptops')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  filter === 'laptops' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💻 Laptops
              </button>
              <button
                onClick={() => setFilter('accessories')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  filter === 'accessories' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎧 Accessories
              </button>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-600 block mb-2">Price Range</span>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button
                onClick={() => setPriceRange('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  priceRange === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Prices
              </button>
              <button
                onClick={() => setPriceRange('under-100k')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  priceRange === 'under-100k' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Under ₦100k
              </button>
              <button
                onClick={() => setPriceRange('100k-500k')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  priceRange === '100k-500k' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ₦100k - ₦500k
              </button>
              <button
                onClick={() => setPriceRange('500k-plus')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  priceRange === '500k-plus' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ₦500k+
              </button>
            </div>
          </div>

          {/* Sort */}
          <div>
            <span className="text-xs font-medium text-gray-600 block mb-2">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
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
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-500 text-sm mb-2">No products found</p>
              <button 
                onClick={() => { setFilter('all'); setPriceRange('all') }}
                className="text-blue-600 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}