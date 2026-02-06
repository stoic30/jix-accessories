'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ProductCard from '@/components/ProductCard'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  // Mock search results (later from Firebase)
  const allProducts = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 1200000, image: 'https://images.unsplash.com/photo-1696446702055-b0e1e15c9dd3?w=400&q=80', category: 'phones' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 450000, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80', category: 'phones' },
    { id: 3, name: 'MacBook Pro M3 14"', price: 850000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', category: 'laptops' },
    { id: 5, name: 'Dell XPS 15', price: 650000, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80', category: 'laptops' },
    { id: 4, name: 'AirPods Pro 2nd Gen', price: 120000, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80', category: 'accessories' },
    { id: 6, name: 'Oraimo 20000mAh Power Bank', price: 15000, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80', category: 'accessories' },
  ]

  const results = allProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Search Results
          </h1>
          <p className="text-sm text-gray-600">
            {results.length} results for "{query}"
          </p>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-sm text-gray-600 mb-6">Try searching with different keywords</p>
            <a href="/" className="text-blue-600 font-medium">Back to Home</a>
          </div>
        )}

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