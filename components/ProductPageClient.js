'use client'

import { useCart } from '@/context/CartContext'
import { useState, useRef, useEffect } from 'react'
import RelatedProducts from './RelatedProducts'

export default function ProductPageClient({ product }) {
  const { addToCart } = useCart()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleAddToCart = () => {
    addToCart(product)
    alert('Added to cart!')
  }

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(0) // Reset
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  // Format price
  const formattedPrice = product.price >= 1000000 
    ? `₦${(product.price / 1000000).toFixed(1)}M`
    : `₦${product.price.toLocaleString()}`

  const formattedOldPrice = product.oldPrice 
    ? (product.oldPrice >= 1000000 
        ? `₦${(product.oldPrice / 1000000).toFixed(1)}M`
        : `₦${product.oldPrice.toLocaleString()}`)
    : null

  return (
    <div className="bg-gray-50 min-h-screen pb-28">
      <div className="max-w-[430px] mx-auto bg-white">
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <a href="/" className="p-1">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            
            <div className="flex items-center space-x-4">
              <button className="p-1">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              <a href="/cart" className="p-1 relative">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Product Images - SWIPEABLE */}
        <div 
          className="bg-gray-50 p-6 relative select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative">
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.name}
              className="w-full h-96 object-contain"
              draggable="false"
            />
            {product.oldPrice && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md">
                Save {((product.oldPrice - product.price) >= 1000000) 
                  ? `₦${((product.oldPrice - product.price) / 1000000).toFixed(1)}M`
                  : `₦${((product.oldPrice - product.price) / 1000).toFixed(0)}k`
                }
              </span>
            )}

            {/* Navigation Arrows - Desktop */}
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-2 shadow-md hover:bg-opacity-100 transition hidden md:block"
                >
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-2 shadow-md hover:bg-opacity-100 transition hidden md:block"
                >
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          
          {/* Image indicators */}
          {product.images.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all ${
                    index === currentImageIndex 
                      ? 'bg-blue-600 w-8 h-2' 
                      : 'bg-gray-300 w-2 h-2'
                  } rounded-full`}
                />
              ))}
            </div>
          )}
          
          {/* Swipe hint */}
          {product.images.length > 1 && (
            <p className="text-center text-xs text-gray-500 mt-2">← Swipe to see more images →</p>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 py-4">
          {/* Product Name */}
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">
              {formattedPrice}
            </span>
            {formattedOldPrice && (
              <span className="text-base text-gray-400 line-through">
                {formattedOldPrice}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">In Stock</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600">4.8 (156 reviews)</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900 mb-2">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900 mb-3">Specifications</h2>
              <div className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2.5 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{key}</span>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Warranty */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex items-start mb-3">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-900">{product.delivery}</p>
                <p className="text-xs text-gray-600 mt-0.5">Delivery within 2-3 business days</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-900">{product.warranty}</p>
                <p className="text-xs text-gray-600 mt-0.5">Genuine products only</p>
              </div>
            </div>
          </div>

        </div>

{/* Related Products Section - ADD BEFORE STICKY BUTTON */}
<RelatedProducts currentProduct={product} />

        {/* Sticky Add to Cart Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg" style={{ zIndex: 100 }}>
          <div className="max-w-[430px] mx-auto">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition text-base shadow-md"
            >
              Add to Cart - {formattedPrice}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
