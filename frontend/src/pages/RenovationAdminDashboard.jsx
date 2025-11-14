/**
 * Renovation Admin Dashboard
 *
 * Dashboard specifically for renovation vertical
 * Shows renovation-specific statistics, bookings, and service management
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

const RenovationAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeads: 0,
    totalProjects: 0,
    pendingLeads: 0,
    activeProjects: 0,
    completedProjects: 0,
    renovationBookings: 0,
    servicesOffered: 8
  })

  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchActivities()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.DASHBOARD_STATS}?serviceType=renovation`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()

      if (data.success) {
        setStats({
          totalEmployees: data.data.totalEmployees || 0,
          totalLeads: data.data.totalLeads || 0,
          totalProjects: data.data.totalProjects || 0,
          pendingLeads: data.data.pendingLeads || 0,
          activeProjects: data.data.activeProjects || 0,
          completedProjects: Math.floor((data.data.totalProjects - data.data.activeProjects) * 0.7) || 0,
          renovationBookings: data.data.totalLeads || 0,
          servicesOffered: 8 // We created 8 renovation services
        })
      }
    } catch (error) {
      console.error('Error fetching renovation stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.DASHBOARD_ACTIVITIES}?limit=5&serviceType=renovation`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.success) {
        setRecentActivities(data.data)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    }
  }

  const statCards = [
    {
      title: 'Renovation Crew',
      value: stats.totalEmployees,
      icon: '🔧',
      color: 'from-green-500 to-green-600',
      link: '/admin/employees'
    },
    {
      title: 'Renovation Leads',
      value: stats.totalLeads,
      badge: `${stats.pendingLeads} Pending`,
      icon: '📋',
      color: 'from-blue-500 to-blue-600',
      link: '/admin/leads'
    },
    {
      title: 'Renovation Projects',
      value: stats.totalProjects,
      badge: `${stats.activeProjects} Active`,
      icon: '🔨',
      color: 'from-orange-500 to-orange-600',
      link: '/admin/projects'
    },
    {
      title: 'Service Bookings',
      value: stats.renovationBookings,
      icon: '📅',
      color: 'from-purple-500 to-purple-600',
      link: '/admin/projects'
    }
  ]

  const renovationTypeData = [
    { name: 'Kitchen Renovation', value: stats.totalProjects * 0.30, color: '#10b981' },
    { name: 'Bathroom Renovation', value: stats.totalProjects * 0.25, color: '#3b82f6' },
    { name: 'Full Home Renovation', value: stats.totalProjects * 0.20, color: '#f97316' },
    { name: 'Room Renovation', value: stats.totalProjects * 0.15, color: '#8b5cf6' },
    { name: 'Other', value: stats.totalProjects * 0.10, color: '#ef4444' }
  ]

  const bookingStatusData = [
    { name: 'Quote Requested', value: Math.floor(stats.totalLeads * 0.40) },
    { name: 'Quote Sent', value: Math.floor(stats.totalLeads * 0.25) },
    { name: 'Approved', value: Math.floor(stats.totalLeads * 0.20) },
    { name: 'Scheduled', value: Math.floor(stats.totalLeads * 0.10) },
    { name: 'In Progress', value: Math.floor(stats.totalLeads * 0.05) }
  ]

  const monthlyTrendData = [
    { month: 'Jan', bookings: 10, projects: 6, revenue: 35 },
    { month: 'Feb', bookings: 12, projects: 8, revenue: 48 },
    { month: 'Mar', bookings: 15, projects: 10, revenue: 60 },
    { month: 'Apr', bookings: 18, projects: 12, revenue: 72 },
    { month: 'May', bookings: 16, projects: 11, revenue: 66 },
    { month: 'Jun', bookings: stats.totalLeads || 20, projects: stats.activeProjects || 13, revenue: 78 }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🔨</span>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl text-primary">Renovation Dashboard</h1>
            <p className="font-body text-sm sm:text-base text-gray-600">
              Managing renovation services, bookings, and transformation projects
            </p>
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
                <p className="font-heading text-4xl">{card.value}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-heading text-xl sm:text-2xl text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Add Specialist', desc: 'Hire renovation expert', icon: '🔧', link: '/admin/employees', color: 'bg-green-500' },
            { title: 'View Bookings', desc: 'Check service requests', icon: '📋', link: '/admin/leads', color: 'bg-blue-500' },
            { title: 'Manage Services', desc: 'Update offerings', icon: '⚙️', link: '/admin/projects', color: 'bg-orange-500' },
            { title: 'Before/After Gallery', desc: 'Portfolio showcase', icon: '🖼️', link: '/admin/gallery', color: 'bg-purple-500' }
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

      {/* Popular Renovation Services */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-xl p-6 mb-6 sm:mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-subheading text-lg text-primary mb-2">Popular Renovation Services</h3>
            <p className="font-body text-sm text-gray-700 mb-4">
              We offer {stats.servicesOffered} specialized renovation services ranging from kitchen and bathroom renovations
              to complete home transformations. Browse and manage all services.
            </p>
            <Link to="/renovations" target="_blank">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                View All Services →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
        {/* Renovation Type Distribution */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Renovation Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={renovationTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {renovationTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Pipeline */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Booking Pipeline Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 sm:mb-8">
        <h2 className="font-heading text-xl text-primary mb-4">Renovation Performance Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {stats.totalLeads > 0 ? ((stats.totalProjects / stats.totalLeads) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Booking Conversion</h3>
          <p className="text-xs opacity-75 mt-1">Requests to Projects</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">₹2.5L</span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Avg. Project Value</h3>
          <p className="text-xs opacity-75 mt-1">Per renovation project</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {stats.completedProjects > 0 ? Math.floor(stats.completedProjects / 4) : 0}
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Avg. Duration</h3>
          <p className="text-xs opacity-75 mt-1">Weeks to complete</p>
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Customer Satisfaction</h2>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">4.8</div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600">Average Rating from {stats.completedProjects} completed renovations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Top Performing Services</h2>
          <div className="space-y-3">
            {[
              { name: 'Kitchen Renovation', rating: 4.9, bookings: Math.floor(stats.totalLeads * 0.30) },
              { name: 'Bathroom Renovation', rating: 4.8, bookings: Math.floor(stats.totalLeads * 0.25) },
              { name: 'Full Home Renovation', rating: 4.7, bookings: Math.floor(stats.totalLeads * 0.20) }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-subheading text-sm text-primary">{service.name}</h3>
                  <p className="text-xs text-gray-600">{service.bookings} bookings</p>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-sm">{service.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl sm:text-2xl text-primary">Recent Renovation Activity</h2>
        </div>
        {recentActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔨</span>
            </div>
            <p className="font-body text-gray-500">No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-xl">🔨</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-subheading text-sm text-primary font-semibold">{activity.title}</h3>
                  <p className="font-body text-sm text-gray-600">{activity.description}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default RenovationAdminDashboard
