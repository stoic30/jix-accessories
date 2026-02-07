'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function RelatedProducts({ currentProduct }) {
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    fetchRelatedProducts()
  }, [currentProduct.id])

  const fetchRelatedProducts = async () => {
  try {
    const q = query(
      collection(db, 'products'),
      where('subcategory', '==', currentProduct.subcategory),
      limit(6)
    )
    
    const snapshot = await getDocs(q)
    const products = snapshot.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          // Convert Firebase Timestamp to ISO string
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        }
      })
      .filter(p => p.id !== currentProduct.id)
      .slice(0, 4)
    
    setRelatedProducts(products)
  } catch (error) {
    console.error('Error fetching related products:', error)
  }
}

  if (relatedProducts.length === 0) return null

  return (
    <div className="px-4 py-6 bg-gray-50">
      <h2 className="text-lg font-bold text-gray-900 mb-4">You May Also Like</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {relatedProducts.map(product => {
          const formattedPrice = product.price >= 1000000 
            ? `₦${(product.price / 1000000).toFixed(1)}M`
            : `₦${product.price.toLocaleString()}`

          return (
            <a 
              key={product.id} 
              href={`/product/${product.id}`}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition"
            >
              <div className="bg-gray-50 p-3 flex items-center justify-center h-32">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="p-3">
                <h3 className="text-xs text-gray-800 mb-1 line-clamp-2 leading-tight font-medium">
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-gray-900">{formattedPrice}</p>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}