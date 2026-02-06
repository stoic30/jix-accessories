'use client'

import ProductCard from '@/components/ProductCard'

export default function FeaturedProductsPage() {
  // Featured products (later from Firebase)
  const products = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 1200000, oldPrice: 1350000, image: 'https://images.unsplash.com/photo-1696446702055-b0e1e15c9dd3?w=400&q=80', sale: true },
    { id: 3, name: 'MacBook Pro M3 14"', price: 850000, oldPrice: 950000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', sale: false },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 450000, oldPrice: 520000, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80', sale: false },
    { id: 4, name: 'AirPods Pro 2nd Gen', price: 120000, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80', sale: true },
    { id: 7, name: 'iPad Air M2', price: 550000, oldPrice: 620000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', sale: false },
    { id: 11, name: 'Apple Watch Series 9', price: 320000, image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80', sale: false },
  ]

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
              <h1 className="text-lg font-bold text-gray-900">Featured Gadgets</h1>
            </div>
            <span className="text-sm text-gray-600">
              {products.length} items
            </span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3">
          <p className="text-sm font-medium">⚡ Hot Deals & New Arrivals</p>
          <p className="text-xs opacity-90 mt-0.5">Limited time offers on premium gadgets</p>
        </div>

        {/* Products Grid */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}