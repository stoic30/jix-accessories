import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ProductPageClient from '@/components/ProductPageClient'


export async function generateMetadata({ params }) {
  try {
    const productRef = doc(db, 'products', params.id)
    const productSnap = await getDoc(productRef)
    
    if (!productSnap.exists()) {
      return {
        title: 'Product Not Found',
      }
    }
    
    const product = productSnap.data()
    
    return {
      title: `${product.name} - ₦${product.price.toLocaleString()} | Jix Accessories`,
      description: product.description || `Buy ${product.name} for ₦${product.price.toLocaleString()}. ${product.inStock ? 'In stock' : 'Out of stock'}. Fast delivery to your location.`,
      openGraph: {
        title: product.name,
        description: product.description || `₦${product.price.toLocaleString()} - ${product.inStock ? 'In stock' : 'Out of stock'}`,
        images: [
          {
            url: product.image,
            width: 1200,
            height: 630,
            alt: product.name,
          }
        ],
        type: 'product',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: `₦${product.price.toLocaleString()} - ${product.inStock ? 'In stock' : 'Out of stock'}`,
        images: [product.image],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product',
    }
  }
}


async function getProduct(id) {
  try {
    const docRef = doc(db, 'products', id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null, 

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