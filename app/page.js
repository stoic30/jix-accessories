import ProductCard from '@/components/ProductCard'
import ProductsGrid from '@/components/ProductsGrid'
import FeaturedCarousel from '@/components/FeaturedCarousel'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Deterministic shuffle - same order all day (no hydration error)
function shuffleArray(array) {
  const shuffled = [...array]
  
  // Seed based on current date (changes daily, consistent for the day)
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  
  // Seeded random function
  function seededRandom(s) {
    const x = Math.sin(s++) * 10000
    return x - Math.floor(x)
  }
  
  // Fisher-Yates shuffle with seed
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

async function getProducts() {
  try {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
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

async function getFeaturedProducts() {
  try {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, where('featured', '==', true))
    const snapshot = await getDocs(q)
    
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
    console.error('Error fetching featured products:', error)
    return []
  }
}

async function getPopularProducts() {
  try {
    console.log('🔍 Fetching popular products...')
    
    const ordersSnap = await getDocs(collection(db, 'orders'))
    console.log('📊 Total orders in database:', ordersSnap.size)
    
    if (ordersSnap.empty) {
      console.log('⚠️ No orders found')
      return []
    }
    
    const orders = ordersSnap.docs.map(doc => {
      const data = doc.data()
      console.log('📦 Order:', doc.id, '→ Items:', data.items?.length || 0)
      return data
    })
    
    const productOrderCount = {}
    let totalItemsCounted = 0
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          totalItemsCounted++
          const prodId = item.productId
          if (productOrderCount[prodId]) {
            productOrderCount[prodId] += item.quantity
          } else {
            productOrderCount[prodId] = item.quantity
          }
        })
      }
    })
    
    console.log('📈 Total items counted:', totalItemsCounted)
    console.log('🔢 Product order counts:', productOrderCount)
    
    if (Object.keys(productOrderCount).length === 0) {
      console.log('⚠️ No product IDs found in orders')
      return []
    }
    
    const productsSnap = await getDocs(collection(db, 'products'))
    const products = productsSnap.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        orderCount: productOrderCount[doc.id] || 0,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      }
    })
    
    const popular = products
      .filter(p => p.orderCount > 0)
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 10)
    
    console.log('🔥 Popular products found:', popular.length)
    if (popular.length > 0) {
      console.log('Top products:', popular.slice(0, 3).map(p => ({
        name: p.name,
        orderCount: p.orderCount
      })))
    }
    
    return popular
  } catch (error) {
    console.error('❌ Error fetching popular products:', error)
    return []
  }
}

async function getCategoryCounts(products) {
  return {
    phones: products.filter(p => p.category === 'phones').length,
    laptops: products.filter(p => p.category === 'laptops').length,
    accessories: products.filter(p => p.category === 'accessories').length
  }
}

