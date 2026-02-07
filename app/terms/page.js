export default function TermsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
        </div>

        <div className="bg-white rounded-xl p-6 space-y-4 text-sm text-gray-700">
          <section>
            <h2 className="font-bold text-gray-900 mb-2">1. General</h2>
            <p>By accessing and using Jix Accessories, you agree to be bound by these Terms and Conditions.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">2. Products</h2>
            <p>All products sold are 100% authentic. We reserve the right to refuse any order at our discretion.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">3. Pricing</h2>
            <p>Prices are subject to change without notice. The price at the time of order confirmation is final.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">4. Payment</h2>
            <p>We accept Pay on Delivery and online payment via Paystack. Payment must be made in full before delivery.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">5. Delivery</h2>
            <p>Free delivery within UI campus. Delivery time is 2-3 business days from order confirmation.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">6. Returns & Refunds</h2>
            <p>Products can be returned within 7 days if defective. Refunds will be processed within 14 days.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">7. Warranty</h2>
            <p>All products come with 1 year manufacturer warranty unless otherwise stated.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 mb-2">8. Contact</h2>
            <p>For any questions, contact us via WhatsApp at +234 801 234 5678</p>
          </section>
        </div>
      </div>
    </div>
  )
}