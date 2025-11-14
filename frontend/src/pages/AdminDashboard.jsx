/**
 * Admin Dashboard Page
 *
 * Main dashboard showing key statistics and metrics
 * Overview of employees, leads, projects, and users
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'
import { useServiceType } from '../contexts/ServiceTypeContext'
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeads: 0,
    totalUsers: 0,
    totalProjects: 0,
    pendingLeads: 0,
    activeProjects: 0,
    currentServiceType: 'all',
    availableServiceTypes: [],
    userRole: 'admin'
  })

  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activitiesLoading, setActivitiesLoading] = useState(true)

  // Use service type context
  const { selectedServiceType, setSelectedServiceType, isSuperAdmin } = useServiceType()

  useEffect(() => {
    // Fetch dashboard statistics from API
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const serviceParam = isSuperAdmin ? `?serviceType=${selectedServiceType}` : ''
        const response = await fetch(`${API_ENDPOINTS.DASHBOARD_STATS}${serviceParam}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()

        if (data.success) {
          setStats({
            totalEmployees: data.data.totalEmployees,
            totalLeads: data.data.totalLeads,
            totalUsers: data.data.totalUsers,
            totalProjects: data.data.totalProjects,
            pendingLeads: data.data.pendingLeads,
            activeProjects: data.data.activeProjects,
            currentServiceType: data.data.currentServiceType || 'all',
            availableServiceTypes: data.data.availableServiceTypes || [],
            userRole: data.data.userRole || 'admin'
          })
        } else {
          console.error('Failed to fetch dashboard stats:', data.message)
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchRecentActivities = async () => {
      try {
        const token = localStorage.getItem('token')
        const serviceParam = isSuperAdmin ? `&serviceType=${selectedServiceType}` : ''
        const response = await fetch(`${API_ENDPOINTS.DASHBOARD_ACTIVITIES}?limit=5${serviceParam}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()

        if (data.success) {
          setRecentActivities(data.data)
        } else {
          console.error('Failed to fetch recent activities:', data.message)
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error)
      } finally {
        setActivitiesLoading(false)
      }
    }

    fetchStats()
    fetchRecentActivities()
  }, [selectedServiceType])

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      link: '/admin/employees',
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      link: '/admin/leads',
      badge: `${stats.pendingLeads} Pending`,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      link: '/admin/users',
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      link: '/admin/projects',
      badge: `${stats.activeProjects} Active`,
    },
  ]

  const quickActions = [
    {
      title: 'Add New Employee',
      description: 'Create employee ID and credentials',
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      link: '/admin/employees',
      color: 'bg-blue-500',
    },
    {
      title: 'View Leads',
      description: 'Manage customer inquiries',
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      link: '/admin/leads',
      color: 'bg-green-500',
    },
    {
      title: 'Manage Gallery',
      description: 'Add or update project images',
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: '/admin/gallery',
      color: 'bg-purple-500',
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: '/admin/settings',
      color: 'bg-gray-500',
    },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  const serviceTypes = [
    { value: 'interior', label: 'Interior Design', icon: '🏠', color: 'from-blue-500 to-blue-600' },
    { value: 'construction', label: 'Construction', icon: '🏗️', color: 'from-orange-500 to-orange-600' },
    { value: 'renovation', label: 'Renovation', icon: '🔨', color: 'from-green-500 to-green-600' },
    { value: 'on_demand', label: 'On-Demand (ODS)', icon: '⚡', color: 'from-purple-500 to-purple-600' }
  ]

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl text-primary mb-2">Dashboard</h1>
        <p className="font-body text-sm sm:text-base text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Service Type Tabs - Only show for Super Admin */}
      {isSuperAdmin && (
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md p-2 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-700">Service Type:</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Super Admin Access</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {serviceTypes.map((service) => (
                <button
                  key={service.value}
                  onClick={() => setSelectedServiceType(service.value)}
                  className={`relative overflow-hidden rounded-lg p-3 sm:p-4 transition-all ${
                    selectedServiceType === service.value
                      ? `bg-gradient-to-br ${service.color} text-white shadow-lg scale-105`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl sm:text-3xl">{service.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold text-center">{service.label}</span>
                  </div>
                  {selectedServiceType === service.value && (
                    <div className="absolute top-1 right-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
              <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}>
                <div className="flex items-center justify-between mb-4">
                  {card.icon}
                  {card.badge && (
                    <span className="bg-white bg-opacity-20 text-xs px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-subheading text-sm opacity-90 mb-1">
                  {card.title}
                </h3>
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
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link to={action.link}>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="font-subheading text-lg text-primary mb-2">
                    {action.title}
                  </h3>
                  <p className="font-body text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
        {/* Project Status Distribution */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Project Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Active', value: stats.activeProjects || 0, color: '#10b981' },
                  { name: 'Completed', value: Math.floor((stats.totalProjects - stats.activeProjects) * 0.7) || 0, color: '#3b82f6' },
                  { name: 'On Hold', value: Math.floor((stats.totalProjects - stats.activeProjects) * 0.2) || 0, color: '#f59e0b' },
                  { name: 'Cancelled', value: Math.floor((stats.totalProjects - stats.activeProjects) * 0.1) || 0, color: '#ef4444' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Active', value: stats.activeProjects || 0, color: '#10b981' },
                  { name: 'Completed', value: Math.floor((stats.totalProjects - stats.activeProjects) * 0.7) || 0, color: '#3b82f6' },
                  { name: 'On Hold', value: Math.floor((stats.totalProjects - stats.activeProjects) * 0.2) || 0, color: '#f59e0b' },
                  { name: 'Cancelled', value: Math.floor((stats.totalProjects - stats.activeProjects) * 0.1) || 0, color: '#ef4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Lead Status Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'New', value: stats.pendingLeads || 0 },
                { name: 'Contacted', value: Math.floor((stats.totalLeads - stats.pendingLeads) * 0.4) || 0 },
                { name: 'Qualified', value: Math.floor((stats.totalLeads - stats.pendingLeads) * 0.3) || 0 },
                { name: 'Converted', value: Math.floor((stats.totalLeads - stats.pendingLeads) * 0.3) || 0 }
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Conversion Rate */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {stats.totalLeads > 0 ? ((stats.activeProjects / stats.totalLeads) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Conversion Rate</h3>
          <p className="text-xs opacity-75 mt-1">Leads to Projects</p>
        </div>

        {/* Average Project Value */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">$15K</span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Avg Project Value</h3>
          <p className="text-xs opacity-75 mt-1">Per completed project</p>
        </div>

        {/* Employee Efficiency */}
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
          <h3 className="font-subheading text-sm opacity-90">Projects per Employee</h3>
          <p className="text-xs opacity-75 mt-1">Active workload</p>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="font-heading text-xl text-primary mb-4">Monthly Performance Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={[
              { month: 'Jan', leads: 45, projects: 12, revenue: 180 },
              { month: 'Feb', leads: 52, projects: 15, revenue: 225 },
              { month: 'Mar', leads: 48, projects: 13, revenue: 195 },
              { month: 'Apr', leads: 61, projects: 18, revenue: 270 },
              { month: 'May', leads: 55, projects: 16, revenue: 240 },
              { month: 'Jun', leads: stats.totalLeads || 58, projects: stats.activeProjects || 17, revenue: 255 }
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity - Enhanced Timeline */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl sm:text-2xl text-primary">Recent Activity Timeline</h2>
          <Link to="/admin/activities" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {activitiesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-body text-gray-500">No recent activities</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[21px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-transparent"></div>

            <div className="space-y-6">
              {recentActivities.map((activity, index) => {
                // Format timestamp to relative time
                const getRelativeTime = (timestamp) => {
                  const now = new Date()
                  const activityTime = new Date(timestamp)
                  const diffInSeconds = Math.floor((now - activityTime) / 1000)

                  if (diffInSeconds < 60) return 'Just now'
                  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
                  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
                  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
                  return activityTime.toLocaleDateString()
                }

                // Get icon and color based on activity type
                const getActivityStyle = (type) => {
                  switch (type) {
                    case 'lead':
                      return {
                        icon: (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                        ),
                        bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
                        borderColor: 'border-green-200'
                      }
                    case 'project':
                      return {
                        icon: (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                          </svg>
                        ),
                        bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
                        borderColor: 'border-blue-200'
                      }
                    case 'user':
                      return {
                        icon: (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        ),
                        bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
                        borderColor: 'border-purple-200'
                      }
                    default:
                      return {
                        icon: (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        ),
                        bgColor: 'bg-gradient-to-br from-gray-500 to-gray-600',
                        borderColor: 'border-gray-200'
                      }
                  }
                }

                const style = getActivityStyle(activity.type)

                return (
                  <div key={index} className="relative flex gap-4">
                    {/* Timeline Icon */}
                    <div className={`relative z-10 flex-shrink-0 w-11 h-11 ${style.bgColor} rounded-full flex items-center justify-center text-white shadow-lg`}>
                      {style.icon}
                    </div>

                    {/* Activity Card */}
                    <div className={`flex-1 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-l-4 ${style.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-subheading text-sm text-primary font-semibold">
                          {activity.title}
                        </h3>
                        <span className="flex-shrink-0 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                      <p className="font-body text-sm text-gray-600">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
