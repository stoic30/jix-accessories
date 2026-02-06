'use client'

import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { getCartCount } = useCart()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
      <div className="max-w-[430px] mx-auto px-4 py-3">
        
        {/* Single Row: Logo | Search | Cart */}
        <div className="flex items-center gap-3">
          
          {/* Logo - Wider */}
          <a href="/" className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Jix Logo" 
              className="h-9 w-auto"
              style={{ minWidth: '45px' }}
              onError={(e) => {
                // Fallback if logo doesn't exist
                e.target.style.display = 'none'
                e.target.nextElementSibling.style.display = 'flex'
              }}
            />
            {/* Fallback text logo */}
            <div className="hidden items-center" style={{ minWidth: '80px' }}>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-2 shadow-sm">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 tracking-tight">Jix</span>
            </div>
          </a>

          {/* Search Bar - Now in middle */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              style={{ fontSize: '14px' }}
            />
          </form>

          {/* Cart */}
          <a href="/cart" className="relative text-gray-700 hover:text-blue-600 transition flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {getCartCount() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-sm">
                {getCartCount()}
              </span>
            )}
          </a>

        </div>

      </div>
    </nav>
  )
}