import ProductPageClient from '@/components/ProductPageClient'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

async function getProduct(id) {
  try {
    const docRef = doc(db, 'products', id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const product = await getProduct(id)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Product not found</h2>
          <a href="/" className="text-blue-600">Go to Home</a>
        </div>
      </div>
    )
  }

  return <ProductPageClient product={product} />
}