import ProductCard from '@/components/ProductCard'

// Category data (later from Firebase)
const categoryData = {
  phones: {
    name: 'Phones',
    subcategories: [
      { name: 'Samsung', slug: 'samsung', icon: '📱' },
      { name: 'iPhone', slug: 'iphone', icon: '📱' },
      { name: 'Tablets', slug: 'tablets', icon: '📱' }
    ]
  },
  laptops: {
    name: 'Laptops',
    subcategories: [
      { name: 'HP', slug: 'hp', icon: '💻' },
      { name: 'Dell', slug: 'dell', icon: '💻' },
      { name: 'Apple MacBook', slug: 'macbook', icon: '💻' }
    ]
  },
  accessories: {
    name: 'Accessories',
    subcategories: [
      { name: 'Power Bank', slug: 'powerbank', icon: '🔋' },
      { name: 'Headset', slug: 'headset', icon: '🎧' },
      { name: 'Chargers', slug: 'chargers', icon: '🔌' },
      { name: 'EarPods', slug: 'earpods', icon: '🎧' },
      { name: 'Speakers', slug: 'speakers', icon: '🔊' },
      { name: 'Memory Card', slug: 'memorycard', icon: '💾' },
      { name: 'Flash Drive', slug: 'flashdrive', icon: '💾' },
      { name: 'Smart Watch', slug: 'smartwatch', icon: '⌚' },
      { name: 'Socket', slug: 'socket', icon: '🔌' },
      { name: 'Lamp', slug: 'lamp', icon: '💡' },
      { name: 'Cords', slug: 'cords', icon: '🔌' }
    ]
  }
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const category = categoryData[slug]

  // If category doesn't exist, show error
  if (!category) {
    return (
      <div className="max-w-[430px] mx-auto px-4 py-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">Category not found</h1>
        <p className="text-sm text-gray-500 mt-2">Looking for: {slug}</p>
        <a href="/" className="text-blue-600 text-sm mt-4 inline-block">← Back to Home</a>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-[430px] mx-auto">
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <a href="/" className="mr-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <h1 className="text-lg font-bold text-gray-900">{category.name}</h1>
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            {category.subcategories.map((sub) => (
              <a 
                key={sub.slug} 
                href={`/category/${slug}/${sub.slug}`}
                className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:border-blue-300 transition"
              >
                <div className="text-3xl mb-2">{sub.icon}</div>
                <p className="text-xs font-medium text-gray-800">{sub.name}</p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}