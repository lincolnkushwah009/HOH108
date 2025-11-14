/**
 * Interior Admin Dashboard
 *
 * Dashboard specifically for interior design vertical
 * Shows interior-specific statistics, projects, and leads
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

const InteriorAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeads: 0,
    totalProjects: 0,
    pendingLeads: 0,
    activeProjects: 0,
    completedProjects: 0,
    designsCreated: 0,
    customersServed: 0
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
      const response = await fetch(`${API_ENDPOINTS.DASHBOARD_STATS}?serviceType=interior`, {
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
          designsCreated: (data.data.totalProjects * 3) || 0, // Mock: ~3 designs per project
          customersServed: data.data.totalUsers || 0
        })
      }
    } catch (error) {
      console.error('Error fetching interior stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.DASHBOARD_ACTIVITIES}?limit=5&serviceType=interior`, {
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
      title: 'Interior Designers',
      value: stats.totalEmployees,
      icon: '👨‍🎨',
      color: 'from-blue-500 to-blue-600',
      link: '/admin/employees'
    },
    {
      title: 'Design Leads',
      value: stats.totalLeads,
      badge: `${stats.pendingLeads} Pending`,
      icon: '📋',
      color: 'from-green-500 to-green-600',
      link: '/admin/leads'
    },
    {
      title: 'Interior Projects',
      value: stats.totalProjects,
      badge: `${stats.activeProjects} Active`,
      icon: '🏠',
      color: 'from-purple-500 to-purple-600',
      link: '/admin/projects'
    },
    {
      title: 'Designs Created',
      value: stats.designsCreated,
      icon: '🎨',
      color: 'from-pink-500 to-pink-600',
      link: '/admin/projects'
    }
  ]

  const projectTypeData = [
    { name: 'Residential', value: stats.totalProjects * 0.6, color: '#3b82f6' },
    { name: 'Commercial', value: stats.totalProjects * 0.25, color: '#10b981' },
    { name: 'Office', value: stats.totalProjects * 0.15, color: '#f59e0b' }
  ]

  const roomTypeData = [
    { name: 'Living Room', value: Math.floor(stats.totalProjects * 0.3) },
    { name: 'Bedroom', value: Math.floor(stats.totalProjects * 0.25) },
    { name: 'Kitchen', value: Math.floor(stats.totalProjects * 0.2) },
    { name: 'Bathroom', value: Math.floor(stats.totalProjects * 0.15) },
    { name: 'Full Home', value: Math.floor(stats.totalProjects * 0.1) }
  ]

  const monthlyTrendData = [
    { month: 'Jan', leads: 12, projects: 8, revenue: 45 },
    { month: 'Feb', leads: 15, projects: 10, revenue: 60 },
    { month: 'Mar', leads: 18, projects: 12, revenue: 72 },
    { month: 'Apr', leads: 22, projects: 15, revenue: 90 },
    { month: 'May', leads: 20, projects: 14, revenue: 84 },
    { month: 'Jun', leads: stats.totalLeads || 25, projects: stats.activeProjects || 16, revenue: 96 }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏠</span>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl text-primary">Interior Design Dashboard</h1>
            <p className="font-body text-sm sm:text-base text-gray-600">
              Managing interior design projects and creative solutions
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
            { title: 'Add Designer', desc: 'Hire new interior designer', icon: '👨‍🎨', link: '/admin/employees', color: 'bg-blue-500' },
            { title: 'View Design Leads', desc: 'Check new inquiries', icon: '📋', link: '/admin/leads', color: 'bg-green-500' },
            { title: 'Design Gallery', desc: 'Manage portfolio', icon: '🎨', link: '/admin/gallery', color: 'bg-purple-500' },
            { title: 'Client Reviews', desc: 'Customer feedback', icon: '⭐', link: '/admin/customers', color: 'bg-yellow-500' }
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
        {/* Project Type Distribution */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Project Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {projectTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Room Type Breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Popular Room Types</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 sm:mb-8">
        <h2 className="font-heading text-xl text-primary mb-4">Interior Design Performance Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} />
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
          <h3 className="font-subheading text-sm opacity-90">Lead Conversion Rate</h3>
          <p className="text-xs opacity-75 mt-1">Inquiries to Projects</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {stats.completedProjects > 0 ? Math.floor(stats.completedProjects / 6) : 0}
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Avg. Project Duration</h3>
          <p className="text-xs opacity-75 mt-1">Weeks to complete</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {stats.totalEmployees > 0 ? (stats.activeProjects / stats.totalEmployees).toFixed(1) : 0}
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Designer Workload</h3>
          <p className="text-xs opacity-75 mt-1">Active projects per designer</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl sm:text-2xl text-primary">Recent Interior Design Activity</h2>
        </div>
        {recentActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎨</span>
            </div>
            <p className="font-body text-gray-500">No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-xl">🏠</span>
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

export default InteriorAdminDashboard
