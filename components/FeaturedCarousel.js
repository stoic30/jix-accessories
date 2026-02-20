'use client'

import { useState, useEffect } from 'react'

export default function FeaturedCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return // Don't auto-slide when paused
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [products.length, isPaused])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <div 
      className="relative overflow-hidden rounded-2xl shadow-lg" 
      style={{ height: '280px' }}
      onMouseEnter={() => setIsPaused(true)} // Pause on hover
      onMouseLeave={() => setIsPaused(false)} // Resume on leave
    >
      {products.map((product, index) => (
        
          <a key={product.id}
          href={`/product/${product.id}`}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          <img 
            src={product.featuredImage || product.image} 
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        </a>
      ))}

      {/* Previous Button */}
      <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition z-20"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition z-20"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

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