async function getCategories() {
  try {
    const snapshot = await getDocs(collection(db, 'categories'))
    if (snapshot.empty) {
      return [
        { id: '1', name: 'Phones', slug: 'phones', icon: '📱' },
        { id: '2', name: 'Laptops', slug: 'laptops', icon: '💻' },
        { id: '3', name: 'Accessories', slug: 'accessories', icon: '🎧' }
      ]
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return [
      { id: '1', name: 'Phones', slug: 'phones', icon: '📱' },
      { id: '2', name: 'Laptops', slug: 'laptops', icon: '💻' },
      { id: '3', name: 'Accessories', slug: 'accessories', icon: '🎧' }
    ]
  }
}

export default async function Home() {
  const allProducts = await getProducts()
  const shuffledProducts = shuffleArray(allProducts)
  const featuredProducts = await getFeaturedProducts()
  const popularProducts = await getPopularProducts()
  const categories = await getCategories()
  const counts = await getCategoryCounts(allProducts)

  const featuredForCarousel = featuredProducts.slice(0, 4).map((p, index) => {
    const colors = [
      { bg1: '#0071E3', bg2: '#5E5CE6', badge: '🔥 Hot Deal' },
      { bg1: '#1D1D1F', bg2: '#424245', badge: '✨ New Arrival' },
      { bg1: '#5E5CE6', bg2: '#0071E3', badge: '⭐ Best Seller' },
      { bg1: '#30D158', bg2: '#0071E3', badge: '📈 Trending' }
    ]
    const colorSet = colors[index % colors.length]
    
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      image: p.featuredImage || p.image,
      badge: colorSet.badge,
      bgColor: colorSet.bg1,
      bgColor2: colorSet.bg2
    }
  })

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-[430px] mx-auto">
        
       {/* Hot Deals Banner - ANIMATED */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-sm font-semibold">⚡ Hot Deals & New Arrivals - Limited time offers on premium gadgets ⚡ Hot Deals & New Arrivals - Limited time offers on premium gadgets</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white px-6 py-2 grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-xs text-gray-700 font-medium">100% Authentic</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
              </svg>
            </div>
            <p className="text-xs text-gray-700 font-medium">Free Delivery</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-xs text-gray-700 font-medium">24/7 Support</p>
          </div>
        </div>

        <div className="bg-white px-6 py-6 mt-2">
          <div className="flex justify-between max-w-xs mx-auto">
            <a href="/category/phones" className="flex-shrink-0 text-center">
              <div className="w-25 h-25 rounded-2xl mb-2 overflow-hidden shadow-md transform hover:scale-105 transition">
                <img src="https://images.unsplash.com/photo-1726587912121-ea21fcc57ff8?w=300&q=80" alt="Phones" className="w-full h-full object-cover"/>
              </div>
              <p className="text-sm font-semibold text-gray-800">Phones</p>
            </a>
            <a href="/category/laptops" className="flex-shrink-0 text-center">
              <div className="w-25 h-25 rounded-2xl mb-2 overflow-hidden shadow-md transform hover:scale-105 transition">
                <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&q=80" alt="Laptops" className="w-full h-full object-cover"/>
              </div>
              <p className="text-sm font-semibold text-gray-800">Laptops</p>
            </a>
            <a href="/category/accessories" className="flex-shrink-0 text-center">
              <div className="w-25 h-25 rounded-2xl mb-2 overflow-hidden shadow-md transform hover:scale-105 transition">
                <img src="https://images.unsplash.com/photo-1700087151960-178ea946e608?w=300&q=80" alt="Accessories" className="w-full h-full object-cover"/>
              </div>
              <p className="text-sm font-semibold text-gray-800">Accessories</p>
            </a>
          </div>
        </div>

        <div className="px-4 py-5 mt-2 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Popular Products 🔥</h2>
            <a href="/products" className="text-blue-600 text-sm font-medium">View All →</a>
          </div>
          
          {popularProducts.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
              {popularProducts.map(product => {
                const formattedPrice = product.price >= 1000000 
                  ? `₦${(product.price / 1000000).toFixed(1)}M`
                  : `₦${(product.price / 1000).toFixed(0)}k`
                
                return (
                  <a key={product.id} href={`/product/${product.id}`} className="flex-shrink-0 text-center">
                    <div className="w-28 h-28 bg-gray-50 rounded-full mb-2 flex items-center justify-center overflow-hidden shadow-sm border-2 border-gray-100 p-2 relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain"/>
                      
                    </div>
                    <p className="text-xs text-gray-700 font-medium w-28 line-clamp-2 leading-tight px-1">{product.name}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{formattedPrice}</p>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-2">No orders yet</p>
              <p className="text-xs text-gray-400">Popular products will appear once customers start buying!</p>
            </div>
          )}
        </div>

        {featuredForCarousel.length > 0 && (
          <div className="px-4 py-5 mt-2 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Featured Gadgets</h2>
            </div>
            <FeaturedCarousel products={featuredForCarousel} />
          </div>
        )}

        <div className="mx-4 mt-2">
          <a href="https://wa.me/2349032535251?text=Hi, I need help choosing a phone" target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold mb-1">Need Help Choosing?</p>
                <p className="text-sm opacity-90">Chat with our Phone Expert</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
            </div>
          </a>
        </div>

        <div className="px-4 py-5 mt-2 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Products ({shuffledProducts.length})</h2>
            <a href="/products" className="text-blue-600 text-sm font-medium">View All →</a>
          </div>
          <ProductsGrid products={shuffledProducts} />
        </div>

      </div>
    </div>
  )
}