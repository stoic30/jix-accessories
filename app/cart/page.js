'use client'

import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[430px] mx-auto">
          {/* Header */}
          <div className="bg-white px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <a href="/" className="mr-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              <h1 className="text-lg font-bold text-gray-900">Shopping Cart</h1>
            </div>
          </div>

          {/* Empty Cart */}
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Add some products to get started
            </p>
            <a 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="max-w-[430px] mx-auto">
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="mr-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              <h1 className="text-lg font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <span className="text-sm text-gray-600">
              {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white mt-2">
          {cart.map((item) => (
            <div key={item.id} className="px-4 py-4 border-b border-gray-100">
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <img 
                    src={item.image || '/api/placeholder/80/80'} 
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-base font-bold text-gray-900 mb-2">
                    ₦{item.price.toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 text-sm font-medium border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm font-medium hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Item Subtotal */}
              <div className="mt-2 text-right">
                <span className="text-xs text-gray-600">Subtotal: </span>
                <span className="text-sm font-bold text-gray-900">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white mt-2 px-4 py-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">₦{getCartTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-blue-600">₦{getCartTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-blue-50 mx-4 mt-4 p-3 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
            </svg>
            <div>
              <p className="text-xs font-medium text-gray-900">Free Delivery within UI</p>
              <p className="text-xs text-gray-600 mt-0.5">Estimated delivery: 2-3 business days</p>
            </div>
          </div>
        </div>

        {/* Sticky Checkout Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg" style={{ zIndex: 100 }}>
          <div className="max-w-[430px] mx-auto">
            <a 
              href="/checkout"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Proceed to Checkout - ₦{getCartTotal().toLocaleString()}
            </a>
            <a 
              href="/"
              className="block w-full text-center text-blue-600 text-sm mt-2 py-2"
            >
              Continue Shopping
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}