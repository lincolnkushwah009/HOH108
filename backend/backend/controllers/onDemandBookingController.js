const OnDemandBooking = require('../models/OnDemandBooking');
const OnDemandService = require('../models/OnDemandService');
const ServiceProvider = require('../models/ServiceProvider');
const crypto = require('crypto');
const emailService = require('../utils/emailService');

// @desc    Get all bookings
// @route   GET /api/admin/on-demand/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      serviceProvider,
      fromDate,
      toDate,
      priority
    } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (status) {
      query.status = status;
    }

    if (serviceProvider) {
      query.serviceProvider = serviceProvider;
    }

    if (priority) {
      query.priority = priority;
    }

    if (fromDate || toDate) {
      query.scheduledDate = {};
      if (fromDate) query.scheduledDate.$gte = new Date(fromDate);
      if (toDate) query.scheduledDate.$lte = new Date(toDate);
    }

    // Execute query with pagination
    const bookings = await OnDemandBooking.find(query)
      .populate('service', 'title category pricing')
      .populate('serviceProvider', 'fullName phone rating.average')
      .populate('customer.userId', 'fullName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await OnDemandBooking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/on-demand/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await OnDemandBooking.findById(req.params.id)
      .populate('service')
      .populate('serviceProvider')
      .populate('customer.userId')
      .populate('statusHistory.updatedBy', 'fullName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// @desc    Create new booking
// @route   POST /api/on-demand/bookings
// @access  Public/Private
exports.createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      customer,
      serviceAddress,
      scheduledDate,
      timeSlot,
      serviceDetails,
      pricing,
      payment,
      priority,
      source
    } = req.body;

    // Verify service exists
    const service = await OnDemandService.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Create booking
    const booking = await OnDemandBooking.create({
      service: serviceId,
      customer: {
        ...customer,
        userId: req.user?._id
      },
      serviceAddress,
      scheduledDate,
      timeSlot,
      serviceDetails,
      pricing: {
        ...pricing,
        total: pricing.total || pricing.serviceCharge,
        remainingAmount: (pricing.total || pricing.serviceCharge) - (pricing.advancePaid || 0)
      },
      payment,
      priority: priority || 'Medium',
      source: source || 'Website',
      otp: {
        code: otp,
        verified: false
      },
      createdBy: req.user?._id
    });

    // Update service booking count
    service.totalBookings += 1;
    await service.save();

    // Populate service data for email
    await booking.populate('service');

    // Send confirmation email (async, don't wait)
    emailService.sendBookingConfirmation(booking)
      .then(() => console.log(`✅ Confirmation email sent for booking ${booking.bookingId}`))
      .catch(err => console.error(`❌ Email failed for booking ${booking.bookingId}:`, err.message));

    // TODO: Send OTP via SMS
    console.log(`OTP for booking ${booking.bookingId}: ${otp}`);

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully. Confirmation email sent!'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// @desc    Update booking
// @route   PUT /api/admin/on-demand/bookings/:id
// @access  Private/Admin
exports.updateBooking = async (req, res) => {
  try {
    const booking = await OnDemandBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update booking
    const updatedBooking = await OnDemandBooking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user._id },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// @desc    Assign provider to booking
// @route   PUT /api/admin/on-demand/bookings/:id/assign-provider
// @access  Private/Admin
exports.assignProvider = async (req, res) => {
  try {
    const { providerId } = req.body;

    const booking = await OnDemandBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify provider exists and is active
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    if (provider.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Provider is not active'
      });
    }

    // Verify provider offers this service
    const offersService = provider.services.some(
      svc => svc.service.toString() === booking.service.toString()
    );

    if (!offersService) {
      return res.status(400).json({
        success: false,
        message: 'Provider does not offer this service'
      });
    }

    // Assign provider
    booking.serviceProvider = providerId;
    booking.status = 'confirmed';
    booking.lastModifiedBy = req.user._id;
    await booking.save();

    // Update provider stats
    provider.performance.totalBookings += 1;
    provider.availability.status = 'busy';
    await provider.save();

    // Populate booking data for email
    await booking.populate(['service', 'serviceProvider']);

    // Send provider assigned email (async)
    emailService.sendProviderAssigned(booking)
      .then(() => console.log(`✅ Provider assigned email sent for booking ${booking.bookingId}`))
      .catch(err => console.error(`❌ Email failed for booking ${booking.bookingId}:`, err.message));

    res.json({
      success: true,
      data: booking,
      message: 'Provider assigned successfully. Customer notified via email.'
    });
  } catch (error) {
    console.error('Assign provider error:', error);
    res.status(400).json({
      success: false,
      message: 'Error assigning provider',
      error: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/on-demand/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = [
      'pending', 'confirmed', 'provider_on_way', 'in_progress',
      'work_completed', 'completed', 'cancelled_by_customer',
      'cancelled_by_provider', 'cancelled_by_admin',
      'no_show_customer', 'no_show_provider', 'rescheduled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const booking = await OnDemandBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update status
    booking.status = status;
    booking.lastModifiedBy = req.user._id;

    // Handle status-specific updates
    if (status === 'in_progress' && !booking.workDuration.startTime) {
      booking.workDuration.startTime = new Date();
    }

    if (status === 'work_completed' && !booking.workDuration.endTime) {
      booking.workDuration.endTime = new Date();
      if (booking.workDuration.startTime) {
        const durationMs = booking.workDuration.endTime - booking.workDuration.startTime;
        booking.workDuration.actualDuration = Math.round(durationMs / 60000); // minutes
      }
    }

    if (status === 'completed') {
      // Update service provider stats
      const provider = await ServiceProvider.findById(booking.serviceProvider);
      if (provider) {
        provider.performance.completedBookings += 1;
        provider.availability.status = 'available';
        await provider.save();
      }

      // Update service stats
      const service = await OnDemandService.findById(booking.service);
      if (service) {
        service.completedBookings += 1;
        await service.save();
      }

      // Update payment status
      if (booking.pricing.remainingAmount === 0) {
        booking.payment.status = 'completed';
      }
    }

    if (status.startsWith('cancelled_')) {
      booking.cancellation = {
        cancelledBy: status.split('_')[2],
        cancelledAt: new Date(),
        refundEligible: true
      };

      // Update provider availability if assigned
      if (booking.serviceProvider) {
        await ServiceProvider.findByIdAndUpdate(booking.serviceProvider, {
          $inc: { 'performance.cancelledBookings': 1 },
          'availability.status': 'available'
        });
      }
    }

    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/on-demand/bookings/:id/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const booking = await OnDemandBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.otp.verified) {
      return res.status(400).json({
        success: false,
        message: 'OTP already verified'
      });
    }

    if (booking.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    booking.otp.verified = true;
    booking.otp.verifiedAt = new Date();
    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(400).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// @desc    Add rating
// @route   POST /api/on-demand/bookings/:id/rating
// @access  Private
exports.addRating = async (req, res) => {
  try {
    const { type, rating, review } = req.body;

    if (!['customerToProvider', 'providerToCustomer'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rating type'
      });
    }

    const booking = await OnDemandBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed bookings'
      });
    }

    // Add rating
    booking.rating[type] = {
      rating,
      review,
      ratedAt: new Date()
    };

    await booking.save();

    // Update provider rating if customer rated provider
    if (type === 'customerToProvider' && booking.serviceProvider) {
      const provider = await ServiceProvider.findById(booking.serviceProvider);
      if (provider) {
        const newCount = provider.rating.count + 1;
        const newAverage = ((provider.rating.average * provider.rating.count) + rating) / newCount;
        provider.rating.average = newAverage;
        provider.rating.count = newCount;

        provider.reviews.push({
          customer: {
            name: booking.customer.name,
            email: booking.customer.email
          },
          booking: booking._id,
          rating,
          review
        });

        await provider.save();
      }
    }

    res.json({
      success: true,
      data: booking,
      message: 'Rating added successfully'
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding rating',
      error: error.message
    });
  }
};

// @desc    Reschedule booking
// @route   POST /api/on-demand/bookings/:id/reschedule
// @access  Private
exports.rescheduleBooking = async (req, res) => {
  try {
    const { newDate, newTimeSlot, reason, rescheduledBy } = req.body;

    const booking = await OnDemandBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Add to reschedule history
    booking.rescheduleHistory.push({
      previousDate: booking.scheduledDate,
      previousTimeSlot: booking.timeSlot,
      newDate,
      newTimeSlot,
      reason,
      rescheduledBy
    });

    // Update booking
    booking.scheduledDate = newDate;
    booking.timeSlot = newTimeSlot;
    booking.status = 'rescheduled';
    booking.lastModifiedBy = req.user._id;

    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: 'Booking rescheduled successfully'
    });
  } catch (error) {
    console.error('Reschedule booking error:', error);
    res.status(400).json({
      success: false,
      message: 'Error rescheduling booking',
      error: error.message
    });
  }
};

