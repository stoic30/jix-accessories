'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const refQuery = query(collection(db, 'referrals'), orderBy('totalEarnings', 'desc'))
      const refSnapshot = await getDocs(refQuery)
      const refData = refSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const ordersSnapshot = await getDocs(ordersQuery)
      const ordersData = ordersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => order.referralCode)

      setReferrals(refData)
      setOrders(ordersData)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
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
        
        <div className="flex items-center mb-6">
          <a href="/admin/dashboard" className="mr-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        </div>

        <div className="space-y-3 mb-6">
          {referrals.map(ref => (
            <div key={ref.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900">{ref.referrerName}</p>
                  <p className="text-xs text-gray-500">Code: {ref.code}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  ref.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {ref.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Referrals</p>
                  <p className="text-lg font-bold text-blue-600">{ref.totalReferrals || 0}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Earnings</p>
                  <p className="text-lg font-bold text-green-600">₦{(ref.totalEarnings || 0).toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Rate</p>
                  <p className="text-lg font-bold text-purple-600">{ref.commissionRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Referral Orders</h2>
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-500">No referral orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{order.orderId}</p>
                    <p className="text-xs text-gray-500">{order.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-green-600">
                      +₦{order.referralDetails?.commissionAmount?.toLocaleString() || 0} 
                      {order.referralDetails?.commissionRate && ` (${order.referralDetails.commissionRate}%)`}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded px-2 py-1 inline-block">
                  <p className="text-xs font-medium text-blue-800">
                    {order.referralCode} • {order.referralDetails?.referrerName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}