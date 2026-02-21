'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'

export default function OrdersPage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchPhone, setSearchPhone] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const fetchOrdersByPhone = async () => {
    if (!searchPhone) {
      alert('Please enter your phone number')
      return
    }
    
    setLoading(true)
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const allOrders = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(order => order.customer.phone === searchPhone)
      
      setOrders(allOrders)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const fetchOrdersByEmail = async (email) => {
    setLoading(true)
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const allOrders = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(order => order.customer.email === email)
      
      setOrders(allOrders)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) {
      fetchOrdersByEmail(user.email)
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <a href="/account" className="mr-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>

        {/* If not logged in - show phone search */}
        {!user && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-900 mb-3 font-medium">Track your orders using your phone number</p>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Enter phone number"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="flex-1 px-4 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={fetchOrdersByPhone}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 text-sm"
              >
                Search
              </button>
            </div>
          </div>
        )}

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-500 mb-4">
              {user ? 'No orders yet' : 'No orders found for this phone number'}
            </p>
            <a href="/" className="text-blue-600 font-medium">Start Shopping →</a>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{order.orderId}</p>
                    <p className="text-xs text-gray-500">
                      {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.orderStatus === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-contain mr-2 bg-gray-50 rounded" />
                      <span className="text-gray-700 flex-1 line-clamp-1">{item.name}</span>
                      <span className="text-gray-500">×{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-lg font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</span>
                </div>

                {/* Contact Support */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <a 
                    href={`https://wa.me/2348012345678?text=Hi, I want to check on my order ${order.orderId}`}
                    target="_blank"
                    className="text-green-600 text-sm font-medium flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Track Order via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}