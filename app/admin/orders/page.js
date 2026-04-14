'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Format phone number for WhatsApp
const formatWhatsAppNumber = (phone) => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  if (cleaned.startsWith('0')) {
    return '234' + cleaned.slice(1)
  }
  
  if (cleaned.startsWith('+234')) {
    return cleaned.slice(1)
  }
  
  if (cleaned.startsWith('234')) {
    return cleaned
  }
  
  return '234' + cleaned
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOrders, setFilteredOrders] = useState([])
  const [updatingOrder, setUpdatingOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, confirmed, delivered

  useEffect(() => {
    fetchAllOrders()
  }, [])

  // Filter orders whenever search term or status filter changes
  useEffect(() => {
    filterOrders()
  }, [searchTerm, filterStatus, orders])

  const fetchAllOrders = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const allOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setOrders(allOrders)
      setFilteredOrders(allOrders)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
      alert('Error loading orders. Please try again.')
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => 
        order.orderStatus.toLowerCase() === filterStatus.toLowerCase()
      )
    }

    // Filter by search term (Order ID, Phone, Name)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(term) ||
        order.customer.phone.includes(term) ||
        order.customer.name.toLowerCase().includes(term)
      )
    }

    setFilteredOrders(filtered)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  // Mark order as delivered
  const markAsDelivered = async (orderId, orderDocId) => {
    if (!confirm(`Mark order ${orderId} as delivered?`)) {
      return
    }

    setUpdatingOrder(orderDocId)
    
    try {
      const orderRef = doc(db, 'orders', orderDocId)
      await updateDoc(orderRef, {
        orderStatus: 'Delivered',
        deliveredAt: new Date()
      })

      const updatedOrders = orders.map(order => 
        order.id === orderDocId 
          ? { ...order, orderStatus: 'Delivered', deliveredAt: new Date() }
          : order
      )
      
      setOrders(updatedOrders)
      alert(`Order ${orderId} marked as delivered! ✅`)
      setUpdatingOrder(null)
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order. Please try again.')
      setUpdatingOrder(null)
    }
  }

  // Mark order as confirmed
  const markAsConfirmed = async (orderId, orderDocId) => {
    if (!confirm(`Confirm order ${orderId}?`)) {
      return
    }

    setUpdatingOrder(orderDocId)
    
    try {
      const orderRef = doc(db, 'orders', orderDocId)
      await updateDoc(orderRef, {
        orderStatus: 'Confirmed',
        confirmedAt: new Date()
      })

      const updatedOrders = orders.map(order => 
        order.id === orderDocId 
          ? { ...order, orderStatus: 'Confirmed', confirmedAt: new Date() }
          : order
      )
      
      setOrders(updatedOrders)
      alert(`Order ${orderId} confirmed! ✅`)
      setUpdatingOrder(null)
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order. Please try again.')
      setUpdatingOrder(null)
    }
  }

  // Calculate REAL revenue (only confirmed/delivered + paid orders)
  const calculateRealRevenue = () => {
    return orders
      .filter(order => 
        (order.orderStatus === 'Confirmed' || order.orderStatus === 'Delivered') &&
        order.paymentStatus === 'Paid'
      )
      .reduce((sum, order) => sum + order.totalAmount, 0)
  }

  // Calculate pending revenue (confirmed but not yet paid)
  const calculatePendingRevenue = () => {
    return orders
      .filter(order => 
        (order.orderStatus === 'Confirmed' || order.orderStatus === 'Delivered') &&
        order.paymentStatus === 'Pending'
      )
      .reduce((sum, order) => sum + order.totalAmount, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  const realRevenue = calculateRealRevenue()
  const pendingRevenue = calculatePendingRevenue()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <a href="/admin/dashboard" className="mr-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
          </div>
          <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            {filteredOrders.length}
          </span>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-xs text-green-700 font-medium mb-1">Real Revenue</p>
            <p className="text-xl font-bold text-green-800">₦{realRevenue.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">Confirmed + Paid</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <p className="text-xs text-yellow-700 font-medium mb-1">Pending</p>
            <p className="text-xl font-bold text-yellow-800">₦{pendingRevenue.toLocaleString()}</p>
            <p className="text-xs text-yellow-600 mt-1">Awaiting Payment</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-3 font-medium">Search Orders</p>
          
          {/* Search Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Order ID, Phone, or Name"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm ? (
              <button
                onClick={clearSearch}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 text-sm"
              >
                Clear
              </button>
            ) : null}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                filterStatus === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                filterStatus === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Pending ({orders.filter(o => o.orderStatus === 'Pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                filterStatus === 'confirmed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Confirmed ({orders.filter(o => o.orderStatus === 'Confirmed').length})
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                filterStatus === 'delivered' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Delivered ({orders.filter(o => o.orderStatus === 'Delivered').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-500 mb-2">No orders found</p>
            {(searchTerm || filterStatus !== 'all') && (
              <button 
                onClick={() => {
                  clearSearch()
                  setFilterStatus('all')
                }} 
                className="text-blue-600 font-medium text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order.orderId}</p>
                    <p className="text-xs text-gray-500">
                      {order.createdAt?.toDate?.()?.toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3 text-xs">
                  <p className="text-gray-600"><strong>Name:</strong> {order.customer.name}</p>
                  <p className="text-gray-600"><strong>Phone:</strong> {order.customer.phone}</p>
                  <p className="text-gray-600"><strong>Hall:</strong> {order.customer.hall}</p>
                  <p className="text-gray-600"><strong>Address:</strong> {order.customer.address}</p>
                  <p className="text-gray-600"><strong>Payment:</strong> {order.paymentMethod}</p>
                </div>
                
                {/* Items */}
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
                
                {/* Total */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</span>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {/* WhatsApp Button */}
                  <a 
                    href={`https://wa.me/${formatWhatsAppNumber(order.customer.phone)}?text=Hi ${order.customer.name}, your order ${order.orderId} has been ${order.orderStatus === 'Delivered' ? 'delivered' : 'confirmed and will be delivered soon'}!`}
                    target="_blank"
                    className="w-full bg-green-50 text-green-700 text-sm font-medium py-2 rounded-lg flex items-center justify-center hover:bg-green-100"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Message Customer
                  </a>

                  {/* Status Action Buttons */}
                  <div className="flex gap-2">
                    {order.orderStatus === 'Pending' && (
                      <button
                        onClick={() => markAsConfirmed(order.orderId, order.id)}
                        disabled={updatingOrder === order.id}
                        className={`flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 ${
                          updatingOrder === order.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {updatingOrder === order.id ? 'Updating...' : 'Confirm Order'}
                      </button>
                    )}

                    {(order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed') && (
                      <button
                        onClick={() => markAsDelivered(order.orderId, order.id)}
                        disabled={updatingOrder === order.id}
                        className={`flex-1 bg-green-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-700 ${
                          updatingOrder === order.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {updatingOrder === order.id ? 'Updating...' : 'Mark Delivered'}
                      </button>
                    )}

                    {order.orderStatus === 'Delivered' && (
                      <div className="flex-1 bg-green-100 text-green-800 text-sm font-medium py-2 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Delivered
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}