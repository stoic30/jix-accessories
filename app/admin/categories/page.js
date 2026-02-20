'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function AdminCategories() {
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    icon: '',
    image: ''
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchCategories()
      } else {
        window.location.href = '/admin'
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'))
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setCategories(categoriesData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'categories'), {
        ...newCategory,
        createdAt: new Date()
      })
      alert('Category added!')
      setNewCategory({ name: '', slug: '', icon: '', image: '' })
      fetchCategories()
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Error adding category')
    }
  }

  const handleDelete = async (categoryId, categoryName) => {
    if (!confirm(`Delete "${categoryName}"?`)) return
    try {
      await deleteDoc(doc(db, 'categories', categoryId))
      setCategories(categories.filter(c => c.id !== categoryId))
      alert('Category deleted!')
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category')
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
            <h1 className="text-xl font-bold text-gray-900">Manage Categories</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Add New Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <input
              type="text"
              placeholder="Category Name (e.g., Smart Watches)"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Slug (e.g., smartwatches)"
              value={newCategory.slug}
              onChange={(e) => setNewCategory({...newCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Icon Emoji (e.g., ⌚)"
              value={newCategory.icon}
              onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={newCategory.image}
              onChange={(e) => setNewCategory({...newCategory, image: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
              Add Category
            </button>
          </form>
        </div>

        {/* Existing Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Existing Categories ({categories.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{cat.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500">{cat.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}