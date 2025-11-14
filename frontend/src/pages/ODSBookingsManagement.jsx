/**
 * ODS Bookings Management Page
 *
 * Comprehensive booking management for On-Demand Services
 * Features: View all bookings, filter, search, assign providers, update status
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'

const ODSBookingsManagement = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [availableProviders, setAvailableProviders] = useState([])

  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchBookings()
  }, [statusFilter, pagination.page, searchQuery])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let url = `${API_ENDPOINTS.ON_DEMAND_BOOKINGS}?page=${pagination.page}&limit=${pagination.limit}`

      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`
      }
      if (searchQuery) {
        url += `&search=${searchQuery}`
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        setBookings(data.data)
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }))
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableProviders = async (serviceId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.PROVIDERS_AVAILABLE(serviceId), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setAvailableProviders(data.data)
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
    }
  }

  const handleAssignProvider = async (providerId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_ENDPOINTS.ON_DEMAND_BOOKINGS}/${selectedBooking._id}/assign-provider`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ providerId })
        }
      )
      const data = await response.json()

      if (data.success) {
        alert('Provider assigned successfully!')
        setShowAssignModal(false)
        fetchBookings()
      } else {
        alert(data.message || 'Failed to assign provider')
      }
    } catch (error) {
      console.error('Error assigning provider:', error)
      alert('Error assigning provider')
    }
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_ENDPOINTS.ON_DEMAND_BOOKINGS}/${bookingId}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      )
      const data = await response.json()

      if (data.success) {
        alert('Status updated successfully!')
        fetchBookings()
      } else {
        alert(data.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    }
  }

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  const openAssignModal = (booking) => {
    setSelectedBooking(booking)
    fetchAvailableProviders(booking.serviceId._id)
    setShowAssignModal(true)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      provider_assigned: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      provider_on_way: 'bg-purple-100 text-purple-800 border-purple-300',
      in_progress: 'bg-orange-100 text-orange-800 border-orange-300',
      work_completed: 'bg-teal-100 text-teal-800 border-teal-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled_by_customer: 'bg-red-100 text-red-800 border-red-300',
      cancelled_by_provider: 'bg-red-100 text-red-800 border-red-300',
      cancelled_by_admin: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    return timeString
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bookings Management
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all on-demand service bookings
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Bookings
              </label>
              <input
                type="text"
                placeholder="Search by ID, customer name, phone..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="provider_assigned">Provider Assigned</option>
                <option value="provider_on_way">Provider On Way</option>
                <option value="in_progress">In Progress</option>
                <option value="work_completed">Work Completed</option>
                <option value="completed">Completed</option>
                <option value="cancelled_by_customer">Cancelled by Customer</option>
                <option value="cancelled_by_provider">Cancelled by Provider</option>
              </select>
            </div>

            {/* Stats Summary */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <p className="font-semibold">Total: {pagination.total} bookings</p>
                <p>Page {pagination.page} of {pagination.pages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.serviceId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.scheduledDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(booking.timeSlot?.start)} - {formatTime(booking.timeSlot?.end)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.assignedProvider ? (
                          <div>
                            <div className="text-gray-900 font-medium">
                              {booking.assignedProvider.fullName}
                            </div>
                            <div className="text-gray-500">
                              {booking.assignedProvider.phone}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => openAssignModal(booking)}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Assign Provider
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                          {formatStatus(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{booking.pricing?.total || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => openDetailsModal(booking)}
                          className="text-purple-600 hover:text-purple-800 font-medium mr-3"
                        >
                          View
                        </button>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'confirmed')}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Confirm
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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
          </div>
        )}

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedBooking && (
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
                      <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                      <p className="text-gray-500 mt-1">ID: {selectedBooking.bookingId}</p>
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

                  {/* Status Badge */}
                  <div className="mb-6">
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(selectedBooking.status)}`}>
                      {formatStatus(selectedBooking.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedBooking.customer.name}</span></p>
                        <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedBooking.customer.email}</span></p>
                        <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{selectedBooking.customer.phone}</span></p>
                        {selectedBooking.customer.alternatePhone && (
                          <p><span className="text-gray-600">Alt Phone:</span> <span className="font-medium">{selectedBooking.customer.alternatePhone}</span></p>
                        )}
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Service Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Service:</span> <span className="font-medium">{selectedBooking.serviceId?.name}</span></p>
                        <p><span className="text-gray-600">Category:</span> <span className="font-medium">{selectedBooking.serviceId?.category}</span></p>
                        <p><span className="text-gray-600">Date:</span> <span className="font-medium">{formatDate(selectedBooking.scheduledDate)}</span></p>
                        <p><span className="text-gray-600">Time:</span> <span className="font-medium">{formatTime(selectedBooking.timeSlot?.start)} - {formatTime(selectedBooking.timeSlot?.end)}</span></p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Service Address</h3>
                      <div className="space-y-2 text-sm">
                        <p>{selectedBooking.serviceAddress.addressLine1}</p>
                        {selectedBooking.serviceAddress.addressLine2 && (
                          <p>{selectedBooking.serviceAddress.addressLine2}</p>
                        )}
                        <p>{selectedBooking.serviceAddress.city}, {selectedBooking.serviceAddress.state}</p>
                        <p>PIN: {selectedBooking.serviceAddress.pincode}</p>
                      </div>
                    </div>

                    {/* Provider Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Provider Information</h3>
                      {selectedBooking.assignedProvider ? (
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedBooking.assignedProvider.fullName}</span></p>
                          <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{selectedBooking.assignedProvider.phone}</span></p>
                          <p><span className="text-gray-600">Rating:</span> <span className="font-medium">⭐ {selectedBooking.assignedProvider.rating?.average || 'N/A'}</span></p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No provider assigned yet</p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-50 p-4 rounded-lg col-span-full">
                      <h3 className="font-semibold text-gray-900 mb-3">Pricing Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Charge:</span>
                          <span className="font-medium">₹{selectedBooking.pricing?.serviceCharge || 0}</span>
                        </div>
                        {selectedBooking.pricing?.additionalCharges > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Additional Charges:</span>
                            <span className="font-medium">₹{selectedBooking.pricing.additionalCharges}</span>
                          </div>
                        )}
                        {selectedBooking.pricing?.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span className="font-medium">-₹{selectedBooking.pricing.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-300 text-lg font-bold">
                          <span>Total:</span>
                          <span>₹{selectedBooking.pricing?.total || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className={`font-medium ${selectedBooking.payment?.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                            {selectedBooking.payment?.status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    {!selectedBooking.assignedProvider && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false)
                          openAssignModal(selectedBooking)
                        }}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                      >
                        Assign Provider
                      </button>
                    )}
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

        {/* Assign Provider Modal */}
        <AnimatePresence>
          {showAssignModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAssignModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Assign Service Provider</h2>

                  {availableProviders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No available providers for this service
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {availableProviders.map((provider) => (
                        <div
                          key={provider._id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 cursor-pointer"
                          onClick={() => handleAssignProvider(provider._id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{provider.fullName}</h3>
                              <p className="text-sm text-gray-600 mt-1">{provider.phone}</p>
                              <p className="text-sm text-gray-600">{provider.email}</p>
                              <div className="mt-2">
                                <span className="text-sm text-gray-500">Rating: </span>
                                <span className="text-sm font-medium">⭐ {provider.rating?.average || 'New'} ({provider.rating?.count || 0} reviews)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                provider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {provider.status}
                              </span>
                              <p className="text-sm text-gray-500 mt-2">
                                {provider.completedJobs || 0} jobs completed
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
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

export default ODSBookingsManagement
