/**
 * On-Demand Services (ODS) Admin Dashboard
 *
 * Specialized dashboard for UrbanClap-style on-demand services
 * Features: Real-time booking tracking, provider dispatch, live operations
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const OnDemandAdminDashboard = () => {
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    revenue: { totalRevenue: 0, totalPaid: 0, totalPending: 0 }
  })

  const [providerStats, setProviderStats] = useState({
    total: 0,
    active: 0,
    pendingVerification: 0,
    suspended: 0
  })

  const [serviceStats, setServiceStats] = useState({
    total: 0,
    active: 0,
    popular: 0
  })

  const [recentBookings, setRecentBookings] = useState([])
  const [topProviders, setTopProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllStats()
    const interval = setInterval(fetchAllStats, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchAllStats = async () => {
    await Promise.all([
      fetchBookingStats(),
      fetchProviderStats(),
      fetchServiceStats(),
      fetchRecentBookings()
    ])
    setLoading(false)
  }

  const fetchBookingStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.ON_DEMAND_BOOKINGS_STATS, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setBookingStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error)
    }
  }

  const fetchProviderStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER_STATS, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setProviderStats(data.data)
        setTopProviders(data.data.topPerforming || [])
      }
    } catch (error) {
      console.error('Error fetching provider stats:', error)
    }
  }

  const fetchServiceStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.ON_DEMAND_SERVICES_STATS, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setServiceStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching service stats:', error)
    }
  }

  const fetchRecentBookings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.ON_DEMAND_BOOKINGS}?limit=5&page=1`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setRecentBookings(data.data)
      }
    } catch (error) {
      console.error('Error fetching recent bookings:', error)
    }
  }

  const statCards = [
    {
      title: 'Service Providers',
      value: providerStats.total,
      badge: `${providerStats.active} Active`,
      icon: '⚡',
      color: 'from-purple-500 to-purple-600',
      link: '/admin/on-demand/providers'
    },
    {
      title: 'Total Bookings',
      value: bookingStats.total,
      badge: `${bookingStats.today} Today`,
      icon: '📱',
      color: 'from-blue-500 to-blue-600',
      link: '/admin/on-demand/bookings'
    },
    {
      title: 'Active Jobs',
      value: bookingStats.inProgress + bookingStats.confirmed,
      badge: `${bookingStats.pending} Pending`,
      icon: '🔥',
      color: 'from-orange-500 to-orange-600',
      link: '/admin/on-demand/bookings'
    },
    {
      title: 'Revenue (Today)',
      value: `₹${(bookingStats.revenue?.totalRevenue || 0).toLocaleString()}`,
      icon: '💰',
      color: 'from-green-500 to-green-600',
      link: '/admin/on-demand/revenue'
    }
  ]

  const bookingStatusData = [
    { name: 'Pending', value: bookingStats.pending, color: '#f59e0b' },
    { name: 'Confirmed', value: bookingStats.confirmed, color: '#3b82f6' },
    { name: 'In Progress', value: bookingStats.inProgress, color: '#8b5cf6' },
    { name: 'Completed', value: bookingStats.completed, color: '#10b981' },
    { name: 'Cancelled', value: bookingStats.cancelled, color: '#ef4444' }
  ]

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      provider_on_way: 'bg-indigo-100 text-indigo-800',
      in_progress: 'bg-purple-100 text-purple-800',
      work_completed: 'bg-teal-100 text-teal-800',
      completed: 'bg-green-100 text-green-800',
      cancelled_by_customer: 'bg-red-100 text-red-800',
      cancelled_by_provider: 'bg-red-100 text-red-800',
      cancelled_by_admin: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⚡</span>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl text-primary">On-Demand Services</h1>
              <p className="font-body text-sm sm:text-base text-gray-600">
                Real-time booking operations & provider dispatch
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/on-demand/bookings">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                View All Bookings
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={card.link}>
              <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{card.icon}</span>
                  {card.badge && (
                    <span className="bg-white bg-opacity-20 text-xs px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-subheading text-sm opacity-90 mb-1">{card.title}</h3>
                <p className="font-heading text-3xl">{card.value}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Live Operations Status */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-xl p-6 mb-6 sm:mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white animate-pulse">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-subheading text-lg text-primary mb-2">Live Operations Dashboard</h3>
            <p className="font-body text-sm text-gray-700 mb-4">
              {bookingStats.pending} bookings awaiting assignment • {providerStats.active} providers ready for dispatch
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                <span className="text-xs text-gray-600">Pending Assignment</span>
                <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                <span className="text-xs text-gray-600">In Progress</span>
                <p className="text-2xl font-bold text-purple-600">{bookingStats.inProgress}</p>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                <span className="text-xs text-gray-600">Completed Today</span>
                <p className="text-2xl font-bold text-green-600">{bookingStats.today}</p>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                <span className="text-xs text-gray-600">Available Providers</span>
                <p className="text-2xl font-bold text-blue-600">{providerStats.active}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-heading text-xl sm:text-2xl text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Add Provider', desc: 'Onboard service professional', icon: '⚡', link: '/admin/employees', color: 'bg-purple-500' },
            { title: 'Pending Bookings', desc: 'Assign providers to jobs', icon: '📋', link: '/admin/on-demand/bookings?status=pending', color: 'bg-yellow-500' },
            { title: 'Provider Verification', desc: 'Verify documents & KYC', icon: '✓', link: '/admin/on-demand/providers?status=pending_verification', color: 'bg-blue-500' },
            { title: 'Service Catalog', desc: 'Manage services & pricing', icon: '🛠️', link: '/admin/on-demand/services', color: 'bg-green-500' }
          ].map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link to={action.link}>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <h3 className="font-subheading text-lg text-primary mb-2">{action.title}</h3>
                  <p className="font-body text-sm text-gray-600">{action.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
        {/* Booking Status Distribution */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Booking Status Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Service Performance */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Service Catalog Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-3xl font-bold text-purple-600">{serviceStats.total}</p>
              </div>
              <div className="text-5xl">🛠️</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-3xl font-bold text-green-600">{serviceStats.active}</p>
              </div>
              <div className="text-5xl">✅</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Popular Services</p>
                <p className="text-3xl font-bold text-yellow-600">{serviceStats.popular}</p>
              </div>
              <div className="text-5xl">⭐</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Providers */}
      {topProviders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl text-primary">Top Performing Providers</h2>
            <Link to="/admin/on-demand/providers" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProviders.slice(0, 6).map((provider, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {provider.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">{provider.fullName}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">{provider['rating.average']?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-600">Jobs Done</p>
                    <p className="font-bold text-purple-600">{provider['performance.completedBookings'] || 0}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-600">Success Rate</p>
                    <p className="font-bold text-green-600">{provider['performance.completionRate']?.toFixed(0) || 0}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl text-primary">Recent Bookings</h2>
          <Link to="/admin/on-demand/bookings" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <p className="font-body text-gray-500">No bookings yet</p>
            <p className="text-sm text-gray-400 mt-1">Bookings will appear here when customers start requesting services</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking, index) => (
              <Link key={index} to={`/admin/on-demand/bookings/${booking._id}`}>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors border border-gray-100">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {booking.service?.title?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-primary truncate">{booking.bookingId}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{booking.service?.title || 'Unknown Service'}</p>
                    <p className="text-xs text-gray-500">{booking.customer?.name} • {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">₹{booking.pricing?.total?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-500">{booking.serviceProvider ? 'Assigned' : 'Unassigned'}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default OnDemandAdminDashboard
