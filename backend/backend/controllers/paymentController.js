const Payment = require('../models/Payment');
const Project = require('../models/Project');
const { getServiceTypeFilter } = require('../utils/serviceTypeFilter');
const XLSX = require('xlsx');

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, projectId, customerId, serviceType } = req.query;

    // Build query
    let query = {};

    if (status) query.status = status;
    if (projectId) query.project = projectId;
    if (customerId) query.customer = customerId;

    // Add service type filter
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      query.serviceType = serviceFilter.serviceType;
    }

    // Execute query with pagination
    const payments = await Payment.find(query)
      .populate('project', 'projectId title status')
      .populate('customer', 'fullName email customerId phone')
      .populate('collectedBy', 'fullName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// @desc    Get single payment
// @route   GET /api/admin/payments/:id
// @access  Private/Admin
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('project', 'projectId title status budget')
      .populate('customer', 'fullName email customerId phone address')
      .populate('collectedBy', 'fullName email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};

// @desc    Create payment
// @route   POST /api/admin/payments
// @access  Private/Admin
exports.createPayment = async (req, res) => {
  try {
    const {
      projectId,
      customerId,
      amount,
      dueDate,
      milestone,
      description,
      paymentMethod,
      serviceType
    } = req.body;

    // Validate required fields
    if (!projectId || !customerId || !amount || !dueDate || !milestone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Determine service type
    let paymentServiceType = serviceType || project.serviceType;
    if (!paymentServiceType) {
      if (req.user.role === 'admin' && req.user.serviceType) {
        paymentServiceType = req.user.serviceType;
      } else {
        paymentServiceType = 'interior';
      }
    }

    // Create payment
    const payment = await Payment.create({
      project: projectId,
      customer: customerId,
      amount,
      dueDate,
      milestone,
      description,
      paymentMethod,
      serviceType: paymentServiceType,
      collectedBy: req.user._id
    });

    // Populate the payment data
    await payment.populate('project customer collectedBy');

    res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      data: payment
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

// @desc    Update payment
// @route   PUT /api/admin/payments/:id
// @access  Private/Admin
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment fields
    const allowedUpdates = [
      'amount', 'dueDate', 'paidDate', 'status', 'paymentMethod',
      'milestone', 'description', 'transactionId', 'notes'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        payment[field] = req.body[field];
      }
    });

    await payment.save();

    // Populate the updated payment
    await payment.populate('project customer collectedBy');

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });

  } catch (error) {
    console.error('Update payment error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating payment',
      error: error.message
    });
  }
};

// @desc    Delete payment
// @route   DELETE /api/admin/payments/:id
// @access  Private/Admin
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await Payment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });

  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting payment',
      error: error.message
    });
  }
};

