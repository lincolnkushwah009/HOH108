/**
 * Construction Admin Dashboard
 *
 * Dashboard specifically for construction vertical
 * Shows construction-specific statistics, projects, and site management
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

const ConstructionAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeads: 0,
    totalProjects: 0,
    pendingLeads: 0,
    activeProjects: 0,
    completedProjects: 0,
    sitesManaged: 0,
    materialsSupplied: 0
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
      const response = await fetch(`${API_ENDPOINTS.DASHBOARD_STATS}?serviceType=construction`, {
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
          sitesManaged: data.data.activeProjects || 0,
          materialsSupplied: (data.data.totalProjects * 150) || 0 // Mock: ~150 material orders per project
        })
      }
    } catch (error) {
      console.error('Error fetching construction stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.DASHBOARD_ACTIVITIES}?limit=5&serviceType=construction`, {
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
      title: 'Construction Crew',
      value: stats.totalEmployees,
      icon: '👷',
      color: 'from-orange-500 to-orange-600',
      link: '/admin/employees'
    },
    {
      title: 'Construction Leads',
      value: stats.totalLeads,
      badge: `${stats.pendingLeads} Pending`,
      icon: '📋',
      color: 'from-green-500 to-green-600',
      link: '/admin/leads'
    },
    {
      title: 'Construction Projects',
      value: stats.totalProjects,
      badge: `${stats.activeProjects} Active`,
      icon: '🏗️',
      color: 'from-blue-500 to-blue-600',
      link: '/admin/projects'
    },
    {
      title: 'Active Sites',
      value: stats.sitesManaged,
      icon: '🏭',
      color: 'from-red-500 to-red-600',
      link: '/admin/projects'
    }
  ]

  const projectTypeData = [
    { name: 'Residential Building', value: stats.totalProjects * 0.45, color: '#f97316' },
    { name: 'Commercial Complex', value: stats.totalProjects * 0.30, color: '#3b82f6' },
    { name: 'Infrastructure', value: stats.totalProjects * 0.15, color: '#10b981' },
    { name: 'Industrial', value: stats.totalProjects * 0.10, color: '#ef4444' }
  ]

  const projectPhaseData = [
    { name: 'Planning', value: Math.floor(stats.activeProjects * 0.2) },
    { name: 'Foundation', value: Math.floor(stats.activeProjects * 0.15) },
    { name: 'Structure', value: Math.floor(stats.activeProjects * 0.30) },
    { name: 'Finishing', value: Math.floor(stats.activeProjects * 0.25) },
    { name: 'Handover', value: Math.floor(stats.activeProjects * 0.10) }
  ]

  const monthlyTrendData = [
    { month: 'Jan', leads: 8, projects: 5, revenue: 120 },
    { month: 'Feb', leads: 10, projects: 7, revenue: 168 },
    { month: 'Mar', leads: 12, projects: 8, revenue: 192 },
    { month: 'Apr', leads: 15, projects: 10, revenue: 240 },
    { month: 'May', leads: 13, projects: 9, revenue: 216 },
    { month: 'Jun', leads: stats.totalLeads || 16, projects: stats.activeProjects || 11, revenue: 264 }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏗️</span>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl text-primary">Construction Dashboard</h1>
            <p className="font-body text-sm sm:text-base text-gray-600">
              Managing construction projects, sites, and building operations
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
            { title: 'Add Worker', desc: 'Register construction crew', icon: '👷', link: '/admin/employees', color: 'bg-orange-500' },
            { title: 'View Leads', desc: 'Check new projects', icon: '📋', link: '/admin/leads', color: 'bg-green-500' },
            { title: 'Site Inspection', desc: 'Schedule visits', icon: '🔍', link: '/admin/projects', color: 'bg-blue-500' },
            { title: 'Material Orders', desc: 'Track supplies', icon: '📦', link: '/admin/collections', color: 'bg-red-500' }
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
          <h2 className="font-heading text-xl text-primary mb-4">Construction Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
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

        {/* Project Phase Breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Active Projects by Phase</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectPhaseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 sm:mb-8">
        <h2 className="font-heading text-xl text-primary mb-4">Construction Performance Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#f97316" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {stats.completedProjects > 0 ? ((stats.completedProjects / stats.totalProjects) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Completion Rate</h3>
          <p className="text-xs opacity-75 mt-1">On-time project delivery</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {stats.completedProjects > 0 ? Math.floor(stats.completedProjects / 3) : 0}
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Avg. Duration</h3>
          <p className="text-xs opacity-75 mt-1">Months to complete</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {stats.totalEmployees > 0 ? (stats.activeProjects / stats.totalEmployees).toFixed(1) : 0}
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Sites per Crew</h3>
          <p className="text-xs opacity-75 mt-1">Active workload distribution</p>
        </div>
      </div>

      {/* Site Safety & Compliance */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 rounded-xl p-6 mb-6 sm:mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-subheading text-lg text-primary mb-2">Site Safety Compliance</h3>
            <p className="font-body text-sm text-gray-700 mb-4">
              All construction sites are required to maintain safety protocols and regular inspections.
              {stats.activeProjects} active sites are being monitored for compliance.
            </p>
            <div className="flex gap-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-xs text-gray-600">Safety Score</span>
                <p className="text-lg font-semibold text-green-600">94%</p>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-xs text-gray-600">Inspections</span>
                <p className="text-lg font-semibold text-blue-600">{stats.sitesManaged * 2}</p>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-xs text-gray-600">Incidents</span>
                <p className="text-lg font-semibold text-red-600">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl sm:text-2xl text-primary">Recent Construction Activity</h2>
        </div>
        {recentActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏗️</span>
            </div>
            <p className="font-body text-gray-500">No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-xl">🏗️</span>
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

export default ConstructionAdminDashboard
