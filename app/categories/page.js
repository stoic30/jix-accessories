import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

async function getCategoryCounts() {
  try {
    const snapshot = await getDocs(collection(db, 'products'))
    const products = snapshot.docs.map(doc => doc.data())
    
    return {
      phones: products.filter(p => p.category === 'phones').length,
      laptops: products.filter(p => p.category === 'laptops').length,
      accessories: products.filter(p => p.category === 'accessories').length
    }
  } catch (error) {
    console.error('Error getting counts:', error)
    return { phones: 0, laptops: 0, accessories: 0 }
  }
}

export default async function CategoriesPage() {
  const counts = await getCategoryCounts()

  const categories = [
    { name: 'Phones', slug: 'phones', icon: '📱', color: 'from-blue-500 to-blue-600', count: counts.phones },
    { name: 'Laptops', slug: 'laptops', icon: '💻', color: 'from-purple-500 to-purple-600', count: counts.laptops },
    { name: 'Accessories', slug: 'accessories', icon: '🎧', color: 'from-pink-500 to-pink-600', count: counts.accessories },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>
        
        <div className="space-y-3">
          {categories.map(cat => (
            <a 
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mr-4 shadow-sm`}>
                    <span className="text-3xl">{cat.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{cat.count} products</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