// @desc    Get booking statistics
// @route   GET /api/admin/on-demand/bookings/stats
// @access  Private/Admin
exports.getBookingStats = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    let dateFilter = {};
    if (fromDate || toDate) {
      dateFilter.createdAt = {};
      if (fromDate) dateFilter.createdAt.$gte = new Date(fromDate);
      if (toDate) dateFilter.createdAt.$lte = new Date(toDate);
    }

    const totalBookings = await OnDemandBooking.countDocuments(dateFilter);
    const pendingBookings = await OnDemandBooking.countDocuments({ ...dateFilter, status: 'pending' });
    const confirmedBookings = await OnDemandBooking.countDocuments({ ...dateFilter, status: 'confirmed' });
    const inProgressBookings = await OnDemandBooking.countDocuments({ ...dateFilter, status: 'in_progress' });
    const completedBookings = await OnDemandBooking.countDocuments({ ...dateFilter, status: 'completed' });
    const cancelledBookings = await OnDemandBooking.countDocuments({
      ...dateFilter,
      status: { $in: ['cancelled_by_customer', 'cancelled_by_provider', 'cancelled_by_admin'] }
    });

    const bookingsByStatus = await OnDemandBooking.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const bookingsByService = await OnDemandBooking.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $lookup: { from: 'ondemandservices', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { serviceName: '$service.title', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const revenueStats = await OnDemandBooking.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          totalPaid: { $sum: '$pricing.advancePaid' },
          totalPending: { $sum: '$pricing.remainingAmount' }
        }
      }
    ]);

    const todayBookings = await OnDemandBooking.countDocuments({
      scheduledDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    res.json({
      success: true,
      data: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        inProgress: inProgressBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        today: todayBookings,
        byStatus: bookingsByStatus,
        byService: bookingsByService,
        revenue: revenueStats[0] || { totalRevenue: 0, totalPaid: 0, totalPending: 0 }
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Get my bookings (for customers)
// @route   GET /api/on-demand/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = { 'customer.userId': req.user._id };

    if (status) {
      query.status = status;
    }

    const bookings = await OnDemandBooking.find(query)
      .populate('service', 'title category pricing image')
      .populate('serviceProvider', 'fullName phone rating.average profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await OnDemandBooking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Get provider bookings
// @route   GET /api/on-demand/provider-bookings/:providerId
// @access  Private/Admin
exports.getProviderBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = { serviceProvider: req.params.providerId };

    if (status) {
      query.status = status;
    }

    const bookings = await OnDemandBooking.find(query)
      .populate('service', 'title category')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ scheduledDate: -1 });

    const count = await OnDemandBooking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get provider bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Track booking without login
// @route   POST /api/on-demand/bookings/track
// @access  Public
exports.trackBooking = async (req, res) => {
  try {
    const { bookingId, phone } = req.body;

    if (!bookingId || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and phone number are required'
      });
    }

    // Find booking by bookingId and phone number
    const booking = await OnDemandBooking.findOne({
      bookingId: bookingId,
      'customer.phone': phone
    })
      .populate('service', 'title category image pricing')
      .populate('serviceProvider', 'fullName phone rating.average');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found. Please check your Booking ID and phone number.'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Track booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking booking',
      error: error.message
    });
  }
};

