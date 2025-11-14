/**
 * AdminCollections Component
 *
 * Admin interface for managing payments and collections.
 * Features include payment tracking, overdue alerts, and milestone-based collections.
 */

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../components/AdminLayout'
import DatePicker from '../components/DatePicker'
import { API_ENDPOINTS } from '../config/api'
import { useServiceType } from '../contexts/ServiceTypeContext'

const AdminCollections = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { selectedServiceType } = useServiceType()

  // Get projectId from URL query params
  const queryParams = new URLSearchParams(location.search)
  const projectIdFromUrl = queryParams.get('projectId')
  const [payments, setPayments] = useState([])
  const [projects, setProjects] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const [stats, setStats] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    overduePayments: 0,
    paidPayments: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    collectionRate: 0
  })

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  // Form data
  const [formData, setFormData] = useState({
    projectId: '',
    customerId: '',
    amount: '',
    dueDate: '',
    milestone: 'advance',
    description: '',
    paymentMethod: 'bank_transfer',
    serviceType: selectedServiceType
  })

  // Mark as paid form data
  const [markPaidData, setMarkPaidData] = useState({
    paidDate: new Date().toISOString().split('T')[0],
    transactionId: '',
    paymentMethod: 'bank_transfer',
    notes: ''
  })

  const paymentStatuses = ['all', 'pending', 'overdue', 'paid', 'partially_paid']
  const milestones = ['advance', 'stage_1', 'stage_2', 'stage_3', 'final', 'other']
  const paymentMethods = ['cash', 'bank_transfer', 'cheque', 'upi', 'card', 'other']

  const getMilestoneLabel = (milestone) => {
    const labels = {
      'advance': 'Advance',
      'stage_1': 'Stage 1',
      'stage_2': 'Stage 2',
      'stage_3': 'Stage 3',
      'final': 'Final Payment',
      'other': 'Other'
    }
    return labels[milestone] || milestone
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800',
      'paid': 'bg-green-100 text-green-800',
      'partially_paid': 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'overdue': 'Overdue',
      'paid': 'Paid',
      'partially_paid': 'Partially Paid'
    }
    return labels[status] || status
  }

  // Fetch payment statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.PAYMENT_STATS}?serviceType=${selectedServiceType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error)
    }
  }

  // Fetch payments
  const fetchPayments = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        serviceType: selectedServiceType
      })

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      // Add project filter if projectId is in URL
      if (projectIdFromUrl) {
        params.append('projectId', projectIdFromUrl)
      }

      const response = await fetch(`${API_ENDPOINTS.PAYMENTS}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setPayments(data.data)
        setTotalPages(data.pagination.pages)
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      setError('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  // Fetch projects and customers for dropdowns
  const fetchProjectsAndCustomers = async () => {
    try {
      const token = localStorage.getItem('token')

      // Fetch projects
      const projectsResponse = await fetch(`${API_ENDPOINTS.PROJECTS}?serviceType=${selectedServiceType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const projectsData = await projectsResponse.json()
      if (projectsData.success) {
        setProjects(projectsData.data)
      }

      // Fetch customers
      const customersResponse = await fetch(`${API_ENDPOINTS.CUSTOMERS}?serviceType=${selectedServiceType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const customersData = await customersResponse.json()
      if (customersData.success) {
        setCustomers(customersData.data)
      }
    } catch (error) {
      console.error('Error fetching projects and customers:', error)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchPayments()
    fetchProjectsAndCustomers()
  }, [selectedServiceType, currentPage, statusFilter])

  // Reset form
  const resetForm = () => {
    setFormData({
      projectId: '',
      customerId: '',
      amount: '',
      dueDate: '',
      milestone: 'advance',
      description: '',
      paymentMethod: 'bank_transfer',
      serviceType: selectedServiceType
    })
  }

  const resetMarkPaidForm = () => {
    setMarkPaidData({
      paidDate: new Date().toISOString().split('T')[0],
      transactionId: '',
      paymentMethod: 'bank_transfer',
      notes: ''
    })
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMarkPaidInputChange = (e) => {
    const { name, value } = e.target
    setMarkPaidData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle project selection - auto-populate customer
  const handleProjectChange = (e) => {
    const projectId = e.target.value
    setFormData(prev => ({
      ...prev,
      projectId
    }))

    // Find project and auto-populate customer
    const project = projects.find(p => p._id === projectId)
    if (project && project.customerId) {
      setFormData(prev => ({
        ...prev,
        customerId: project.customerId._id || project.customerId
      }))
    }
  }

  // Create payment
  const handleCreatePayment = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.PAYMENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setShowCreateModal(false)
        resetForm()
        fetchPayments()
        fetchStats()
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      setError('Failed to create payment')
    }
  }

  // Update payment
  const handleUpdatePayment = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.PAYMENT_BY_ID(selectedPayment._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setShowEditModal(false)
        resetForm()
        setSelectedPayment(null)
        fetchPayments()
        fetchStats()
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      setError('Failed to update payment')
    }
  }

  // Mark payment as paid
  const handleMarkAsPaid = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.MARK_PAYMENT_PAID(selectedPayment._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(markPaidData)
      })

      const data = await response.json()
      if (data.success) {
        setShowMarkPaidModal(false)
        resetMarkPaidForm()
        setSelectedPayment(null)
        fetchPayments()
        fetchStats()
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error)
      setError('Failed to mark payment as paid')
    }
  }

  // Delete payment
  const handleDeletePayment = async () => {
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.PAYMENT_BY_ID(selectedPayment._id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setShowDeleteModal(false)
        setSelectedPayment(null)
        fetchPayments()
        fetchStats()
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error('Error deleting payment:', error)
      setError('Failed to delete payment')
    }
  }

  // Export payments to Excel
  const handleExportPayments = async () => {
    setIsExporting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        serviceType: selectedServiceType
      })

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      if (projectIdFromUrl) {
        params.append('projectId', projectIdFromUrl)
      }

      const response = await fetch(`${API_ENDPOINTS.EXPORT_PAYMENTS}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to export payments')
      }

      // Get the blob from response
      const blob = await response.blob()

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `Collections_Report_${new Date().toISOString().split('T')[0]}.xlsx`

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      link.download = filename
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error exporting payments:', error)
      setError('Failed to export payments to Excel')
    } finally {
      setIsExporting(false)
    }
  }

  // Open edit modal
  const openEditModal = (payment) => {
    setSelectedPayment(payment)
    setFormData({
      projectId: payment.project?._id || '',
      customerId: payment.customer?._id || '',
      amount: payment.amount,
      dueDate: payment.dueDate ? new Date(payment.dueDate).toISOString().split('T')[0] : '',
      milestone: payment.milestone,
      description: payment.description || '',
      paymentMethod: payment.paymentMethod,
      serviceType: payment.serviceType
    })
    setShowEditModal(true)
  }

  // Open mark as paid modal
  const openMarkPaidModal = (payment) => {
    setSelectedPayment(payment)
    resetMarkPaidForm()
    setShowMarkPaidModal(true)
  }

  // Filter payments by search term
  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase()
    return (
      payment.paymentId?.toLowerCase().includes(searchLower) ||
      payment.project?.title?.toLowerCase().includes(searchLower) ||
      payment.customer?.fullName?.toLowerCase().includes(searchLower) ||
      payment.milestone?.toLowerCase().includes(searchLower)
    )
  })

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

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Collections & Payments</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Track and manage payment collections</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleExportPayments}
              disabled={isExporting}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Exporting...</span>
                  <span className="sm:hidden">Export...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Download Report</span>
                  <span className="sm:hidden">Download</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                resetForm()
                setShowCreateModal(true)
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[#c69c6d] text-white rounded-lg hover:bg-[#b88c5d] transition-colors text-sm sm:text-base"
            >
              + Add Payment
            </button>
          </div>
        </div>

        {/* Project Filter Banner */}
        {projectIdFromUrl && projects.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center min-w-0 flex-1">
                <svg className="w-5 h-5 text-blue-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-800 truncate">
                    Filtering payments for project: {projects.find(p => p._id === projectIdFromUrl)?.title || 'Loading...'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1 truncate">
                    Project ID: {projects.find(p => p._id === projectIdFromUrl)?.projectId || ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/collections')}
                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0"
              >
                Clear Filter
              </button>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs sm:text-sm truncate">Total Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1 truncate">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-600">
              {stats.totalPayments} payments
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs sm:text-sm truncate">Collected</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1 truncate">{formatCurrency(stats.paidAmount)}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-600">
              {stats.paidPayments} paid
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs sm:text-sm truncate">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1 truncate">{formatCurrency(stats.pendingAmount)}</p>
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-600">
              {stats.pendingPayments} pending
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs sm:text-sm truncate">Collection Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">{stats.collectionRate}%</p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-600">
              {stats.overduePayments} overdue
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="paid">Paid</option>
                <option value="partially_paid">Partially Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c69c6d]"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new payment record.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payment ID</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Customer</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Milestone</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell whitespace-nowrap">Due Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.paymentId}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                        {payment.project?.title || 'N/A'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 hidden md:table-cell max-w-[150px] truncate">
                        {payment.customer?.fullName || 'N/A'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {getMilestoneLabel(payment.milestone)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                        {formatDate(payment.dueDate)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {getStatusLabel(payment.status)}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          {payment.status !== 'paid' && (
                            <button
                              onClick={() => openMarkPaidModal(payment)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Mark as Paid"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedPayment(payment)
                              setShowDetailsModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(payment)}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPayment(payment)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Payment Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Payment</h2>
                  <form onSubmit={handleCreatePayment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="projectId"
                          value={formData.projectId}
                          onChange={handleProjectChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        >
                          <option value="">Select Project</option>
                          {projects.map(project => (
                            <option key={project._id} value={project._id}>
                              {project.projectId} - {project.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="customerId"
                          value={formData.customerId}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        >
                          <option value="">Select Customer</option>
                          {customers.map(customer => (
                            <option key={customer._id} value={customer._id}>
                              {customer.fullName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Milestone <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="milestone"
                          value={formData.milestone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        >
                          {milestones.map(milestone => (
                            <option key={milestone} value={milestone}>
                              {getMilestoneLabel(milestone)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Method
                        </label>
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        >
                          {paymentMethods.map(method => (
                            <option key={method} value={method}>
                              {method.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#c69c6d] text-white rounded-lg hover:bg-[#b88c5d]"
                      >
                        Create Payment
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Payment Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Payment</h2>
                  <form onSubmit={handleUpdatePayment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Milestone <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="milestone"
                          value={formData.milestone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        >
                          {milestones.map(milestone => (
                            <option key={milestone} value={milestone}>
                              {getMilestoneLabel(milestone)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Method
                        </label>
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        >
                          {paymentMethods.map(method => (
                            <option key={method} value={method}>
                              {method.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#c69c6d] text-white rounded-lg hover:bg-[#b88c5d]"
                      >
                        Update Payment
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mark as Paid Modal */}
        <AnimatePresence>
          {showMarkPaidModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowMarkPaidModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Mark Payment as Paid</h2>
                  <form onSubmit={handleMarkAsPaid}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Paid Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="paidDate"
                          value={markPaidData.paidDate}
                          onChange={handleMarkPaidInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transaction ID
                        </label>
                        <input
                          type="text"
                          name="transactionId"
                          value={markPaidData.transactionId}
                          onChange={handleMarkPaidInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Method
                        </label>
                        <select
                          name="paymentMethod"
                          value={markPaidData.paymentMethod}
                          onChange={handleMarkPaidInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        >
                          {paymentMethods.map(method => (
                            <option key={method} value={method}>
                              {method.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          name="notes"
                          value={markPaidData.notes}
                          onChange={handleMarkPaidInputChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowMarkPaidModal(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Mark as Paid
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Payment ID</p>
                        <p className="font-semibold">{selectedPayment.paymentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                          {getStatusLabel(selectedPayment.status)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Project</p>
                        <p className="font-semibold">{selectedPayment.project?.title || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-semibold">{selectedPayment.customer?.fullName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-semibold text-lg">{formatCurrency(selectedPayment.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Milestone</p>
                        <p className="font-semibold">{getMilestoneLabel(selectedPayment.milestone)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-semibold">{formatDate(selectedPayment.dueDate)}</p>
                      </div>
                      {selectedPayment.paidDate && (
                        <div>
                          <p className="text-sm text-gray-500">Paid Date</p>
                          <p className="font-semibold">{formatDate(selectedPayment.paidDate)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-semibold">{selectedPayment.paymentMethod?.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      {selectedPayment.transactionId && (
                        <div>
                          <p className="text-sm text-gray-500">Transaction ID</p>
                          <p className="font-semibold">{selectedPayment.transactionId}</p>
                        </div>
                      )}
                      {selectedPayment.collectedBy && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Collected By</p>
                          <p className="font-semibold">{selectedPayment.collectedBy.fullName || 'N/A'}</p>
                        </div>
                      )}
                      {selectedPayment.description && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-semibold">{selectedPayment.description}</p>
                        </div>
                      )}
                      {selectedPayment.notes && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="font-semibold">{selectedPayment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Delete</h2>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this payment record? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeletePayment}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminCollections
