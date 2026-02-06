'use client'

import { useState, useEffect } from 'react'

export default function FeaturedCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [products.length])

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ height: '320px' }}>
      {products.map((product, index) => (
        
        <a
          key={product.id}
          href={`/product/${product.id}`}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
          style={{
            background: `linear-gradient(135deg, ${product.bgColor || '#3B82F6'} 0%, ${product.bgColor2 || '#8B5CF6'} 100%)`
          }}
        >
          <div className="p-6 h-full flex flex-col justify-between text-white relative overflow-hidden">
            
            {/* Content */}
            <div className="relative z-10">
              {product.badge && (
                <span className="inline-block bg-white bg-opacity-25 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full mb-3 font-semibold shadow-sm">
                  {product.badge}
                </span>
              )}
              <h3 className="text-xl font-bold mb-2 drop-shadow-md">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold drop-shadow-md">₦{product.price.toLocaleString()}</p>
                {product.oldPrice && (
                  <p className="text-sm opacity-75 line-through">₦{product.oldPrice.toLocaleString()}</p>
                )}
              </div>
              {product.oldPrice && (
                <p className="text-sm mt-1 font-medium">
                  Save ₦{(product.oldPrice - product.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Large Product Image */}
            <div className="absolute bottom-0 right-0 w-56 h-56 flex items-center justify-center opacity-90">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' }}
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          </div>
        </a>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all ${
              index === currentIndex 
                ? 'bg-white w-8 h-2' 
                : 'bg-white bg-opacity-50 w-2 h-2'
            } rounded-full`}
          />
        ))}
      </div>
    </div>
  )
}