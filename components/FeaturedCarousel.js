'use client'

import { useState, useEffect } from 'react'

export default function FeaturedCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [products.length])

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ height: '250px' }}>
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
          <div className="p-6 h-full flex items-center justify-between relative overflow-hidden">
            
            {/* Left: Product Info */}
            <div className="relative z-10 flex-1">
              <h3 className="text-2xl font-bold mb-2 drop-shadow-md text-white">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-4xl font-bold drop-shadow-md text-white">
                  ₦{product.price >= 1000000 
                    ? `${(product.price / 1000000).toFixed(1)}M`
                    : `${(product.price / 1000).toFixed(0)}k`
                  }
                </p>
                {product.oldPrice && (
                  <p className="text-sm opacity-75 line-through text-white">
                    ₦{product.oldPrice >= 1000000 
                      ? `${(product.oldPrice / 1000000).toFixed(1)}M`
                      : `${(product.oldPrice / 1000).toFixed(0)}k`
                    }
                  </p>
                )}
              </div>
              {product.oldPrice && (
                <p className="text-sm font-medium text-white">
                  Save ₦{((product.oldPrice - product.price) / 1000).toFixed(0)}k
                </p>
              )}
            </div>

            {/* Right: Large Product Image */}
            <div className="relative z-10 w-48 h-48 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-300"
              />
              
              {/* Badge - Top Right Corner */}
              {product.badge && (
                <span className="absolute -top-2 -left-42 bg-white text-gray-900 text-[10px] px-2 py-1 rounded-full font-bold shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
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
