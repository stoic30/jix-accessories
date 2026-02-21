import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import SubcategoryCard from '@/components/SubcategoryCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Default fallback images (if subcategory not in Firebase)
const DEFAULT_SUBCATEGORY_IMAGES = {
  samsung: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
  iphone: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
  tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
  hp: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  dell: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80',
  macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  powerbank: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
  headset: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
  earpods: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80',
  chargers: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&q=80',
  speakers: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  smartwatch: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80',
}

async function getSubcategoryImages(category) {
  try {
    console.log('🔍 Fetching subcategory images for category:', category)
    
    const q = query(collection(db, 'subcategories'), where('category', '==', category))
    const snapshot = await getDocs(q)
    
    console.log('📊 Found', snapshot.size, 'subcategory documents')
    
    const images = {}
    snapshot.docs.forEach(doc => {
      const data = doc.data()
      console.log('📄 Document:', doc.id, '→', data)
      images[data.slug] = data.image
    })
    
    console.log('🖼️ Final images object:', images)
    
    return images
  } catch (error) {
    console.error('❌ Error fetching subcategory images:', error)
    return {}
  }
}

async function getSubcategories(category) {
  try {
    const q = query(collection(db, 'products'), where('category', '==', category))
    const snapshot = await getDocs(q)
    const products = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      }
    })
    
    // Get unique subcategories
    const subcategoriesMap = {}
    products.forEach(p => {
      if (!subcategoriesMap[p.subcategory]) {
        subcategoriesMap[p.subcategory] = {
          slug: p.subcategory,
          name: p.subcategory.charAt(0).toUpperCase() + p.subcategory.slice(1),
          count: 0
        }
      }
      subcategoriesMap[p.subcategory].count++
    })
    
    return Object.values(subcategoriesMap)
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  
  const subcategories = await getSubcategories(slug)
  const subcategoryImages = await getSubcategoryImages(slug)
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <a href="/categories" className="mr-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
        </div>
        
        {/* Subcategories */}
        <div className="grid grid-cols-2 gap-3">
          {subcategories.map(sub => {
            // Priority: Firebase → Defaults → Placeholder
            const imageUrl = subcategoryImages[sub.slug] || 
                           DEFAULT_SUBCATEGORY_IMAGES[sub.slug] || 
                           `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${sub.name}`
            
            return (
              <SubcategoryCard 
                key={sub.slug}
                sub={sub}
                slug={slug}
                imageUrl={imageUrl}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}