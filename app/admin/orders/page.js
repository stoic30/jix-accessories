'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export default function AdminOrders() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, confirmed, delivered

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        fetchOrders()
      } else {
        window.location.href = '/admin'
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setOrders(ordersData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
        updatedAt: new Date()
      })
      
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, orderStatus: newStatus } : o
      ))
      
      alert(`Order status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order status')
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.orderStatus.toLowerCase() === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading orders...</div>
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
              <h1 className="text-xl font-bold text-gray-900">Orders Management</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pending ({orders.filter(o => o.orderStatus === 'Pending').length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'confirmed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Confirmed ({orders.filter(o => o.orderStatus === 'Confirmed').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Delivered ({orders.filter(o => o.orderStatus === 'Delivered').length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{order.orderId}</h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.orderStatus === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    
                    {/* Customer Info */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-gray-600 w-24">Name:</span>
                          <span className="text-gray-900 font-medium">{order.customer.name}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-600 w-24">Phone:</span>
                          <span className="text-gray-900 font-medium">
                            <a href={`tel:${order.customer.phone}`} className="text-blue-600 hover:underline">
                              {order.customer.phone}
                            </a>
                          </span>
                        </div>
                        {order.customer.email && (
                          <div className="flex">
                            <span className="text-gray-600 w-24">Email:</span>
                            <span className="text-gray-900">{order.customer.email}</span>
                          </div>
                        )}
                        <div className="flex">
                          <span className="text-gray-600 w-24">Hall:</span>
                          <span className="text-gray-900">{order.customer.hall}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-600 w-24">Address:</span>
                          <span className="text-gray-900">{order.customer.address}</span>
                        </div>
                        {order.customer.notes && (
                          <div className="flex">
                            <span className="text-gray-600 w-24">Notes:</span>
                            <span className="text-gray-900 italic">{order.customer.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Payment Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-gray-600 w-32">Payment Method:</span>
                          <span className="text-gray-900 font-medium">
                            {order.paymentMethod === 'delivery' ? 'Pay on Delivery' : 'Paystack'}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-600 w-32">Payment Status:</span>
                          <span className={`font-semibold ${
                            order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Order Items</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-10 h-10 rounded object-cover mr-3"
                                    />
                                  )}
                                  <span className="text-sm text-gray-900">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">₦{item.price.toLocaleString()}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {order.orderStatus === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Confirmed')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        ✓ Confirm Order
                      </button>
                    )}
                    {order.orderStatus === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                      >
                        ✓ Mark as Delivered
                      </button>
                    )}
                    
                      <a href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=Hello ${order.customer.name}, your order ${order.orderId} has been received.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Contact Customer
                    </a>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}