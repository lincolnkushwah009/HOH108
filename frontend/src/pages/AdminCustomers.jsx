import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import { API_ENDPOINTS, API_URL } from '../config/api';

// Modal component - defined outside to prevent recreation on each render
const Modal = ({ show, onClose, title, children }) => (
  <AnimatePresence mode="wait">
    {show && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
              <h3 className="text-xl sm:text-2xl font-bold text-[#2c2420]">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [assignType, setAssignType] = useState(''); // 'crm' or 'designer'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'customer123',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    assignedCRM: '',
    assignedDesigner: ''
  });

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      let url = `${API_ENDPOINTS.CUSTOMERS}?page=${currentPage}&limit=10`;
      if (searchTerm) url += `&search=${searchTerm}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCustomers(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  // Fetch employees (CRM and Designers)
  const fetchEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.EMPLOYEES}?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, []);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CUSTOMERS_STATS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Fetch employees and stats only once on mount
  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, [fetchEmployees, fetchStats]);

  // Fetch customers when page or search changes
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: 'customer123',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      assignedCRM: '',
      assignedDesigner: ''
    });
    setError('');
  };

  // Handle create customer
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CUSTOMERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setShowCreateModal(false);
        resetForm();
        fetchCustomers();
        fetchStats();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      setError('Failed to create customer');
    }
  };

  // Handle edit customer
  const handleEditCustomer = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CUSTOMER_BY_ID(selectedCustomer._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setShowEditModal(false);
        resetForm();
        setSelectedCustomer(null);
        fetchCustomers();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      setError('Failed to update customer');
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = async () => {
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CUSTOMER_BY_ID(selectedCustomer._id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setShowDeleteModal(false);
        setSelectedCustomer(null);
        fetchCustomers();
        fetchStats();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Failed to delete customer');
    }
  };

  // Handle assign CRM/Designer
  const handleAssign = async (employeeId) => {
    setError('');

    try {
      const token = localStorage.getItem('token');
      const body = assignType === 'crm' ? { crmId: employeeId } : { designerId: employeeId };
      const endpoint = assignType === 'crm'
        ? API_ENDPOINTS.CUSTOMER_ASSIGN_CRM(selectedCustomer._id)
        : API_ENDPOINTS.CUSTOMER_ASSIGN_DESIGNER(selectedCustomer._id);

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        setShowAssignModal(false);
        setSelectedCustomer(null);
        setAssignType('');
        fetchCustomers();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error assigning:', error);
      setError('Failed to assign');
    }
  };

  // Open edit modal
  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      fullName: customer.fullName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      assignedCRM: customer.assignedCRM?._id || '',
      assignedDesigner: customer.assignedDesigner?._id || ''
    });
    setShowEditModal(true);
  };

  // Open assign modal
  const openAssignModal = (customer, type) => {
    setSelectedCustomer(customer);
    setAssignType(type);
    setShowAssignModal(true);
  };

  // Open change password modal
  const openChangePasswordModal = (customer) => {
    setSelectedCustomer(customer);
    setNewPassword('');
    setShowChangePasswordModal(true);
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Customers are users, so we use the user ID directly
      const response = await fetch(API_ENDPOINTS.USER_CHANGE_PASSWORD(selectedCustomer._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await response.json();

      if (data.success) {
        setShowChangePasswordModal(false);
        setSelectedCustomer(null);
        setNewPassword('');
        setError('');
        alert('Password changed successfully');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
    }
  };

  // Filter employees by role
  const getCRMs = () => employees.filter(emp => emp.role === 'crm');
  const getDesigners = () => employees.filter(emp => emp.role === 'designer');

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2c2420] mb-2">Customer Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage customers and assign CRM & Designers</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#2c2420] to-[#c69c6d] text-white rounded-lg hover:shadow-lg transition-all"
          >
            + Add Customer
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#2c2420]">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-1">Verified KYC</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.verifiedKYC}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-1">Pending KYC</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.pendingKYC}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c69c6d] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
              <p className="mt-2 text-gray-600">Create your first customer to get started.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Customer ID</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">CRM</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Designer</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Projects</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.customerId}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.fullName}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-600 max-w-[200px] truncate" title={customer.email}>
                          {customer.email}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                          {customer.phone}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm">
                          {customer.assignedCRM ? (
                            <span className="text-gray-900">{customer.assignedCRM.fullName}</span>
                          ) : (
                            <button
                              onClick={() => openAssignModal(customer, 'crm')}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Assign
                            </button>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm">
                          {customer.assignedDesigner ? (
                            <span className="text-gray-900">{customer.assignedDesigner.fullName}</span>
                          ) : (
                            <button
                              onClick={() => openAssignModal(customer, 'designer')}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Assign
                            </button>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {customer.projects?.length || 0}
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-col space-y-1">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal(customer)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-800 font-medium text-xs"
                              >
                                Delete
                              </button>
                            </div>
                            <button
                              onClick={() => openChangePasswordModal(customer)}
                              className="text-green-600 hover:text-green-800 font-medium text-xs text-left"
                            >
                              Change Password
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Create Customer Modal */}
        <Modal
          show={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          title="Create New Customer"
        >
          <form onSubmit={handleCreateCustomer} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (default: customer123)
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign CRM
                </label>
                <select
                  name="assignedCRM"
                  value={formData.assignedCRM}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                >
                  <option value="">Select CRM</option>
                  {getCRMs().map(crm => (
                    <option key={crm._id} value={crm._id}>{crm.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Designer
                </label>
                <select
                  name="assignedDesigner"
                  value={formData.assignedDesigner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                >
                  <option value="">Select Designer</option>
                  {getDesigners().map(designer => (
                    <option key={designer._id} value={designer._id}>{designer.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#2c2420] to-[#c69c6d] text-white rounded-lg hover:shadow-lg"
              >
                Create Customer
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Customer Modal */}
        <Modal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            resetForm();
            setSelectedCustomer(null);
          }}
          title="Edit Customer"
        >
          <form onSubmit={handleEditCustomer} className="space-y-6">
            {/* Same form fields as create modal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign CRM
                </label>
                <select
                  name="assignedCRM"
                  value={formData.assignedCRM}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                >
                  <option value="">Select CRM</option>
                  {getCRMs().map(crm => (
                    <option key={crm._id} value={crm._id}>{crm.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Designer
                </label>
                <select
                  name="assignedDesigner"
                  value={formData.assignedDesigner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                >
                  <option value="">Select Designer</option>
                  {getDesigners().map(designer => (
                    <option key={designer._id} value={designer._id}>{designer.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                  setSelectedCustomer(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#2c2420] to-[#c69c6d] text-white rounded-lg hover:shadow-lg"
              >
                Update Customer
              </button>
            </div>
          </form>
        </Modal>

        {/* Assign Modal */}
        <Modal
          show={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedCustomer(null);
            setAssignType('');
          }}
          title={`Assign ${assignType === 'crm' ? 'CRM' : 'Designer'}`}
        >
          <div className="space-y-4">
            {assignType === 'crm' ? (
              getCRMs().map(crm => (
                <div
                  key={crm._id}
                  onClick={() => handleAssign(crm._id)}
                  className="p-4 border border-gray-300 rounded-lg hover:border-[#c69c6d] hover:bg-gray-50 cursor-pointer transition-all"
                >
                  <p className="font-semibold text-gray-900">{crm.fullName}</p>
                  <p className="text-sm text-gray-600">{crm.email}</p>
                  <p className="text-sm text-gray-600">{crm.phone}</p>
                </div>
              ))
            ) : (
              getDesigners().map(designer => (
                <div
                  key={designer._id}
                  onClick={() => handleAssign(designer._id)}
                  className="p-4 border border-gray-300 rounded-lg hover:border-[#c69c6d] hover:bg-gray-50 cursor-pointer transition-all"
                >
                  <p className="font-semibold text-gray-900">{designer.fullName}</p>
                  <p className="text-sm text-gray-600">{designer.email}</p>
                  <p className="text-sm text-gray-600">Specialization: {designer.specialization || 'N/A'}</p>
                </div>
              ))
            )}
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCustomer(null);
          }}
          title="Confirm Delete"
        >
          <div className="text-center py-4">
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedCustomer?.fullName}</strong>? This will also delete their user account and cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCustomer(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          show={showChangePasswordModal}
          onClose={() => {
            setShowChangePasswordModal(false);
            setSelectedCustomer(null);
            setNewPassword('');
            setError('');
          }}
          title="Change Customer Password"
        >
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">
                Change password for <strong>{selectedCustomer?.fullName}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Email: {selectedCustomer?.email}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                placeholder="Enter new password (min 6 characters)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setSelectedCustomer(null);
                  setNewPassword('');
                  setError('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#2c2420] to-[#c69c6d] text-white rounded-lg hover:shadow-lg transition-all"
              >
                Change Password
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
