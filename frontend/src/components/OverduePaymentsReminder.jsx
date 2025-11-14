/**
 * OverduePaymentsReminder Component
 *
 * Displays a popup notification for overdue payments.
 * Shows in the admin dashboard to alert about pending collections.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { API_ENDPOINTS } from '../config/api'
import { useServiceType } from '../contexts/ServiceTypeContext'

const OverduePaymentsReminder = () => {
  const { selectedServiceType } = useServiceType()
  const [overduePayments, setOverduePayments] = useState([])
  const [showReminder, setShowReminder] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch overdue payments
  const fetchOverduePayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.OVERDUE_PAYMENTS}?serviceType=${selectedServiceType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success && data.count > 0) {
        setOverduePayments(data.data)
        // Show reminder if there are overdue payments and user hasn't dismissed it today
        const lastDismissed = localStorage.getItem('overdueReminderDismissed')
        const today = new Date().toDateString()
        if (lastDismissed !== today) {
          setShowReminder(true)
        }
      }
    } catch (error) {
      console.error('Error fetching overdue payments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOverduePayments()
    // Refresh every 5 minutes
    const interval = setInterval(fetchOverduePayments, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [selectedServiceType])

  // Dismiss reminder for today
  const dismissReminder = () => {
    const today = new Date().toDateString()
    localStorage.setItem('overdueReminderDismissed', today)
    setShowReminder(false)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calculate days overdue
  const getDaysOverdue = (dueDate) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = Math.abs(today - due)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate total overdue amount
  const totalOverdueAmount = overduePayments.reduce((sum, payment) => sum + payment.amount, 0)

  if (loading || overduePayments.length === 0) {
    return null
  }

  return (
    <>
      {/* Notification Badge (Always visible) */}
      <div className="fixed top-20 right-6 z-40">
        <button
          onClick={() => setShowDetails(true)}
          className="relative bg-red-600 text-white rounded-full p-3 shadow-lg hover:bg-red-700 transition-colors"
          title={`${overduePayments.length} overdue payments`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {overduePayments.length}
          </span>
        </button>
      </div>

      {/* Initial Popup Reminder */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-6 z-50 w-96 bg-white rounded-lg shadow-2xl border-l-4 border-red-600"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Overdue Payments Alert</h3>
                    <p className="text-sm text-gray-600">You have {overduePayments.length} overdue payment{overduePayments.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button
                  onClick={dismissReminder}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Total Overdue Amount</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdueAmount)}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {overduePayments.slice(0, 3).map((payment) => (
                  <div key={payment._id} className="bg-gray-50 rounded p-3 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-800">{payment.project?.title || 'N/A'}</span>
                      <span className="text-red-600 font-bold">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="text-gray-600 text-xs">
                      <p>{payment.customer?.fullName || 'N/A'}</p>
                      <p className="text-red-600 mt-1">
                        {getDaysOverdue(payment.dueDate)} days overdue
                      </p>
                    </div>
                  </div>
                ))}
                {overduePayments.length > 3 && (
                  <p className="text-center text-sm text-gray-500 pt-2">
                    +{overduePayments.length - 3} more overdue payment{overduePayments.length - 3 > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <Link
                  to="/admin/collections"
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  onClick={dismissReminder}
                >
                  View Collections
                </Link>
                <button
                  onClick={dismissReminder}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Overdue Payments</h2>
                    <p className="text-gray-600 mt-1">{overduePayments.length} payment{overduePayments.length > 1 ? 's' : ''} requiring attention</p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="bg-red-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Overdue Amount</p>
                      <p className="text-3xl font-bold text-red-600">{formatCurrency(totalOverdueAmount)}</p>
                    </div>
                    <div className="bg-red-600 text-white rounded-full p-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {overduePayments.map((payment) => (
                    <div key={payment._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{payment.paymentId}</p>
                          <p className="text-sm text-gray-600">{payment.project?.title || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{formatCurrency(payment.amount)}</p>
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 mt-1">
                            {getDaysOverdue(payment.dueDate)} days overdue
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <p className="text-gray-500">Customer</p>
                          <p className="font-medium text-gray-800">{payment.customer?.fullName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Due Date</p>
                          <p className="font-medium text-gray-800">{formatDate(payment.dueDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Milestone</p>
                          <p className="font-medium text-gray-800">{payment.milestone?.replace('_', ' ').toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Contact</p>
                          <p className="font-medium text-gray-800">{payment.customer?.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    to="/admin/collections"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => setShowDetails(false)}
                  >
                    Manage Collections
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default OverduePaymentsReminder
