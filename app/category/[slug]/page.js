import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import SubcategoryCard from '@/components/SubcategoryCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Default fallback images (if subcategory not in Firebase)
const DEFAULT_SUBCATEGORY_IMAGES = {
  samsung: 'https://images.unsplash.com/photo-1707438095940-1eee18e85400?w=400&q=80',
  iphone: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&q=80',
  tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
  HP: 'https://images.unsplash.com/photo-1729370775808-aab21a6b7039?w=400&q=80',
  Microsoft: 'https://images.unsplash.com/photo-1727132527904-528bb0afb370?w=400&q=80',
  dell: 'https://i.imgur.com/sc8RT4h.jpeg?w=400&q=80',
  MSI: 'https://i.imgur.com/3BjYQ7e.jpeg?w=400&q=80',
  Lenovo: 'https://images.unsplash.com/photo-1684384891902-12fe45aa3596?w=400&q=80',
  asus: 'https://images.unsplash.com/photo-1636211991297-6071abc2cec1?w=400&q=80',
  macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  Powerbank: 'https://i.imgur.com/ehodEpd.jpeg?w=400&q=80',
  Headsets: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
  Earpods: 'https://images.unsplash.com/photo-1614651462377-4f3fe3e2c262?w=400&q=80',
  Storage: 'https://images.unsplash.com/photo-1632251350035-7f750a5973b6?w=400&q=80',
  Chargers: 'https://i.imgur.com/Q7oYfOZ.jpeg?w=400&q=80',
  Earphone: 'https://i.imgur.com/sweWSQ6.jpeg?w=400&q=80',
  Fan: 'https://i.imgur.com/4SfFARY.jpeg?w=400&q=80',
  Socket: 'https://i.imgur.com/hwJAzXa.jpeg?w=400&q=80',
  Speakers: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  smartwatch: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80',
  lighting: 'https://images.unsplash.com/photo-1621177555630-b861919c864f?w=400&q=80',
  
  // UK USED IMAGES
  'uk-iphone': 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&q=80',
  'uk-samsung': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
  'uk-laptop': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
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
    // HARDCODED subcategories for UK Used (will show even without products)
    if (category === 'ukused') {
      const q = query(collection(db, 'products'), where('category', '==', 'ukused'))
      const snapshot = await getDocs(q)
      const counts = { 'uk-iphone': 0, 'uk-samsung': 0, 'uk-laptop': 0 }

      snapshot.docs.forEach(doc => {
        const data = doc.data()
        if (counts[data.subcategory] !== undefined) {
          counts[data.subcategory]++
        }
      })

      return [
        { slug: 'uk-iphone', name: '🇬🇧 UK iPhones', count: counts['uk-iphone'] },
        { slug: 'uk-samsung', name: '🇬🇧 UK Samsung', count: counts['uk-samsung'] },
        { slug: 'uk-laptop', name: '🇬🇧 UK Laptops', count: counts['uk-laptop'] },
      ]
    }

    // For other categories, get from products (existing logic)
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
        
        <div className="flex items-center mb-6">
          <a href="/categories" className="mr-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
        </div>
        
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