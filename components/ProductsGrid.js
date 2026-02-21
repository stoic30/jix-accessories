'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

export default function ProductsGrid({ products }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map(product => {
        const isNew = product.createdAt && 
          (new Date() - new Date(product.createdAt)) < 7 * 24 * 60 * 60 * 1000

        return (
          <div key={product.id} className="relative">
            {isNew && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-md z-10">
                NEW
              </span>
            )}
            <ProductCard product={product} />
          </div>
        )
      })}
    </div>
  )
}