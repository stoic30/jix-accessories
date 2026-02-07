export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <a href="/more" className="mr-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl font-bold text-gray-900">About Jix</h1>
        </div>

        <div className="bg-white rounded-xl p-6 space-y-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">J</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Jix Accessories</h2>
            <p className="text-sm text-gray-600">Your Trusted Tech Partner in UI</p>
          </div>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              Jix Accessories is your one-stop marketplace for premium gadgets and tech accessories at the University of Ibadan.
            </p>
            
            <p>
              We specialize in providing authentic, high-quality phones, laptops, and accessories to students at competitive prices with free delivery across campus.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 my-4">
              <h3 className="font-bold text-gray-900 mb-2">Why Choose Jix?</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ 100% Authentic Products</li>
                <li>✓ Free Campus Delivery</li>
                <li>✓ Competitive Prices</li>
                <li>✓ 1 Year Warranty</li>
                <li>✓ 24/7 Customer Support</li>
              </ul>
            </div>

            <p>
              Have questions? <a href="https://wa.me/2349032535251" className="text-blue-600 font-medium">Chat with us on WhatsApp</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}