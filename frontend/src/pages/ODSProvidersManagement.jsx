/**
 * ODS Service Providers Management Page
 *
 * Complete provider management for On-Demand Services
 * Features: Add, Edit, Verify, Manage availability, Update status
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'

const ODSProvidersManagement = () => {
  const [providers, setProviders] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState(null)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    alternatePhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    services: [],
    experienceYears: 0,
    availability: {
      monday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
      tuesday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
      wednesday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
      thursday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
      friday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
      saturday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
      sunday: { available: false, timeSlots: [] }
    }
  })

  useEffect(() => {
    fetchProviders()
    fetchServices()
  }, [statusFilter, serviceFilter, pagination.page, searchQuery])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let url = `${API_ENDPOINTS.SERVICE_PROVIDERS}?page=${pagination.page}&limit=${pagination.limit}`

      if (statusFilter !== 'all') url += `&status=${statusFilter}`
      if (serviceFilter !== 'all') url += `&service=${serviceFilter}`
      if (searchQuery) url += `&search=${searchQuery}`

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        setProviders(data.data)
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }))
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ON_DEMAND_SERVICES)
      const data = await response.json()
      if (data.success) {
        setServices(data.data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const handleAddProvider = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER_CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()

      if (data.success) {
        alert('Provider added successfully!')
        setShowAddModal(false)
        resetForm()
        fetchProviders()
      } else {
        alert(data.message || 'Failed to add provider')
      }
    } catch (error) {
      console.error('Error adding provider:', error)
      alert('Error adding provider')
    }
  }

  const handleUpdateProvider = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER_UPDATE(selectedProvider._id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()

      if (data.success) {
        alert('Provider updated successfully!')
        setShowEditModal(false)
        fetchProviders()
      } else {
        alert(data.message || 'Failed to update provider')
      }
    } catch (error) {
      console.error('Error updating provider:', error)
      alert('Error updating provider')
    }
  }

  const handleStatusChange = async (providerId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER_UPDATE_STATUS(providerId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()

      if (data.success) {
        alert('Status updated successfully!')
        fetchProviders()
      } else {
        alert(data.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    }
  }

  const handleVerifyDocuments = async (providerId, verified) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER_VERIFY_DOCS(providerId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verified })
      })
      const data = await response.json()

      if (data.success) {
        alert(`Documents ${verified ? 'verified' : 'rejected'} successfully!`)
        setShowDocumentsModal(false)
        fetchProviders()
      } else {
        alert(data.message || 'Failed to update document verification')
      }
    } catch (error) {
      console.error('Error verifying documents:', error)
      alert('Error verifying documents')
    }
  }

  const handleDeleteProvider = async (providerId) => {
    if (!confirm('Are you sure you want to delete this provider?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER_DELETE(providerId), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        alert('Provider deleted successfully!')
        fetchProviders()
      } else {
        alert(data.message || 'Failed to delete provider')
      }
    } catch (error) {
      console.error('Error deleting provider:', error)
      alert('Error deleting provider')
    }
  }

  const openEditModal = (provider) => {
    setSelectedProvider(provider)
    setFormData({
      fullName: provider.fullName,
      email: provider.email,
      phone: provider.phone,
      alternatePhone: provider.alternatePhone || '',
      address: provider.address,
      services: provider.services.map(s => s._id || s),
      experienceYears: provider.experienceYears,
      availability: provider.availability
    })
    setShowEditModal(true)
  }

  const openDocumentsModal = (provider) => {
    setSelectedProvider(provider)
    setShowDocumentsModal(true)
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      alternatePhone: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      services: [],
      experienceYears: 0,
      availability: {
        monday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        tuesday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        wednesday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        thursday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        friday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        saturday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        sunday: { available: false, timeSlots: [] }
      }
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-300',
      inactive: 'bg-gray-100 text-gray-800 border-gray-300',
      pending_verification: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      suspended: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }))
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Service Providers Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage on-demand service providers
            </p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium shadow-lg"
          >
            + Add Provider
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Providers
              </label>
              <input
                type="text"
                placeholder="Search by name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Service
              </label>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Services</option>
                {services.map(service => (
                  <option key={service._id} value={service._id}>{service.name}</option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <p className="font-semibold">Total: {pagination.total} providers</p>
                <p>Page {pagination.page} of {pagination.pages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : providers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No providers found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <motion.div
                  key={provider._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(provider.status)}`}>
                      {formatStatus(provider.status)}
                    </span>
                    <div className="text-yellow-500 text-lg">
                      ⭐ {provider.rating?.average?.toFixed(1) || 'New'}
                    </div>
                  </div>

                  {/* Provider Info */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{provider.fullName}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center">
                      <span className="mr-2">📧</span>
                      {provider.email}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">📱</span>
                      {provider.phone}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">💼</span>
                      {provider.experienceYears} years experience
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">✅</span>
                      {provider.completedJobs || 0} jobs completed
                    </p>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.services.slice(0, 3).map((service, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                          {service.name || service}
                        </span>
                      ))}
                      {provider.services.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{provider.services.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Documents Status */}
                  {provider.documents && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Documents:</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        provider.documents.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {provider.documents.verified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedProvider(provider)
                        setShowDetailsModal(true)
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openEditModal(provider)}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium"
                    >
                      Edit
                    </button>
                    {provider.documents && !provider.documents.verified && (
                      <button
                        onClick={() => openDocumentsModal(provider)}
                        className="col-span-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                      >
                        Verify Documents
                      </button>
                    )}
                    <div className="col-span-2">
                      <select
                        value={provider.status}
                        onChange={(e) => handleStatusChange(provider._id, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="active">Set Active</option>
                        <option value="inactive">Set Inactive</option>
                        <option value="pending_verification">Pending Verification</option>
                        <option value="suspended">Suspend</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Add/Edit Provider Modal */}
        <AnimatePresence>
          {(showAddModal || showEditModal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowAddModal(false)
                setShowEditModal(false)
              }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {showAddModal ? 'Add New Provider' : 'Edit Provider'}
                  </h2>

                  <form onSubmit={showAddModal ? handleAddProvider : handleUpdateProvider}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="10-digit phone number"
                          maxLength={10}
                        />
                      </div>

                      {showAddModal && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter password for provider login"
                            minLength={6}
                          />
                          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters. Provider will use this to login to the app.</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alternate Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.alternatePhone}
                          onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experience (Years) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={formData.experienceYears}
                          onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Address */}
                      <div className="col-span-full">
                        <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Street *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.address.street}
                              onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, street: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.address.city}
                              onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, city: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.address.state}
                              onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, state: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pincode *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.address.pincode}
                              onChange={(e) => setFormData({
                                ...formData,
                                address: { ...formData.address, pincode: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Services * (Select at least one)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {services.map(service => (
                            <label key={service._id} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.services.includes(service._id)}
                                onChange={() => handleServiceToggle(service._id)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">{service.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
                      >
                        {showAddModal ? 'Add Provider' : 'Update Provider'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false)
                          setShowEditModal(false)
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedProvider && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedProvider.fullName}</h2>
                      <p className="text-gray-500 mt-1">Provider ID: {selectedProvider._id}</p>
                    </div>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedProvider.email}</span></p>
                        <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{selectedProvider.phone}</span></p>
                        {selectedProvider.alternatePhone && (
                          <p><span className="text-gray-600">Alt Phone:</span> <span className="font-medium">{selectedProvider.alternatePhone}</span></p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Performance</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Rating:</span> <span className="font-medium">⭐ {selectedProvider.rating?.average?.toFixed(1) || 'New'}</span></p>
                        <p><span className="text-gray-600">Reviews:</span> <span className="font-medium">{selectedProvider.rating?.count || 0}</span></p>
                        <p><span className="text-gray-600">Completed Jobs:</span> <span className="font-medium">{selectedProvider.completedJobs || 0}</span></p>
                        <p><span className="text-gray-600">Experience:</span> <span className="font-medium">{selectedProvider.experienceYears} years</span></p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg col-span-full">
                      <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
                      <p className="text-sm">
                        {selectedProvider.address.street}, {selectedProvider.address.city}, {selectedProvider.address.state} - {selectedProvider.address.pincode}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg col-span-full">
                      <h3 className="font-semibold text-gray-900 mb-3">Services Offered</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProvider.services.map((service, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                            {service.name || service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        openEditModal(selectedProvider)
                      }}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Edit Provider
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(selectedProvider._id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Delete Provider
                    </button>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Documents Verification Modal */}
        <AnimatePresence>
          {showDocumentsModal && selectedProvider && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDocumentsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Provider Documents</h2>
                  <p className="text-gray-600 mb-4">Provider: <span className="font-semibold">{selectedProvider.fullName}</span></p>

                  {selectedProvider.documents ? (
                    <div className="space-y-4">
                      {selectedProvider.documents.idProof && (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold mb-2">ID Proof</h3>
                          <p className="text-sm text-gray-600">{selectedProvider.documents.idProof}</p>
                        </div>
                      )}
                      {selectedProvider.documents.addressProof && (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold mb-2">Address Proof</h3>
                          <p className="text-sm text-gray-600">{selectedProvider.documents.addressProof}</p>
                        </div>
                      )}
                      {selectedProvider.documents.certificates?.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold mb-2">Certificates</h3>
                          {selectedProvider.documents.certificates.map((cert, idx) => (
                            <p key={idx} className="text-sm text-gray-600">{cert}</p>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => handleVerifyDocuments(selectedProvider._id, true)}
                          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                        >
                          ✓ Verify Documents
                        </button>
                        <button
                          onClick={() => handleVerifyDocuments(selectedProvider._id, false)}
                          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
                        >
                          ✗ Reject Documents
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
                  )}

                  <button
                    onClick={() => setShowDocumentsModal(false)}
                    className="w-full mt-4 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default ODSProvidersManagement
