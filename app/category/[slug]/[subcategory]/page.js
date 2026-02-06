import ProductCard from '@/components/ProductCard'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

async function getProductsBySubcategory(subcategory) {
  try {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, where('subcategory', '==', subcategory))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function SubcategoryPage({ params }) {
  const resolvedParams = await params
  const { slug, subcategory } = resolvedParams
  
  const products = await getProductsBySubcategory(subcategory)
  const displayName = subcategory.charAt(0).toUpperCase() + subcategory.slice(1)

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="max-w-[430px] mx-auto">
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href={`/category/${slug}`} className="mr-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              <h1 className="text-lg font-semibold text-gray-900">{displayName}</h1>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <p className="text-sm text-gray-600">{products.length} products found</p>
        </div>

        {/* Products Grid */}
        <div className="px-4 py-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">No products found</p>
              <a href={`/category/${slug}`} className="text-blue-600 text-sm mt-4 inline-block font-medium">← Go Back</a>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}