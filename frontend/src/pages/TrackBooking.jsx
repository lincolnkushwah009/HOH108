/**
 * Track Booking Page
 *
 * Allows users to track their on-demand service booking status
 * without logging in - just using Booking ID and phone number
 */

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { API_ENDPOINTS } from '../config/api'

const TrackBooking = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [bookingId, setBookingId] = useState(searchParams.get('bookingId') || '')
  const [phone, setPhone] = useState(searchParams.get('phone') || '')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-fetch if both params are present
  useEffect(() => {
    if (bookingId && phone) {
      handleTrackBooking()
    }
  }, [])

  const handleTrackBooking = async (e) => {
    if (e) e.preventDefault()

    setLoading(true)
    setError('')
    setBooking(null)

    try {
      const response = await fetch(API_ENDPOINTS.ON_DEMAND_BOOKING_TRACK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId, phone })
      })

      const data = await response.json()

      if (data.success) {
        setBooking(data.data)
      } else {
        setError(data.message || 'Booking not found. Please check your details.')
      }
    } catch (error) {
      console.error('Track booking error:', error)
      setError('An error occurred while tracking your booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      provider_on_way: 'bg-indigo-100 text-indigo-800',
      in_progress: 'bg-purple-100 text-purple-800',
      work_completed: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled_by_customer: 'bg-red-100 text-red-800',
      cancelled_by_provider: 'bg-red-100 text-red-800',
      cancelled_by_admin: 'bg-red-100 text-red-800',
      rescheduled: 'bg-orange-100 text-orange-800'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatStatus = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Booking
          </h1>
          <p className="text-lg text-gray-600">
            Enter your Booking ID and phone number to track your service status
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleTrackBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking ID
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g., OD-BK-000001"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your registered phone number"
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Track Booking</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Booking Details */}
        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Status Banner */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Booking #{booking.bookingId}
                  </h2>
                  <p className="text-gray-600">
                    Booked on {formatDate(booking.createdAt)} at {formatTime(booking.createdAt)}
                  </p>
                </div>
                <span className={`px-6 py-3 rounded-full font-semibold ${getStatusColor(booking.status)}`}>
                  {formatStatus(booking.status)}
                </span>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Service Details</h3>
              <div className="flex items-start gap-4">
                {booking.service.image && (
                  <img
                    src={booking.service.image}
                    alt={booking.service.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{booking.service.title}</h4>
                  <p className="text-gray-600">{booking.service.category}</p>
                  <div className="mt-2">
                    <span className="text-purple-600 font-semibold text-lg">
                      ₹{booking.pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="text-gray-900 font-semibold">{formatDate(booking.scheduledDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Time Slot</p>
                  <p className="text-gray-900 font-semibold">
                    {booking.timeSlot.start} - {booking.timeSlot.end}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Service Address</h3>
              <div className="text-gray-700">
                <p>{booking.serviceAddress.addressLine1}</p>
                {booking.serviceAddress.addressLine2 && <p>{booking.serviceAddress.addressLine2}</p>}
                {booking.serviceAddress.landmark && <p>Landmark: {booking.serviceAddress.landmark}</p>}
                <p>{booking.serviceAddress.city}, {booking.serviceAddress.state} - {booking.serviceAddress.pincode}</p>
              </div>
            </div>

            {/* Service Provider (if assigned) */}
            {booking.serviceProvider && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Service Provider</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{booking.serviceProvider.fullName}</p>
                    <p className="text-gray-600">{booking.serviceProvider.phone}</p>
                    {booking.serviceProvider.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-semibold">{booking.serviceProvider.rating.average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about your booking, feel free to contact us.
              </p>
              <a
                href="tel:+911234567890"
                className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 123 456 7890</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default TrackBooking
