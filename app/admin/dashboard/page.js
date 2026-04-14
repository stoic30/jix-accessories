'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    realRevenue: 0,
    pendingRevenue: 0,
    totalProducts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch orders
      const ordersSnapshot = await getDocs(collection(db, 'orders'))
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'))

      // Calculate real revenue (only confirmed/delivered + paid)
      const realRevenue = orders
        .filter(order => 
          (order.orderStatus === 'Confirmed' || order.orderStatus === 'Delivered') &&
          order.paymentStatus === 'Paid'
        )
        .reduce((sum, order) => sum + order.totalAmount, 0)

      // Calculate pending revenue (confirmed but not yet paid)
      const pendingRevenue = orders
        .filter(order => 
          (order.orderStatus === 'Confirmed' || order.orderStatus === 'Delivered') &&
          order.paymentStatus === 'Pending'
        )
        .reduce((sum, order) => sum + order.totalAmount, 0)

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.orderStatus === 'Pending').length,
        confirmedOrders: orders.filter(o => o.orderStatus === 'Confirmed').length,
        deliveredOrders: orders.filter(o => o.orderStatus === 'Delivered').length,
        realRevenue,
        pendingRevenue,
        totalProducts: productsSnapshot.size
      })

      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Manage your store</p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-1">Real Revenue (Paid)</p>
            <p className="text-3xl font-bold">₦{stats.realRevenue.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-2">From confirmed & delivered orders</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-5 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-1">Pending Revenue</p>
            <p className="text-3xl font-bold">₦{stats.pendingRevenue.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-2">Awaiting payment on delivery</p>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-600 mb-1">Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <p className="text-xs text-yellow-700 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-800">{stats.pendingOrders}</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-xs text-blue-700 mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-blue-800">{stats.confirmedOrders}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200 col-span-2">
            <p className="text-xs text-green-700 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-800">{stats.deliveredOrders}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <a 
            href="/admin/orders"
            className="bg-blue-50 rounded-xl p-4 flex items-center justify-between hover:bg-blue-100 transition"
          >
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Orders</p>
                <p className="text-xs text-gray-600">View and manage orders</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a 
            href="/admin/products"
            className="bg-purple-50 rounded-xl p-4 flex items-center justify-between hover:bg-purple-100 transition"
          >
            <div className="flex items-center">
              <div className="bg-purple-600 rounded-lg p-2 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Products</p>
                <p className="text-xs text-gray-600">Manage inventory</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a 
            href="/admin/referrals"
            className="bg-orange-50 rounded-xl p-4 flex items-center justify-between hover:bg-orange-100 transition"
          >
            <div className="flex items-center">
              <div className="bg-orange-600 rounded-lg p-2 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Referrals</p>
                <p className="text-xs text-gray-600">Track commissions</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  )
}