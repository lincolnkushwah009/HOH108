/**
 * Super Admin Dashboard
 *
 * Consolidated dashboard showing aggregated data from all verticals
 * with drill-down capabilities and comparative analytics
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

const SuperAdminDashboard = () => {
  const [allStats, setAllStats] = useState({
    totalEmployees: 0,
    totalLeads: 0,
    totalUsers: 0,
    totalProjects: 0,
    totalRevenue: 0,
    verticalBreakdown: {
      interior: { employees: 0, leads: 0, projects: 0, revenue: 0 },
      construction: { employees: 0, leads: 0, projects: 0, revenue: 0 },
      renovation: { employees: 0, leads: 0, projects: 0, revenue: 0 },
      on_demand: { employees: 0, leads: 0, projects: 0, revenue: 0 }
    }
  })

  const [selectedVerticalView, setSelectedVerticalView] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllStats()
  }, [])

  const fetchAllStats = async () => {
    try {
      const token = localStorage.getItem('token')

      // Fetch stats for all verticals
      const verticals = ['interior', 'construction', 'renovation', 'on_demand']
      const statsPromises = verticals.map(vertical =>
        fetch(`${API_ENDPOINTS.DASHBOARD_STATS}?serviceType=${vertical}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json())
      )

      const results = await Promise.all(statsPromises)

      // Aggregate data
      let totalEmployees = 0
      let totalLeads = 0
      let totalUsers = 0
      let totalProjects = 0
      let totalRevenue = 0
      const breakdown = {}

      results.forEach((data, index) => {
        const vertical = verticals[index]
        if (data.success) {
          totalEmployees += data.data.totalEmployees || 0
          totalLeads += data.data.totalLeads || 0
          totalUsers += data.data.totalUsers || 0
          totalProjects += data.data.totalProjects || 0

          breakdown[vertical] = {
            employees: data.data.totalEmployees || 0,
            leads: data.data.totalLeads || 0,
            projects: data.data.totalProjects || 0,
            activeProjects: data.data.activeProjects || 0,
            pendingLeads: data.data.pendingLeads || 0,
            revenue: Math.floor(Math.random() * 500000) + 100000 // Mock revenue data
          }
          totalRevenue += breakdown[vertical].revenue
        }
      })

      setAllStats({
        totalEmployees,
        totalLeads,
        totalUsers,
        totalProjects,
        totalRevenue,
        verticalBreakdown: breakdown
      })
    } catch (error) {
      console.error('Error fetching super admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const verticalConfigs = {
    interior: {
      label: 'Interior Design',
      icon: '🏠',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500',
      chartColor: '#3b82f6'
    },
    construction: {
      label: 'Construction',
      icon: '🏗️',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500',
      chartColor: '#f97316'
    },
    renovation: {
      label: 'Renovation',
      icon: '🔨',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500',
      chartColor: '#10b981'
    },
    on_demand: {
      label: 'On-Demand Services (ODS)',
      icon: '⚡',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500',
      chartColor: '#8b5cf6'
    }
  }

  // Prepare chart data
  const verticalComparisonData = Object.keys(allStats.verticalBreakdown).map(vertical => ({
    name: verticalConfigs[vertical].label,
    employees: allStats.verticalBreakdown[vertical].employees,
    leads: allStats.verticalBreakdown[vertical].leads,
    projects: allStats.verticalBreakdown[vertical].projects,
    revenue: allStats.verticalBreakdown[vertical].revenue / 1000 // Convert to thousands
  }))

  const revenueDistribution = Object.keys(allStats.verticalBreakdown).map(vertical => ({
    name: verticalConfigs[vertical].label,
    value: allStats.verticalBreakdown[vertical].revenue,
    color: verticalConfigs[vertical].chartColor
  }))

  const performanceRadarData = Object.keys(allStats.verticalBreakdown).map(vertical => {
    const data = allStats.verticalBreakdown[vertical]
    const maxProjects = Math.max(...Object.values(allStats.verticalBreakdown).map(v => v.projects)) || 1
    const maxLeads = Math.max(...Object.values(allStats.verticalBreakdown).map(v => v.leads)) || 1
    const maxEmployees = Math.max(...Object.values(allStats.verticalBreakdown).map(v => v.employees)) || 1

    return {
      vertical: verticalConfigs[vertical].label,
      Projects: (data.projects / maxProjects) * 100,
      Leads: (data.leads / maxLeads) * 100,
      Employees: (data.employees / maxEmployees) * 100,
      Efficiency: ((data.projects / (data.employees || 1)) / 5) * 100
    }
  })

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-heading text-2xl sm:text-3xl text-primary">Super Admin Dashboard</h1>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
            ALL ACCESS
          </span>
        </div>
        <p className="font-body text-sm sm:text-base text-gray-600">
          Consolidated overview of all verticals and business operations
        </p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-subheading text-sm opacity-90 mb-1">Total Employees</h3>
          <p className="font-heading text-4xl">{allStats.totalEmployees}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-subheading text-sm opacity-90 mb-1">Total Leads</h3>
          <p className="font-heading text-4xl">{allStats.totalLeads}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-subheading text-sm opacity-90 mb-1">Total Users</h3>
          <p className="font-heading text-4xl">{allStats.totalUsers}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="font-subheading text-sm opacity-90 mb-1">Total Projects</h3>
          <p className="font-heading text-4xl">{allStats.totalProjects}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-subheading text-sm opacity-90 mb-1">Total Revenue</h3>
          <p className="font-heading text-4xl">₹{(allStats.totalRevenue / 100000).toFixed(1)}L</p>
        </motion.div>
      </div>

      {/* Vertical Quick Access Cards */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-heading text-xl sm:text-2xl text-primary mb-4">Vertical Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(verticalConfigs).map((vertical, index) => {
            const config = verticalConfigs[vertical]
            const data = allStats.verticalBreakdown[vertical]

            return (
              <motion.div
                key={vertical}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              >
                <div className={`bg-gradient-to-br ${config.color} p-4 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{config.icon}</span>
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-lg text-xs font-semibold">
                      {vertical.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-subheading text-lg font-semibold">{config.label}</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Employees</span>
                    <span className="font-semibold text-primary">{data.employees}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Leads</span>
                    <span className="font-semibold text-green-600">{data.leads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Projects</span>
                    <span className="font-semibold text-orange-600">{data.projects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="font-semibold text-blue-600">₹{(data.revenue / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Efficiency</span>
                      <span className="font-semibold">
                        {data.employees > 0 ? (data.projects / data.employees).toFixed(1) : 0} proj/emp
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
        {/* Vertical Comparison Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Vertical Performance Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={verticalComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="employees" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="leads" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="projects" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <h2 className="font-heading text-xl text-primary mb-4">Revenue Distribution by Vertical</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${(value / 100000).toFixed(2)}L`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Radar Chart */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="font-heading text-xl text-primary mb-4">Multi-Dimensional Performance Analysis</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={performanceRadarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="vertical" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Projects" dataKey="Projects" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
            <Radar name="Leads" dataKey="Leads" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Radar name="Employees" dataKey="Employees" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Radar name="Efficiency" dataKey="Efficiency" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {allStats.totalLeads > 0 ? ((allStats.totalProjects / allStats.totalLeads) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Overall Conversion Rate</h3>
          <p className="text-xs opacity-75 mt-1">Leads to Projects (All Verticals)</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">₹{(allStats.totalRevenue / allStats.totalProjects / 1000).toFixed(0)}K</span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Avg Project Value</h3>
          <p className="text-xs opacity-75 mt-1">Revenue per completed project</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">
              {allStats.totalEmployees > 0 ? (allStats.totalProjects / allStats.totalEmployees).toFixed(1) : 0}
            </span>
          </div>
          <h3 className="font-subheading text-sm opacity-90">Projects per Employee</h3>
          <p className="text-xs opacity-75 mt-1">Overall workforce efficiency</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <h2 className="font-heading text-xl text-primary mb-4">Quick Management Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'All Employees', path: '/admin/employees', icon: '👥', color: 'bg-blue-500' },
            { title: 'All Leads', path: '/admin/leads', icon: '📋', color: 'bg-green-500' },
            { title: 'All Projects', path: '/admin/projects', icon: '🏗️', color: 'bg-orange-500' },
            { title: 'System Settings', path: '/admin/settings', icon: '⚙️', color: 'bg-gray-500' }
          ].map((action, index) => (
            <Link key={index} to={action.path}>
              <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all text-center">
                <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <h3 className="font-subheading text-sm text-primary">{action.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default SuperAdminDashboard
