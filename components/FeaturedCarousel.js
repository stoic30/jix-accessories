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
    <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ height: '280px' }}>
      {products.map((product, index) => (
        
          <a key={product.id}
          href={`/product/${product.id}`}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          {/* USE CUSTOM DESIGNED IMAGE */}
          <img 
            src={product.featuredImage || product.image} 
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl"
          />
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