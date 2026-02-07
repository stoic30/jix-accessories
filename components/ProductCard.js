'use client'

import { useCart } from '@/context/CartContext'

export default function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    alert('Added to cart!')
  }

  // Format price - FULL for product cards, SHORT for popular products
  const formattedPrice = compact 
    ? (product.price >= 1000000 
        ? `₦${(product.price / 1000000).toFixed(1)}M`
        : `₦${(product.price / 1000).toFixed(0)}k`)
    : `₦${product.price.toLocaleString()}`

  const formattedOldPrice = product.oldPrice 
    ? `₦${product.oldPrice.toLocaleString()}`
    : null

  return (
    <a href={`/product/${product.id}`} className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col h-full block hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      
      {/* Product Image */}
      <div className="relative bg-gray-50 flex items-center justify-center" style={{ height: '200px', padding: '16px' }}>
        
        {/* BADGES */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.sale && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">
              SALE
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">
              OUT OF STOCK
            </span>
          )}
          {product.inStock && product.stock < 5 && (
            <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">
              LOW STOCK
            </span>
          )}
        </div>

        <img 
          src={product.image} 
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 leading-tight flex-grow font-medium">
          {product.name}
        </h3>
        
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">{formattedPrice}</p>
          {formattedOldPrice && (
            <p className="text-xs text-gray-400 line-through">
              {formattedOldPrice}
            </p>
          )}
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full text-white text-sm py-2.5 rounded-lg font-semibold transition mt-auto ${
            product.inStock 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </a>
  )
}