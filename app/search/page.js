'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductCard from '@/components/ProductCard'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: 'all',
    brand: 'all',
    sortBy: 'relevant'
  })

  useEffect(() => {
    searchProducts()
  }, [query])

  const searchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'))
      const allProducts = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        }
      })

      // Search by name, brand, category, description
      const results = allProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      )

      setProducts(results)
      setLoading(false)
    } catch (error) {
      console.error('Error searching:', error)
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filters.maxPrice))
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    // Brand filter
    if (filters.brand !== 'all') {
      filtered = filtered.filter(p => p.brand === filters.brand)
    }

    // Sort
  // Sort
if (filters.sortBy === 'price-low') {
  filtered.sort((a, b) => a.price - b.price)
} else if (filters.sortBy === 'price-high') {
  filtered.sort((a, b) => b.price - a.price)
} else if (filters.sortBy === 'name') {
  filtered.sort((a, b) => a.name.localeCompare(b.name))
} else if (filters.sortBy === 'newest') {
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
} else if (filters.sortBy === 'oldest') {
  filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}

    return filtered
  }

  const filteredProducts = applyFilters()
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[430px] mx-auto">
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center mb-3">
            <a href="/" className="mr-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <h1 className="text-lg font-bold text-gray-900">Search Results</h1>
          </div>
          
          {/* Search Info */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">
              {loading ? 'Searching...' : `${filteredProducts.length} results for "${query}"`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-900">
              <span>🔍 Filters & Sort</span>
              <svg className="w-4 h-4 transition group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            
            <div className="mt-4 space-y-3">
              {/* Price Range */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                <option value="phones">Phones</option>
                <option value="laptops">Laptops</option>
                <option value="accessories">Accessories</option>
              </select>

              

              {/* Brand */}
              <select
                value={filters.brand}
                onChange={(e) => setFilters({...filters, brand: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="relevant">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="newest">Newest First</option>  {/* ← ADD THIS */}
                <option value="oldest">Oldest First</option>   {/* ← ADD THIS */}
              </select>

              
            </div>
          </details>
        </div>

        {/* Results */}
        <div className="px-4 py-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500 text-sm mb-2">No products found</p>
              <a href="/" className="text-blue-600 text-sm font-medium">← Back to Home</a>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}


