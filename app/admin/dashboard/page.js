'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchStats()
        fetchRecentOrders()
      } else {
        window.location.href = '/admin'
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

const fetchStats = async () => {
  try {
    const productsSnap = await getDocs(collection(db, 'products'))
    const ordersSnap = await getDocs(collection(db, 'orders'))
    
    // GET PRODUCTS DATA
    const productsData = productsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // GET ORDERS DATA
    const ordersData = ordersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Count pending orders
    const pendingCount = ordersData.filter(o => o.orderStatus === 'Pending').length
    
    // Calculate total revenue
    const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    
    // Count low stock products (NOW products exists!)
    const lowStockProducts = productsData.filter(p => p.stock < 5 && p.stock > 0)
    
    setStats({
      totalProducts: productsSnap.size,
      totalOrders: ordersSnap.size,
      pendingOrders: pendingCount,
      revenue: totalRevenue,
      lowStockCount: lowStockProducts.length
    })
    
    setLoading(false)
  } catch (error) {
    console.error('Error fetching stats:', error)
    setLoading(false)
  }
}

  const fetchRecentOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5))
      const snapshot = await getDocs(q)
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setRecentOrders(orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/admin'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
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
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3">
                <img src="/logo.png" alt="Jix" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Jix Admin</h1>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₦{stats.revenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
              <p className="text-3xl font-bold text-orange-600">{stats.lowStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        </div>

         {/* Navigation Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  
    <a href="/admin/products"
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group"
  >
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Products</h3>
      <p className="text-sm text-gray-600">Add, edit, or delete products</p>
    </div>
  </a>

    <a href="/admin/subcategories"
  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group"
>
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-100 transition mb-4">
      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1">Subcategories</h3>
    <p className="text-sm text-gray-600">Manage product subcategories</p>
  </div>
</a>

  
    <a href="/admin/orders"
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group"
  >
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">View Orders</h3>
      <p className="text-sm text-gray-600">Manage customer orders</p>
    </div>
  </a>

  
    <a href="/"
    target="_blank"
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group"
  >
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 transition mb-4">
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">View Store</h3>
      <p className="text-sm text-gray-600">See customer view</p>
    </div>
  </a>
</div>        </div>


        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">₦{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.orderStatus === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}