// @desc    Request completion OTP
// @route   POST /api/on-demand/bookings/:id/request-completion-otp
// @access  Private (Service Provider only)
exports.requestCompletionOTP = async (req, res) => {
  try {
    const booking = await OnDemandBooking.findById(req.params.id)
      .populate('service', 'title')
      .populate('serviceProvider', 'fullName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the requesting user is the assigned provider
    if (booking.serviceProvider._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned service provider can request completion OTP'
      });
    }

    // Check if booking status is work_completed
    if (booking.status !== 'work_completed') {
      return res.status(400).json({
        success: false,
        message: 'OTP can only be requested for work_completed bookings'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Save OTP to booking
    booking.completionOTP = {
      code: otp,
      generatedAt: new Date(),
      expiresAt: expiresAt,
      verified: false
    };

    await booking.save();

    // Send OTP via email
    const emailService = require('../services/emailService');
    await emailService.sendEmail({
      to: booking.customer.email,
      subject: 'Service Completion OTP - HOH108',
      text: `Your service completion OTP is: ${otp}. This OTP is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Service Completion Verification</h2>
          <p>Dear ${booking.customer.name},</p>
          <p>Your service provider <strong>${booking.serviceProvider.fullName}</strong> has completed the service: <strong>${booking.service.title}</strong></p>
          <p>Please share the following OTP with your service provider to confirm completion:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">Booking ID: ${booking.bookingId}</p>
          <p>Thank you for using HOH108!</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'OTP sent to customer email successfully',
      data: {
        expiresAt: expiresAt
      }
    });

  } catch (error) {
    console.error('Request completion OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

// @desc    Verify completion OTP and mark booking as completed
// @route   POST /api/on-demand/bookings/:id/verify-completion-otp
// @access  Private (Service Provider only)
exports.verifyCompletionOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required'
      });
    }

    const booking = await OnDemandBooking.findById(req.params.id)
      .select('+completionOTP.code')
      .populate('service', 'title')
      .populate('serviceProvider', 'fullName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the requesting user is the assigned provider
    if (booking.serviceProvider._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned service provider can verify completion OTP'
      });
    }

    // Check if OTP exists
    if (!booking.completionOTP || !booking.completionOTP.code) {
      return res.status(400).json({
        success: false,
        message: 'No OTP requested for this booking'
      });
    }

    // Check if OTP is expired
    if (new Date() > booking.completionOTP.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Check if OTP is already verified
    if (booking.completionOTP.verified) {
      return res.status(400).json({
        success: false,
        message: 'This OTP has already been verified'
      });
    }

    // Verify OTP
    if (booking.completionOTP.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Mark OTP as verified
    booking.completionOTP.verified = true;
    booking.completionOTP.verifiedAt = new Date();

    // Update booking status to completed
    booking.status = 'completed';
    booking.statusHistory.push({
      status: 'completed',
      timestamp: new Date(),
      updatedBy: req.user.id,
      notes: 'Booking completed with OTP verification'
    });

    // Update provider performance
    const ServiceProvider = require('../models/ServiceProvider');
    await ServiceProvider.findByIdAndUpdate(booking.serviceProvider._id, {
      $inc: {
        'performance.completedBookings': 1,
        'earnings.totalEarned': booking.pricing.total,
        'earnings.currentMonthEarnings': booking.pricing.total,
        'earnings.pendingPayment': booking.pricing.total
      }
    });

    await booking.save();

    // Send completion confirmation email to customer
    const emailService = require('../services/emailService');
    await emailService.sendEmail({
      to: booking.customer.email,
      subject: 'Service Completed - HOH108',
      text: `Your service "${booking.service.title}" has been completed successfully.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Service Completed Successfully!</h2>
          <p>Dear ${booking.customer.name},</p>
          <p>Your service <strong>${booking.service.title}</strong> has been marked as completed.</p>
          <p>Booking ID: <strong>${booking.bookingId}</strong></p>
          <p>Service Provider: <strong>${booking.serviceProvider.fullName}</strong></p>
          <p>Total Amount: ₹${booking.pricing.total}</p>
          <p>Thank you for using HOH108!</p>
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL}/bookings/${booking._id}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Booking Details</a>
          </p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Service completed successfully',
      data: {
        bookingId: booking.bookingId,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Verify completion OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};
