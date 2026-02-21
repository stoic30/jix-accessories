'use client'

import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { collection, addDoc, doc, runTransaction } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    hall: '',
    notes: '',
    paymentMethod: 'delivery'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-600 mb-4">Add some products first</p>
          <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Go Shopping
          </a>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e, isPaid = false, paymentRef = null) => {
  e.preventDefault()
  setIsSubmitting(true)

  // Validate form
  if (!formData.name || !formData.phone || !formData.address || !formData.hall) {
    alert('Please fill in all required fields')
    setIsSubmitting(false)
    return
  }

  // If Paystack payment selected and not already paid
  if (formData.paymentMethod === 'paystack' && !isPaid) {
    if (!formData.email) {
      alert('Email is required for online payment')
      setIsSubmitting(false)
      return
    }
    
    // Initialize Paystack payment (if you have it set up)
    // initializePayment(onPaystackSuccess, onPaystackClose)
    // For now, just process as pending
  }

  try {
    // Use Firebase Transaction - CORRECT ORDER: ALL READS FIRST, THEN ALL WRITES
    await runTransaction(db, async (transaction) => {
      
      // ========================================
      // PHASE 1: READ ALL PRODUCTS FIRST
      // ========================================
      const productRefs = []
      const productSnapshots = []
      
      for (const item of cart) {
        const productRef = doc(db, 'products', item.id)
        productRefs.push(productRef)
        const productSnap = await transaction.get(productRef)
        productSnapshots.push({ ref: productRef, snap: productSnap, item })
      }
      
      // ========================================
      // PHASE 2: VALIDATE ALL STOCK LEVELS
      // ========================================
      for (const { snap, item } of productSnapshots) {
        if (!snap.exists()) {
          throw new Error(`Product "${item.name}" not found`)
        }
        
        const productData = snap.data()
        const currentStock = productData.stock || 0
        
        if (currentStock < item.quantity) {
          throw new Error(`Sorry! Only ${currentStock} units of "${item.name}" left in stock. You have ${item.quantity} in cart. Please reduce quantity or remove from cart.`)
        }
      }
      
      // ========================================
      // PHASE 3: NOW DO ALL WRITES
      // ========================================
      
      // 3a. Update stock for all products
      for (const { ref, snap, item } of productSnapshots) {
        const currentStock = snap.data().stock
        const newStock = currentStock - item.quantity
        
        transaction.update(ref, {
          stock: newStock,
          inStock: newStock > 0,
          updatedAt: new Date()
        })
      }
      
      // 3b. Create order
      const orderId = paymentRef || `JIX-${Date.now()}`
      const order = {
        orderId: orderId,
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          hall: formData.hall,
          notes: formData.notes
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: getCartTotal(),
        paymentMethod: formData.paymentMethod,
        paymentStatus: isPaid ? 'Paid' : 'Pending',
        paymentReference: paymentRef || null,
        orderStatus: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const orderRef = doc(collection(db, 'orders'))
      transaction.set(orderRef, order)
    })
    
    // ========================================
    // SUCCESS - Clear cart and redirect
    // ========================================
    clearCart()
    window.location.href = `/order-success?orderId=${paymentRef || `JIX-${Date.now()}`}`
    
  } catch (error) {
    console.error('Error placing order:', error)
    
    // Show specific error message
    if (error.message.includes('Only') || error.message.includes('stock') || error.message.includes('not found')) {
      alert(error.message)
    } else if (error.message.includes('reads')) {
      alert('Transaction error. Please try again.')
    } else {
      alert('Error placing order. Please try again.')
    }
    
    setIsSubmitting(false)
  }
}

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-[430px] mx-auto">
        
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center">
            <a href="/cart" className="mr-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Delivery Information */}
          <div className="bg-white mt-2 px-4 py-4">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Delivery Information</h2>
            
            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08012345678"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Hall/Location */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Hall/Location in UI <span className="text-red-500">*</span>
                </label>
                <select
                  name="hall"
                  value={formData.hall}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your hall</option>
                  <option value="Obafemi Awolowo Hall">Obafemi Awolowo Hall</option>
                  <option value="Kuti Hall">Kuti Hall</option>
                  <option value="Tedder Hall">Tedder Hall</option>
                  <option value="Queen Elizabeth Hall">Queen Elizabeth Hall</option>
                  <option value="Mellanby Hall">Mellanby Hall</option>
                  <option value="Independence Hall">Independence Hall</option>
                  <option value="Off Campus (Bodija)">Off Campus (Bodija)</option>
                  <option value="Off Campus (Ajibode)">Off Campus (Ajibode)</option>
                  <option value="Off Campus (Other)">Off Campus (Other)</option>
                </select>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Detailed Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Room number, block, landmarks..."
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white mt-2 px-4 py-4">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Payment Method</h2>
            
            <div className="space-y-3">
              {/* Pay on Delivery */}
              <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="delivery"
                  checked={formData.paymentMethod === 'delivery'}
                  onChange={handleChange}
                  className="mt-0.5 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">Pay on Delivery</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Recommended</span>
                  </div>
                  <p className="text-xs text-gray-600">Pay with cash when your order arrives</p>
                </div>
              </label>

              {/* Paystack */}
              <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paystack"
                  checked={formData.paymentMethod === 'paystack'}
                  onChange={handleChange}
                  className="mt-0.5 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">Pay with Card/Bank Transfer</span>
                  </div>
                  <p className="text-xs text-gray-600">Secure payment via Paystack</p>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white mt-2 px-4 py-4">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-2 mb-3 pb-3 border-b border-gray-200">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2">
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

          {/* Submit Button */}
          <div className="px-4 mt-4 mb-24">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium transition ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              By placing this order, you agree to our terms and conditions
            </p>
          </div>

        </form>

      </div>
    </div>
  )
}