// @desc    Get payment statistics
// @route   GET /api/admin/payments/stats
// @access  Private/Admin
exports.getPaymentStats = async (req, res) => {
  try {
    const { serviceType } = req.query;

    // Build base query with service type filter
    let baseQuery = {};
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      baseQuery.serviceType = serviceFilter.serviceType;
    }

    const totalPayments = await Payment.countDocuments(baseQuery);
    const pendingPayments = await Payment.countDocuments({ ...baseQuery, status: 'pending' });
    const overduePayments = await Payment.countDocuments({ ...baseQuery, status: 'overdue' });
    const paidPayments = await Payment.countDocuments({ ...baseQuery, status: 'paid' });

    // Calculate total amounts
    const totalAmountResult = await Payment.aggregate([
      { $match: baseQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

    const paidAmountResult = await Payment.aggregate([
      { $match: { ...baseQuery, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const paidAmount = paidAmountResult.length > 0 ? paidAmountResult[0].total : 0;

    const pendingAmountResult = await Payment.aggregate([
      { $match: { ...baseQuery, status: { $in: ['pending', 'overdue'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingAmount = pendingAmountResult.length > 0 ? pendingAmountResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        pendingPayments,
        overduePayments,
        paidPayments,
        totalAmount,
        paidAmount,
        pendingAmount,
        collectionRate: totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(2) : 0
      }
    });

  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics',
      error: error.message
    });
  }
};

// @desc    Get overdue payments (for reminders)
// @route   GET /api/admin/payments/overdue
// @access  Private/Admin
exports.getOverduePayments = async (req, res) => {
  try {
    const { serviceType } = req.query;

    // Build query
    let query = {
      status: { $in: ['pending', 'overdue'] },
      dueDate: { $lt: new Date() }
    };

    // Add service type filter
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      query.serviceType = serviceFilter.serviceType;
    }

    const overduePayments = await Payment.find(query)
      .populate('project', 'projectId title')
      .populate('customer', 'fullName email phone customerId')
      .sort({ dueDate: 1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: overduePayments.length,
      data: overduePayments
    });

  } catch (error) {
    console.error('Get overdue payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue payments',
      error: error.message
    });
  }
};

// @desc    Mark payment as paid
// @route   PUT /api/admin/payments/:id/mark-paid
// @access  Private/Admin
exports.markAsPaid = async (req, res) => {
  try {
    const { paidDate, transactionId, paymentMethod, notes } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = 'paid';
    payment.paidDate = paidDate || new Date();
    if (transactionId) payment.transactionId = transactionId;
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    if (notes) payment.notes = notes;

    await payment.save();
    await payment.populate('project customer collectedBy');

    res.status(200).json({
      success: true,
      message: 'Payment marked as paid successfully',
      data: payment
    });

  } catch (error) {
    console.error('Mark payment as paid error:', error);
    res.status(400).json({
      success: false,
      message: 'Error marking payment as paid',
      error: error.message
    });
  }
};

// @desc    Export payments to Excel
// @route   GET /api/admin/payments/export
// @access  Private/Admin
exports.exportPayments = async (req, res) => {
  try {
    const { status, projectId, customerId, serviceType } = req.query;

    // Build query
    let query = {};

    if (status) query.status = status;
    if (projectId) query.project = projectId;
    if (customerId) query.customer = customerId;

    // Add service type filter
    const serviceFilter = getServiceTypeFilter(req.user, serviceType);
    if (serviceFilter.serviceType) {
      query.serviceType = serviceFilter.serviceType;
    }

    // Fetch all payments matching the filter (no pagination)
    const payments = await Payment.find(query)
      .populate('project', 'projectId title status')
      .populate('customer', 'fullName email customerId phone')
      .populate('collectedBy', 'fullName email')
      .sort({ createdAt: -1 });

    // Prepare data for Excel
    const excelData = payments.map(payment => ({
      'Payment ID': payment.paymentId || 'N/A',
      'Project ID': payment.project?.projectId || 'N/A',
      'Project Title': payment.project?.title || 'N/A',
      'Customer Name': payment.customer?.fullName || 'N/A',
      'Customer ID': payment.customer?.customerId || 'N/A',
      'Customer Phone': payment.customer?.phone || 'N/A',
      'Service Type': payment.serviceType?.toUpperCase() || 'N/A',
      'Amount (INR)': payment.amount || 0,
      'Milestone': getMilestoneLabel(payment.milestone),
      'Status': getStatusLabel(payment.status),
      'Payment Method': payment.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A',
      'Due Date': payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('en-IN') : 'N/A',
      'Paid Date': payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('en-IN') : 'N/A',
      'Transaction ID': payment.transactionId || 'N/A',
      'Collected By': payment.collectedBy?.fullName || 'N/A',
      'Description': payment.description || 'N/A',
      'Created Date': payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN') : 'N/A'
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Payment ID
      { wch: 15 }, // Project ID
      { wch: 30 }, // Project Title
      { wch: 20 }, // Customer Name
      { wch: 15 }, // Customer ID
      { wch: 15 }, // Customer Phone
      { wch: 15 }, // Service Type
      { wch: 15 }, // Amount
      { wch: 15 }, // Milestone
      { wch: 15 }, // Status
      { wch: 15 }, // Payment Method
      { wch: 15 }, // Due Date
      { wch: 15 }, // Paid Date
      { wch: 20 }, // Transaction ID
      { wch: 20 }, // Collected By
      { wch: 30 }, // Description
      { wch: 15 }  // Created Date
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Collections Report');

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers
    const fileName = `Collections_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send file
    res.send(excelBuffer);

  } catch (error) {
    console.error('Export payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting payments',
      error: error.message
    });
  }
};

// Helper functions for Excel export
function getMilestoneLabel(milestone) {
  const labels = {
    'advance': 'Advance',
    'stage_1': 'Stage 1',
    'stage_2': 'Stage 2',
    'stage_3': 'Stage 3',
    'final': 'Final Payment',
    'other': 'Other'
  };
  return labels[milestone] || milestone;
}

function getStatusLabel(status) {
  const labels = {
    'pending': 'Pending',
    'overdue': 'Overdue',
    'paid': 'Paid',
    'partially_paid': 'Partially Paid'
  };
  return labels[status] || status;
}

module.exports = exports;
