/**
 * ODS Services Management Page
 *
 * Manage on-demand services catalog
 * Features: Add, Edit, Delete services, Manage pricing, features
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'

const ODSServicesManagement = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    images: [],
    pricing: {
      type: 'fixed',
      basePrice: 0,
      hourlyRate: 0,
      minCharge: 0
    },
    features: [],
    timeSlots: ['morning', 'afternoon', 'evening'],
    estimatedDuration: 60,
    popular: false,
    trending: false,
    active: true
  })

  const [newFeature, setNewFeature] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')

  const categories = [
    'Home Services', 'Repairs', 'Cleaning', 'Beauty', 'Health',
    'Electronics', 'Automotive', 'Others'
  ]

  useEffect(() => {
    fetchServices()
  }, [categoryFilter, statusFilter, searchQuery])

  const fetchServices = async () => {
    setLoading(true)
    try {
      let url = `${API_ENDPOINTS.ON_DEMAND_SERVICES}?`

      if (categoryFilter !== 'all') url += `category=${categoryFilter}&`
      if (statusFilter !== 'all') url += `active=${statusFilter === 'active'}&`
      if (searchQuery) url += `search=${searchQuery}&`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setServices(data.data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.ON_DEMAND_SERVICE_CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()

      if (data.success) {
        alert('Service added successfully!')
        setShowAddModal(false)
        resetForm()
        fetchServices()
      } else {
        alert(data.message || 'Failed to add service')
      }
    } catch (error) {
      console.error('Error adding service:', error)
      alert('Error adding service')
    }
  }

  const handleUpdateService = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.ON_DEMAND_SERVICE_UPDATE(selectedService._id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()

      if (data.success) {
        alert('Service updated successfully!')
        setShowEditModal(false)
        fetchServices()
      } else {
        alert(data.message || 'Failed to update service')
      }
    } catch (error) {
      console.error('Error updating service:', error)
      alert('Error updating service')
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.ON_DEMAND_SERVICE_DELETE(serviceId), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        alert('Service deleted successfully!')
        fetchServices()
      } else {
        alert(data.message || 'Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error deleting service')
    }
  }

  const handleToggleActive = async (serviceId, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.ON_DEMAND_SERVICE_UPDATE(serviceId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: !currentStatus })
      })
      const data = await response.json()

      if (data.success) {
        fetchServices()
      } else {
        alert(data.message || 'Failed to update service')
      }
    } catch (error) {
      console.error('Error toggling service:', error)
      alert('Error toggling service')
    }
  }

  const openEditModal = (service) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      pricing: service.pricing,
      features: service.features || [],
      timeSlots: service.timeSlots || ['morning', 'afternoon', 'evening'],
      estimatedDuration: service.estimatedDuration || 60,
      popular: service.popular || false,
      trending: service.trending || false,
      active: service.active
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      image: '',
      images: [],
      pricing: {
        type: 'fixed',
        basePrice: 0,
        hourlyRate: 0,
        minCharge: 0
      },
      features: [],
      timeSlots: ['morning', 'afternoon', 'evening'],
      estimatedDuration: 60,
      popular: false,
      trending: false,
      active: true
    })
    setNewFeature('')
    setNewImageUrl('')
  }

  const handleAddSliderImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const handleRemoveSliderImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleTimeSlotToggle = (slot) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.includes(slot)
        ? prev.timeSlots.filter(s => s !== slot)
        : [...prev.timeSlots, slot]
    }))
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Services Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage on-demand services catalog
            </p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium shadow-lg"
          >
            + Add Service
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Services
              </label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
                <option value="all">All Services</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No services found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Service Image */}
                {service.image && (
                  <div className="h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.title || service.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>'
                      }}
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Badges */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    service.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                  {service.popular && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      ⭐ Popular
                    </span>
                  )}
                  {service.trending && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      🔥 Trending
                    </span>
                  )}
                </div>

                {/* Service Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>

                <div className="space-y-2 text-sm mb-4">
                  <p className="flex items-center">
                    <span className="text-gray-600 mr-2">📁</span>
                    <span className="font-medium">{service.category}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 mr-2">💰</span>
                    <span className="font-medium">
                      {service.pricing?.type === 'fixed'
                        ? `₹${service.pricing.basePrice} fixed`
                        : `₹${service.pricing.hourlyRate}/hr`
                      }
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 mr-2">⏱️</span>
                    <span className="font-medium">{service.estimatedDuration || 60} min</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 mr-2">⭐</span>
                    <span className="font-medium">{service.rating?.average?.toFixed(1) || 'New'} ({service.rating?.count || 0})</span>
                  </p>
                </div>

                {/* Features Preview */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{service.features.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedService(service)
                      setShowDetailsModal(true)
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(service)}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(service._id, service.active)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      service.active
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {service.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Service Modal */}
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
                    {showAddModal ? 'Add New Service' : 'Edit Service'}
                  </h2>

                  <form onSubmit={showAddModal ? handleAddService : handleUpdateService}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          required
                          rows="3"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Image URL *
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://example.com/image.jpg"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter a valid image URL. You can use free images from{' '}
                          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                            Unsplash
                          </a>
                          {' '}or{' '}
                          <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                            Pexels
                          </a>
                        </p>
                        {formData.image && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Image Preview:</p>
                            <img
                              src={formData.image}
                              alt="Service preview"
                              className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'block'
                              }}
                            />
                            <div className="hidden text-sm text-red-600 mt-1">
                              Invalid image URL. Please check the URL and try again.
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Slider Images Section */}
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Images for Slider (Optional)
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddSliderImage()
                              }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddSliderImage}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                          >
                            Add Image
                          </button>
                        </div>

                        {/* Display added images */}
                        {formData.images && formData.images.length > 0 && (
                          <div className="space-y-2 mb-3">
                            <p className="text-sm font-medium text-gray-700">
                              Slider Images ({formData.images.length})
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {formData.images.map((imageUrl, idx) => (
                                <div key={idx} className="relative group">
                                  <div className="relative h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                                    <img
                                      src={imageUrl}
                                      alt={`Slider ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                      }}
                                    />
                                    <div className="hidden items-center justify-center h-full bg-gray-100 text-gray-400 text-xs">
                                      Invalid URL
                                    </div>
                                    {/* Remove button overlay */}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSliderImage(idx)}
                                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                    {/* Image number */}
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                                      #{idx + 1}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-500">
                          Add multiple images to create a beautiful slider on the service detail page. The main image will be shown first.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated Duration (minutes) *
                        </label>
                        <input
                          type="number"
                          required
                          min="15"
                          value={formData.estimatedDuration}
                          onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Pricing */}
                      <div className="col-span-full">
                        <h3 className="font-semibold text-gray-900 mb-3">Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pricing Type *
                            </label>
                            <select
                              required
                              value={formData.pricing.type}
                              onChange={(e) => setFormData({
                                ...formData,
                                pricing: { ...formData.pricing, type: e.target.value }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="fixed">Fixed Price</option>
                              <option value="hourly">Hourly Rate</option>
                            </select>
                          </div>

                          {formData.pricing.type === 'fixed' ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Base Price (₹) *
                              </label>
                              <input
                                type="number"
                                required
                                min="0"
                                value={formData.pricing.basePrice}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  pricing: { ...formData.pricing, basePrice: parseInt(e.target.value) }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          ) : (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Hourly Rate (₹) *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={formData.pricing.hourlyRate}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    pricing: { ...formData.pricing, hourlyRate: parseInt(e.target.value) }
                                  })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Minimum Charge (₹) *
                                </label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={formData.pricing.minCharge}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    pricing: { ...formData.pricing, minCharge: parseInt(e.target.value) }
                                  })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Features
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            placeholder="Add a feature..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddFeature}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2"
                            >
                              {feature}
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(idx)}
                                className="text-purple-600 hover:text-purple-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Available Time Slots
                        </label>
                        <div className="flex gap-4">
                          {['morning', 'afternoon', 'evening'].map(slot => (
                            <label key={slot} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.timeSlots.includes(slot)}
                                onChange={() => handleTimeSlotToggle(slot)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700 capitalize">{slot}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="col-span-full">
                        <div className="flex gap-6">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.popular}
                              onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Mark as Popular</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.trending}
                              onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Mark as Trending</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.active}
                              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
                      >
                        {showAddModal ? 'Add Service' : 'Update Service'}
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
          {showDetailsModal && selectedService && (
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
                      <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
                      <p className="text-gray-500 mt-1">Service ID: {selectedService.serviceId || selectedService._id}</p>
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

                  {/* Badges */}
                  <div className="flex gap-2 mb-6">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedService.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedService.active ? 'Active' : 'Inactive'}
                    </span>
                    {selectedService.popular && (
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        ⭐ Popular
                      </span>
                    )}
                    {selectedService.trending && (
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                        🔥 Trending
                      </span>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedService.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                        <p className="text-gray-700">{selectedService.category}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Duration</h3>
                        <p className="text-gray-700">{selectedService.estimatedDuration || 60} minutes</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                      <p className="text-gray-700">
                        {selectedService.pricing?.type === 'fixed'
                          ? `₹${selectedService.pricing.basePrice} (Fixed)`
                          : `₹${selectedService.pricing.hourlyRate}/hour (Min: ₹${selectedService.pricing.minCharge})`
                        }
                      </p>
                    </div>

                    {selectedService.features && selectedService.features.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedService.features.map((feature, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Available Time Slots</h3>
                      <div className="flex gap-2">
                        {selectedService.timeSlots?.map((slot, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Rating</h3>
                      <p className="text-gray-700">
                        ⭐ {selectedService.rating?.average?.toFixed(1) || 'New'} ({selectedService.rating?.count || 0} reviews)
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        openEditModal(selectedService)
                      }}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      Edit Service
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
      </div>
    </AdminLayout>
  )
}

export default ODSServicesManagement
