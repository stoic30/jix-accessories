'use client'

export default function SubcategoryCard({ sub, slug, imageUrl }) {
  return (
    <a 
      href={`/category/${slug}/${sub.slug}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <div className="relative h-32 bg-gray-50">
        <img 
          src={imageUrl}
          alt={sub.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`Failed to load image for ${sub.name}:`, imageUrl)
            e.target.src = `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${sub.name}`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-bold text-sm">{sub.name}</h3>
          <p className="text-xs opacity-90">{sub.count} products</p>
        </div>
      </div>
    </a>
  )
}