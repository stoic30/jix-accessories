'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'N/A'

  const whatsappNumber = '2349153048279' // 
  const whatsappMessage = `Hi, I just placed order ${orderId}`
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg p-8 text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        
        <p className="text-sm text-gray-600 mb-6">
          Thank you for your order. We will contact you shortly to confirm delivery details.
        </p>

        {/* Order ID */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-600 mb-1">Order ID</p>
          <p className="text-lg font-bold text-gray-900">{orderId}</p>
        </div>

        {/* WhatsApp Button */}
        
            <a href={whatsappLink}
  target="_blank"
  rel="noopener noreferrer"
  className="block w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition mb-3"
>
  Contact us on WhatsApp
</a>

{/* Continue Shopping */}

  <a href="/"
  className="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
>
  Continue Shopping
</a>

        {/* Delivery Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs font-medium text-gray-900 mb-1">
            What happens next?
          </p>
          <p className="text-xs text-gray-600">
            We will call you within 1 hour to confirm your order and delivery time. 
            Delivery typically takes 2-3 business days within UI.
          </p>
        </div>

      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}