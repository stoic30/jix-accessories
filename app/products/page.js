import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getAllProducts() {
  try {
    const snapshot = await getDocs(collection(db, 'products'))
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,

      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function AllProductsPage() {
  const products = await getAllProducts()
  
  // Sort by newest first
  products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <a href="/" className="mr-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        </div>

        {/* Products Count */}
        <p className="text-sm text-gray-600 mb-4">{products.length} products available</p>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {products.map(product => {
            // Check if product is new (within last 7 days)
            const isNew = product.createdAt && 
              (new Date() - new Date(product.createdAt)) < 7 * 24 * 60 * 60 * 1000

            return (
              <div key={product.id} className="relative">
                {isNew && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-md z-10">
                    NEW
                  </span>
                )}
                <ProductCard product={product} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}