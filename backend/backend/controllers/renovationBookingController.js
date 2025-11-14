const RenovationBooking = require('../models/RenovationBooking');
const RenovationService = require('../models/RenovationService');

// Create renovation booking (public)
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // Verify service exists
    const service = await RenovationService.findById(bookingData.service);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Renovation service not found'
      });
    }

    const booking = await RenovationBooking.create(bookingData);

    // Increment total bookings for the service
    service.totalBookings += 1;
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Renovation booking created successfully. We will contact you soon!',
      data: booking
    });
  } catch (error) {
    console.error('Error creating renovation booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create renovation booking',
      error: error.message
    });
  }
};

// Get single booking by ID (public - with limited info)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await RenovationBooking.findById(req.params.id)
      .populate('service', 'title category image');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};

// Admin: Get all bookings
exports.adminGetAllBookings = async (req, res) => {
  try {
    const { status, search, priority, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const bookings = await RenovationBooking.find(query)
      .populate('service', 'title category image pricing')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await RenovationBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// Admin: Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await RenovationBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'timeline') {
        booking[key] = req.body[key];
      }
    });

    booking.lastModifiedBy = req.user._id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message
    });
  }
};

// Admin: Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const booking = await RenovationBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (notes) {
      booking.timeline[booking.timeline.length - 1].notes = notes;
    }
    booking.lastModifiedBy = req.user._id;

    // Set completion date if completed
    if (status === 'completed' && !booking.actualCompletionDate) {
      booking.actualCompletionDate = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

// Admin: Assign booking to team member
exports.assignBooking = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const booking = await RenovationBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.assignedTo = assignedTo;
    booking.lastModifiedBy = req.user._id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking assigned successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error assigning booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign booking',
      error: error.message
    });
  }
};

// Admin: Send quotation
exports.sendQuotation = async (req, res) => {
  try {
    const { quotation } = req.body;
    const booking = await RenovationBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.quotation = quotation;
    booking.status = 'quote_sent';
    booking.lastModifiedBy = req.user._id;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Quotation sent successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error sending quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send quotation',
      error: error.message
    });
  }
};

// Admin: Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await RenovationBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message
    });
  }
};

// Admin: Get booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await RenovationBooking.countDocuments();
    const pendingBookings = await RenovationBooking.countDocuments({ status: 'pending' });
    const inProgressBookings = await RenovationBooking.countDocuments({ status: 'in_progress' });
    const completedBookings = await RenovationBooking.countDocuments({ status: 'completed' });
    const cancelledBookings = await RenovationBooking.countDocuments({ status: 'cancelled' });

    const bookingsByStatus = await RenovationBooking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const bookingsByPriority = await RenovationBooking.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const totalRevenue = await RenovationBooking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$estimatedCost' } } }
    ]);

    const recentBookings = await RenovationBooking.find()
      .populate('service', 'title category')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('bookingId customer.name status createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        bookingsByStatus,
        bookingsByPriority,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentBookings
      }
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking statistics',
      error: error.message
    });
  }
};
