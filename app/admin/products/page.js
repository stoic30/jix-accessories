'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function AdminProducts() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchProducts()
      } else {
        window.location.href = '/admin'
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'))
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return

    try {
      await deleteDoc(doc(db, 'products', productId))
      setProducts(products.filter(p => p.id !== productId))
      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const startEdit = (product) => {
    setEditingProduct(product.id)
    setEditForm({
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice || '',
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      image: product.image,
      description: product.description,
      stock: product.stock,
      featured: product.featured,
      sale: product.sale
    })
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditForm(null)
  }

  const saveEdit = async (productId) => {
    try {
      const updates = {
        name: editForm.name,
        price: parseInt(editForm.price),
        oldPrice: editForm.oldPrice ? parseInt(editForm.oldPrice) : null,
        category: editForm.category,
        subcategory: editForm.subcategory,
        brand: editForm.brand,
        image: editForm.image,
        images: [editForm.image], // Update images array too
        description: editForm.description,
        stock: parseInt(editForm.stock),
        featured: editForm.featured,
        sale: editForm.sale,
        inStock: parseInt(editForm.stock) > 0,
        updatedAt: new Date()
      }

      await updateDoc(doc(db, 'products', productId), updates)
      
      // Update local state
      setProducts(products.map(p => 
        p.id === productId ? { ...p, ...updates } : p
      ))
      
      setEditingProduct(null)
      setEditForm(null)
      alert('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <a href="/admin/dashboard" className="mr-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              <h1 className="text-xl font-bold text-gray-900">Products Management</h1>
            </div>
            <div className="flex gap-2">
              
                <a href="/admin/products/upload"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition text-sm"
>
                📤 Bulk Upload
              </a>
              
                <a href="/admin/products/add"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
              >
                + Add Product
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">{products.length} products total</p>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => (
                  editingProduct === product.id ? (
                    // EDIT MODE
                    <tr key={product.id} className="bg-blue-50">
                      <td className="px-6 py-4" colSpan={6}>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            placeholder="Product Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                          
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                              placeholder="Price"
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="number"
                              value={editForm.oldPrice}
                              onChange={(e) => setEditForm({...editForm, oldPrice: e.target.value})}
                              placeholder="Old Price (optional)"
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="number"
                              value={editForm.stock}
                              onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                              placeholder="Stock"
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <select
                              value={editForm.category}
                              onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                            >
                              <option value="phones">Phones</option>
                              <option value="laptops">Laptops</option>
                              <option value="accessories">Accessories</option>
                            </select>
                            <input
                              type="text"
                              value={editForm.subcategory}
                              onChange={(e) => setEditForm({...editForm, subcategory: e.target.value})}
                              placeholder="Subcategory"
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="text"
                              value={editForm.brand}
                              onChange={(e) => setEditForm({...editForm, brand: e.target.value})}
                              placeholder="Brand"
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>

                          <input
                            type="url"
                            value={editForm.image}
                            onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                            placeholder="Image URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />

                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            placeholder="Description"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />

                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editForm.featured}
                                onChange={(e) => setEditForm({...editForm, featured: e.target.checked})}
                                className="mr-2"
                              />
                              <span className="text-sm">Featured</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editForm.sale}
                                onChange={(e) => setEditForm({...editForm, sale: e.target.checked})}
                                className="mr-2"
                              />
                              <span className="text-sm">On Sale</span>
                            </label>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(product.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // VIEW MODE
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category}/{product.subcategory}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₦{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.stock || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
