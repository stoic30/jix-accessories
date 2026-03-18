'use client'

import { useEffect, useState } from 'react'

export default function EmergencyOrders() {
  const [failedOrders, setFailedOrders] = useState([])

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('failedOrders') || '[]')
    setFailedOrders(orders)
  }, [])

  const clearOrders = () => {
    localStorage.removeItem('failedOrders')
    setFailedOrders([])
    alert('Cleared!')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Emergency Backup Orders</h1>
        
        {failedOrders.length === 0 ? (
          <p className="text-gray-500">No backup orders found ✅</p>
        ) : (
          <div>
            <p className="text-red-600 mb-4">⚠️ {failedOrders.length} orders found that failed to save!</p>
            <button onClick={clearOrders} className="bg-red-600 text-white px-4 py-2 rounded mb-4">
              Clear All
            </button>
            <pre className="bg-white p-4 rounded overflow-auto text-xs">
              {JSON.stringify(failedOrders, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}