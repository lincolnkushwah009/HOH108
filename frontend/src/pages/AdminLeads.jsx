import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import { playNewLeadNotification, initNotificationSystem } from '../utils/notificationSound';
import LeadJourney from '../components/LeadJourney';
import { API_ENDPOINTS } from '../config/api';

// Modal component - moved outside to prevent recreation on parent re-renders
const Modal = memo(({ show, onClose, title, children }) => {
  console.log('Modal render, show:', show, 'title:', title);

  return (
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <h3 className="text-xl sm:text-2xl font-bold text-[#2c2420]">{title}</h3>
                <button
                  onClick={onClose}
                  type="button"
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
});

Modal.displayName = 'Modal';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [showLeadJourney, setShowLeadJourney] = useState(false);
  const previousLeadsCount = useRef(0);
  const isEditingRef = useRef(false);

  // Form state for edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    carpetArea: '',
    bhk: '',
    package: '',
    estimatedCost: '',
    status: 'new',
    notes: ''
  });

  // Lead status options
  const leadStatuses = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'rnr', label: 'RNR', color: 'bg-gray-100 text-gray-800' },
    { value: 'qualified', label: 'Qualified', color: 'bg-green-100 text-green-800' },
    { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
    { value: 'non_prospect', label: 'Non Prospect', color: 'bg-gray-100 text-gray-700' },
    { value: 'not_reachable', label: 'Not Reachable', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low_budget', label: 'Low Budget', color: 'bg-orange-100 text-orange-800' },
    { value: 'non_serviceable_area', label: 'Non Serviceable Area', color: 'bg-purple-100 text-purple-800' },
    { value: 'future_prospect', label: 'Future Prospect', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const getStatusBadge = (status) => {
    const statusObj = leadStatuses.find(s => s.value === status);
    return statusObj || leadStatuses[0];
  };

  // Fetch leads with useCallback to prevent recreation
  const fetchLeads = useCallback(async (silent = false) => {
    const stack = new Error().stack;
    console.log('fetchLeads called, silent:', silent, 'Stack:', stack);
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem('token');

      let url = `${API_ENDPOINTS.LEADS}?page=${currentPage}&limit=10`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setLeads(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Failed to fetch leads');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.LEADS_STATS, {
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

  // Initialize notification system on component mount
  useEffect(() => {
    console.log('AdminLeads component MOUNTED');
    initNotificationSystem();

    return () => {
      console.log('AdminLeads component UNMOUNTING');
    };
  }, []);

  // Debug: Track formData changes
  useEffect(() => {
    console.log('FormData changed:', formData);
  }, [formData]);

  // Debug: Track leads changes
  useEffect(() => {
    console.log('LEADS ARRAY CHANGED! Length:', leads.length);
  }, [leads]);

  // Debug: Track modal state
  useEffect(() => {
    console.log('showEditModal changed:', showEditModal);
  }, [showEditModal]);

  // Check for new leads and play notification
  useEffect(() => {
    console.log('🔍 Lead count check:', {
      currentCount: leads.length,
      previousCount: previousLeadsCount.current,
      hasLeads: leads.length > 0,
      hadPreviousLeads: previousLeadsCount.current > 0,
      isNewLead: leads.length > previousLeadsCount.current
    });

    if (leads.length > 0 && previousLeadsCount.current > 0) {
      if (leads.length > previousLeadsCount.current) {
        // New lead detected
        console.log('🎉 NEW LEAD DETECTED! Playing notification...');
        playNewLeadNotification();
      }
    }
    previousLeadsCount.current = leads.length;
  }, [leads]);

  // Initial fetch - only run once on mount
  useEffect(() => {
    console.log('Initial fetch of leads and stats');
    fetchLeads();
    fetchStats();
  }, []); // Empty dependency array - only run on mount

  // Refetch when page, search, or filter changes (but not when modal is open)
  useEffect(() => {
    if (!showEditModal && !showViewModal && !showDeleteModal && !showLeadJourney) {
      console.log('Fetching due to page/search/filter change');
      fetchLeads();
    }
  }, [currentPage, searchTerm, statusFilter]);

  // Poll for new leads every 30 seconds (silent refresh)
  // BUT only when modal is NOT open to prevent interference
  useEffect(() => {
    // Don't poll if any modal is open
    if (showEditModal || showViewModal || showDeleteModal || showLeadJourney) {
      console.log('Polling paused - modal is open');
      return;
    }

    const interval = setInterval(() => {
      console.log('⏰ Polling interval triggered - checking for new leads...');
      fetchLeads(true); // Silent refresh - doesn't show loading
      fetchStats(); // Also update stats silently
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [fetchLeads, fetchStats, showEditModal, showViewModal, showDeleteModal, showLeadJourney]);

  // Handle form input change - memoized to prevent re-creation
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      carpetArea: '',
      bhk: '',
      package: '',
      estimatedCost: '',
      status: 'new',
      notes: ''
    });
    setError('');
  };

  // Handle edit lead
  const handleEditLead = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.LEAD_BY_ID(selectedLead._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Update lead in state without refetching (prevents notification sound)
        // Use the data returned from the server to ensure we have the correct structure
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            lead._id === selectedLead._id ? data.data : lead
          )
        );
        isEditingRef.current = false;
        setShowEditModal(false);
        resetForm();
        setSelectedLead(null);
        // Don't call fetchStats() here to prevent re-render - stats will update on next poll
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      setError('Failed to update lead');
    }
  };

  // Handle delete lead
  const handleDeleteLead = async () => {
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.LEAD_BY_ID(selectedLead._id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Remove lead from state without refetching (prevents notification sound)
        setLeads(prevLeads => prevLeads.filter(lead => lead._id !== selectedLead._id));
        // Update previous count to match new count
        previousLeadsCount.current = previousLeadsCount.current - 1;
        setShowDeleteModal(false);
        setSelectedLead(null);
        // Don't call fetchStats() here to prevent re-render - stats will update on next poll
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      setError('Failed to delete lead');
    }
  };

  // Open view modal
  const openViewModal = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  // Open lead journey modal
  const openLeadJourney = (lead) => {
    setSelectedLead(lead);
    setShowLeadJourney(true);
  };

  // Open edit modal
  const openEditModal = (lead) => {
    console.log('Opening edit modal for lead:', lead);
    isEditingRef.current = true;
    setSelectedLead(lead);
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      city: lead.city || '',
      carpetArea: lead.carpetArea || '',
      bhk: lead.bhk || '',
      package: lead.package || '',
      estimatedCost: lead.estimatedCost || '',
      status: lead.status || 'new',
      notes: lead.notes || ''
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (lead) => {
    setSelectedLead(lead);
    setShowDeleteModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="max-w-full overflow-hidden">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2c2420] mb-2">Lead Management</h1>
            <p className="text-sm sm:text-base text-gray-600">View and manage customer inquiries</p>
          </div>
          <button
            onClick={() => playNewLeadNotification()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            title="Test notification sound"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Test Sound
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Leads</p>
                  <p className="text-3xl font-bold text-[#2c2420]">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Recent (30d)</p>
                  <p className="text-3xl font-bold text-green-600">{stats.recent}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Cost</p>
                  <p className="text-2xl font-bold text-[#c69c6d]">{formatCurrency(stats.avgEstimatedCost)}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Area</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.avgCarpetArea} sq.ft</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Leads
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
              >
                <option value="">All Statuses</option>
                {leadStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c69c6d] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No leads found</h3>
              <p className="mt-2 text-gray-600">Leads will appear here as customers submit inquiries.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto w-full">
                <table className="w-full table-auto" style={{ minWidth: '1000px' }}>
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">BHK/Package</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Est. Cost</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => {
                      const statusBadge = getStatusBadge(lead.status);
                      const isCostEstimate = lead.leadType === 'cost_estimate';
                      return (
                        <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            <div>{lead.email}</div>
                            {lead.phone && <div className="text-xs text-gray-500">{lead.phone}</div>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              isCostEstimate ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {isCostEstimate ? 'Cost Est.' : 'General'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {isCostEstimate && lead.bhk && lead.package ? (
                              <div>
                                <div className="font-medium">{lead.bhk}</div>
                                <div className="text-xs text-gray-600">{lead.package}</div>
                              </div>
                            ) : lead.city && lead.carpetArea ? (
                              <div>
                                <div className="font-medium">{lead.city}</div>
                                <div className="text-xs text-gray-600">{lead.carpetArea.toLocaleString()} sq.ft</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                            {formatCurrency(lead.estimatedCost)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(lead.createdAt || lead.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex space-x-1 flex-wrap gap-y-1">
                              <button
                                onClick={() => openLeadJourney(lead)}
                                className="text-accent hover:text-primary font-medium flex items-center gap-1"
                                title="View Lead Journey"
                              >
                                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Journey
                              </button>
                              <button
                                onClick={() => openViewModal(lead)}
                                className="text-[#2c2420] hover:text-[#c69c6d] font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => openEditModal(lead)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(lead)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* View Lead Modal */}
        <Modal
          show={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedLead(null);
          }}
          title="Lead Details"
        >
          {selectedLead && (
            <div className="space-y-4">
              {/* Lead Type Badge */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedLead.leadType === 'cost_estimate' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedLead.leadType === 'cost_estimate' ? 'Cost Estimate Lead' : 'General Lead'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(selectedLead.status).color}`}>
                  {getStatusBadge(selectedLead.status).label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg text-gray-900">{selectedLead.email}</p>
                </div>
                {selectedLead.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-lg text-gray-900">{selectedLead.phone}</p>
                  </div>
                )}
                {selectedLead.bhk && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">BHK</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedLead.bhk}</p>
                  </div>
                )}
                {selectedLead.package && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Package</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedLead.package}</p>
                  </div>
                )}
                {selectedLead.city && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">City</p>
                    <p className="text-lg text-gray-900">{selectedLead.city}</p>
                  </div>
                )}
                {selectedLead.carpetArea && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Carpet Area</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedLead.carpetArea.toLocaleString()} sq.ft</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Estimated Cost</p>
                  <p className="text-lg font-bold text-[#c69c6d]">{formatCurrency(selectedLead.estimatedCost)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Submitted On</p>
                  <p className="text-lg text-gray-900">{formatDate(selectedLead.createdAt || selectedLead.date)}</p>
                </div>
              </div>
              {selectedLead.notes && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Notes</p>
                  <p className="text-gray-900">{selectedLead.notes}</p>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedLead);
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#2c2420] to-[#c69c6d] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Edit Lead
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Lead Modal */}
        <Modal
          show={showEditModal}
          onClose={() => {
            isEditingRef.current = false;
            setShowEditModal(false);
            resetForm();
            setSelectedLead(null);
          }}
          title="Edit Lead"
        >
          <form onSubmit={handleEditLead} className="space-y-6">
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
                  name="name"
                  value={formData.name}
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
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
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
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BHK
                </label>
                <input
                  type="text"
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleInputChange}
                  placeholder="e.g., 2BHK, 3BHK"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package
                </label>
                <input
                  type="text"
                  name="package"
                  value={formData.package}
                  onChange={handleInputChange}
                  placeholder="e.g., Basic, Premium, Luxury"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carpet Area (sq.ft)
                </label>
                <input
                  type="number"
                  name="carpetArea"
                  value={formData.carpetArea}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                >
                  {leadStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Add any notes or comments about this lead..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c69c6d]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                  setSelectedLead(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[#2c2420] to-[#c69c6d] text-white rounded-lg hover:shadow-lg transition-all"
              >
                Update Lead
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedLead(null);
          }}
          title="Confirm Delete"
        >
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Lead</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the lead from <strong>{selectedLead?.name}</strong>? This action cannot be undone.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedLead(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLead}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* Lead Journey Modal */}
        <Modal
          show={showLeadJourney}
          onClose={() => setShowLeadJourney(false)}
          title="Lead Journey"
        >
          {selectedLead && <LeadJourney lead={selectedLead} />}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminLeads;
