'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function AdminSubcategories() {
  const [user, setUser] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    slug: '',
    category: 'accessories',
    image: ''
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchSubcategories()
      } else {
        window.location.href = '/admin'
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchSubcategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'subcategories'))
      const subcategoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSubcategories(subcategoriesData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      setLoading(false)
    }
  }

  const handleAddSubcategory = async (e) => {
  e.preventDefault()
  
  // Force lowercase for category and slug
  const subcategoryData = {
    name: newSubcategory.name,
    slug: newSubcategory.slug.toLowerCase().trim(),
    category: newSubcategory.category.toLowerCase().trim(),
    image: newSubcategory.image.trim(),
    createdAt: new Date()
  }
  
  console.log('📝 Adding subcategory:', subcategoryData)
  
  try {
    await addDoc(collection(db, 'subcategories'), subcategoryData)
      alert('Subcategory added!')
      setNewSubcategory({ name: '', slug: '', category: 'accessories', image: '' })
      fetchSubcategories()
    } catch (error) {
      console.error('Error adding subcategory:', error)
      alert('Error adding subcategory')
    }
  }

  const handleDelete = async (subcategoryId, subcategoryName) => {
    if (!confirm(`Delete "${subcategoryName}"?`)) return
    try {
      await deleteDoc(doc(db, 'subcategories', subcategoryId))
      setSubcategories(subcategories.filter(s => s.id !== subcategoryId))
      alert('Subcategory deleted!')
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      alert('Error deleting subcategory')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <a href="/admin/dashboard" className="mr-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <h1 className="text-xl font-bold text-gray-900">Manage Subcategories</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Add New Subcategory */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Subcategory</h2>
          <form onSubmit={handleAddSubcategory} className="space-y-4">
            <select
              value={newSubcategory.category}
              onChange={(e) => setNewSubcategory({...newSubcategory, category: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="phones">Phones</option>
              <option value="laptops">Laptops</option>
              <option value="accessories">Accessories</option>
            </select>
            
            <input
              type="text"
              placeholder="Subcategory Name (e.g., Electric Fan)"
              value={newSubcategory.name}
              onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            
            <input
              type="text"
              placeholder="Slug (e.g., fan)"
              value={newSubcategory.slug}
              onChange={(e) => setNewSubcategory({...newSubcategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            
            <input
              type="url"
              placeholder="Image URL (from Unsplash/Imgur)"
              value={newSubcategory.image}
              onChange={(e) => setNewSubcategory({...newSubcategory, image: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            
            <p className="text-xs text-gray-500">
              💡 Get images from: <a href="https://unsplash.com" target="_blank" className="text-blue-600 hover:underline">Unsplash.com</a> - Search for product type
            </p>
            
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
              Add Subcategory
            </button>
          </form>
        </div>

        {/* Existing Subcategories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Existing Subcategories ({subcategories.length})</h2>
          </div>
          
          {/* Group by category */}
          {['phones', 'laptops', 'accessories'].map(category => {
            const categorySubcats = subcategories.filter(s => s.category === category)
            if (categorySubcats.length === 0) return null
            
            return (
              <div key={category} className="border-b border-gray-200 last:border-b-0">
                <div className="bg-gray-50 px-4 py-2">
                  <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {categorySubcats.map(subcat => (
                    <div key={subcat.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center">
                        <img 
                          src={subcat.image} 
                          alt={subcat.name}
                          className="w-16 h-16 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{subcat.name}</p>
                          <p className="text-xs text-gray-500">{subcat.slug}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(subcat.id, subcat.name)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}