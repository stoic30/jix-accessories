'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function BulkUpload() {
  const [user, setUser] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = '/admin'
      } else {
        setUser(currentUser)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setResults(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      let successCount = 0
      let errorCount = 0
      const errors = []

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.trim())
          const productData = {}
          
          headers.forEach((header, index) => {
            productData[header] = values[index]
          })

          // Convert to proper format
const product = {
  name: productData.name,
  price: parseInt(productData.price),
  oldPrice: productData.oldPrice ? parseInt(productData.oldPrice) : null,
  category: productData.category,
  subcategory: productData.subcategory,
  brand: productData.brand,
  image: productData.image, // Main image
  images: [ // ALL images for swipe
    productData.image,
    productData.image2,
    productData.image3,
    productData.image4
  ].filter(Boolean), // Remove empty values
  description: productData.description || '',
  specs: {},
  stock: parseInt(productData.stock || 10),
featured: productData.featured?.toLowerCase() === 'true' || productData.featured === '1' || productData.featured === true,  
sale: productData.sale?.toLowerCase() === 'true' || productData.sale === '1' || productData.sale === true,
  inStock: true,
  warranty: '1 Year Warranty',
  delivery: 'Free delivery within UI',
  createdAt: new Date()
}

          await addDoc(collection(db, 'products'), product)
          successCount++
        } catch (error) {
          errorCount++
          errors.push(`Row ${i + 1}: ${error.message}`)
        }
      }

      setResults({
        total: lines.length - 1,
        success: successCount,
        errors: errorCount,
        errorMessages: errors
      })
      
    } catch (error) {
      alert('Error reading file: ' + error.message)
    }
    
    setUploading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <a href="/admin/products" className="mr-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <h1 className="text-xl font-bold text-gray-900">Bulk Upload Products (CSV)</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3">📋 How to Upload Products via CSV</h2>
          
          <div className="space-y-3 text-sm text-blue-800">
            <p><strong>Step 1:</strong> Download the template CSV file below</p>
            <p><strong>Step 2:</strong> Fill in your product details in Excel/Google Sheets</p>
            <p><strong>Step 3:</strong> Save as CSV and upload here</p>
          </div>

          <div className="mt-4">
        <button
  onClick={() => {
    const csv = `name,price,oldPrice,category,subcategory,brand,image,image2,image3,image4,description,stock,featured,sale
iPhone 15 Pro Max 256GB,1200000,1350000,phones,iphone,Apple,https://i.imgur.com/abc123.jpg,https://i.imgur.com/def456.jpg,https://i.imgur.com/ghi789.jpg,https://i.imgur.com/jkl012.jpg,Ultimate iPhone with titanium design and A17 Pro chip,15,true,true
Samsung Galaxy S24 Ultra,950000,1050000,phones,samsung,Samsung,https://i.imgur.com/xyz789.jpg,https://i.imgur.com/uvw456.jpg,,,Flagship Samsung phone with S Pen and 200MP camera,20,true,false
Dell XPS 15 i7,650000,750000,laptops,dell,Dell,https://i.imgur.com/laptop1.jpg,,,,Professional laptop with 15.6 inch 4K display,12,false,true
MacBook Pro M3,1800000,,laptops,macbook,Apple,https://i.imgur.com/macbook.jpg,,,,Powerful MacBook with M3 chip and Liquid Retina XDR display,8,true,false
Anker PowerCore 20000mAh,35000,45000,accessories,powerbank,Anker,https://i.imgur.com/powerbank.jpg,,,,High-capacity portable charger with fast charging,50,false,true`
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jix-products-template.csv'
    a.click()
  }}
  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
>
  📥 Download Template CSV
</button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Your CSV File</h3>
            <p className="text-sm text-gray-600 mb-6">
              CSV file with product details (max 300 products per upload)
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="csv-upload"
            />
            
            <label
              htmlFor="csv-upload"
              className={`inline-block px-8 py-3 rounded-lg font-semibold text-white transition cursor-pointer ${
                uploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Choose CSV File'}
            </label>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Results</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{results.total}</p>
                <p className="text-xs text-gray-600">Total Rows</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{results.success}</p>
                <p className="text-xs text-gray-600">Successful</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{results.errors}</p>
                <p className="text-xs text-gray-600">Errors</p>
              </div>
            </div>

            {results.errorMessages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-red-600 mb-2">Error Details:</p>
                <div className="bg-red-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {results.errorMessages.map((error, i) => (
                    <p key={i} className="text-xs text-red-800 mb-1">{error}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href="/admin/products"
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                ← Back to Products
              </a>
            </div>
          </div>
        )}

        {/* CSV Format Guide */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">CSV Format Guide</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Column</th>
                  <th className="px-3 py-2 text-left font-semibold">Required</th>
                  <th className="px-3 py-2 text-left font-semibold">Example</th>
                  <th className="px-3 py-2 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2">name</td>
                  <td className="px-3 py-2">✅ Yes</td>
                  <td className="px-3 py-2">iPhone 15 Pro Max</td>
                  <td className="px-3 py-2">Product name</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">price</td>
                  <td className="px-3 py-2">✅ Yes</td>
                  <td className="px-3 py-2">1200000</td>
                  <td className="px-3 py-2">Numbers only (no commas)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">oldPrice</td>
                  <td className="px-3 py-2">❌ No</td>
                  <td className="px-3 py-2">1350000</td>
                  <td className="px-3 py-2">Leave empty if no old price</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">category</td>
                  <td className="px-3 py-2">✅ Yes</td>
                  <td className="px-3 py-2">phones</td>
                  <td className="px-3 py-2">phones, laptops, or accessories</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">subcategory</td>
                  <td className="px-3 py-2">✅ Yes</td>
                  <td className="px-3 py-2">iphone</td>
                  <td className="px-3 py-2">samsung, iphone, hp, dell, etc.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">brand</td>
                  <td className="px-3 py-2">✅ Yes</td>
                  <td className="px-3 py-2">Apple</td>
                  <td className="px-3 py-2">Brand name</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">image</td>
                  <td className="px-3 py-2">✅ Yes</td>
                  <td className="px-3 py-2">https://...</td>
                  <td className="px-3 py-2">Full image URL</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">description</td>
                  <td className="px-3 py-2">❌ No</td>
                  <td className="px-3 py-2">Best iPhone ever</td>
                  <td className="px-3 py-2">Short description</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">stock</td>
                  <td className="px-3 py-2">❌ No</td>
                  <td className="px-3 py-2">15</td>
                  <td className="px-3 py-2">Number in stock (default: 10)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">featured</td>
                  <td className="px-3 py-2">❌ No</td>
                  <td className="px-3 py-2">true</td>
                  <td className="px-3 py-2">true or false</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">sale</td>
                  <td className="px-3 py-2">❌ No</td>
                  <td className="px-3 py-2">true</td>
                  <td className="px-3 py-2">true or false</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}