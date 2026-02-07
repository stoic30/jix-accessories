import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

async function getCategoryCounts() {
  try {
    const snapshot = await getDocs(collection(db, 'products'))
    const products = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      }
    })
    
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
    { 
      name: 'Phones', 
      slug: 'phones', 
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80', // iPhone 15 Pro
      color: 'from-blue-500 to-blue-600', 
      count: counts.phones 
    },
    { 
      name: 'Laptops', 
      slug: 'laptops', 
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', // MacBook Pro
      color: 'from-purple-500 to-purple-600', 
      count: counts.laptops 
    },
    { 
      name: 'Accessories', 
      slug: 'accessories', 
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&q=80', // AirPods Pro
      color: 'from-pink-500 to-pink-600', 
      count: counts.accessories 
    },
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
              className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-32">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90`}></div>
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                    <p className="text-sm text-white opacity-90">{cat.count} products</p>
                  </div>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}