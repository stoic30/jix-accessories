'use client'

import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    alert('Added to cart!')
  }

  // Format price consistently everywhere
  const formattedPrice = product.price >= 1000000 
    ? `₦${(product.price / 1000000).toFixed(1)}M`
    : `₦${product.price.toLocaleString()}`

  return (
    <a href={`/product/${product.id}`} className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col h-full block hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      
      {/* Product Image - SAME IMAGE EVERYWHERE */}
      <div className="relative bg-gray-50 p-4 flex items-center justify-center" style={{ height: '180px' }}>
        {product.sale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">
            SALE
          </span>
        )}
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-auto object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 leading-tight flex-grow font-medium">
          {product.name}
        </h3>
        
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">{formattedPrice}</p>
          {product.oldPrice && (
            <p className="text-xs text-gray-400 line-through">
              ₦{product.oldPrice >= 1000000 
                ? `${(product.oldPrice / 1000000).toFixed(1)}M`
                : product.oldPrice.toLocaleString()
              }
            </p>
          )}
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white text-sm py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition mt-auto"
        >
          Add to Cart
        </button>
      </div>
    </a>
  )
}
