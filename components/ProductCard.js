'use client'

import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    // Optional: Show a toast notification instead of alert
    alert('Added to cart!')
  }

  return (
    <a href={`/product/${product.id}`} className="bg-white rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full block">
      
      {/* Product Image */}
      <div className="relative bg-gray-50 p-3 flex items-center justify-center h-32">
        {product.sale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-medium">
            Sale
          </span>
        )}
        <img 
          src={product.image || '/api/placeholder/120/120'} 
          alt={product.name}
          className="h-full w-auto object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="p-2.5 flex flex-col flex-grow">
        <h3 className="text-xs text-gray-700 mb-1.5 line-clamp-2 leading-tight flex-grow">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-gray-900 mb-2">
          ₦{product.price.toLocaleString()}
        </p>
        <button 
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white text-xs py-2 rounded font-medium hover:bg-blue-700 transition mt-auto"
        >
          Add to Cart
        </button>
      </div>
    </a>
  )
}