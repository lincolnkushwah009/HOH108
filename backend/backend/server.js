const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // In production, check against whitelist
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization']
}));

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const galleryRoutes = require('./routes/gallery');
const testimonialsRoutes = require('./routes/testimonials');
const estimateRoutes = require('./routes/estimate');
const leadsRoutes = require('./routes/leads');
const employeeRoutes = require('./routes/employees');
const adminLeadsRoutes = require('./routes/adminLeads');
const userRoutes = require('./routes/users');
const userPanelRoutes = require('./routes/userPanel');
const customerRoutes = require('./routes/customers');
const projectRoutes = require('./routes/projects');
const designRoutes = require('./routes/designs');
const dashboardRoutes = require('./routes/dashboard');
const blogRoutes = require('./routes/blogRoutes');
const kycRoutes = require('./routes/kycRoutes');
const paymentRoutes = require('./routes/payments');
const renovationServiceRoutes = require('./routes/renovationServices');
const renovationBookingRoutes = require('./routes/renovationBookings');
const onDemandServiceRoutes = require('./routes/onDemandServices');
const serviceProviderRoutes = require('./routes/serviceProviders');
const onDemandBookingRoutes = require('./routes/onDemandBookings');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/renovation-services', renovationServiceRoutes);
app.use('/api/renovation-bookings', renovationBookingRoutes);
app.use('/api/on-demand/services', onDemandServiceRoutes);
app.use('/api/on-demand/providers', serviceProviderRoutes); // Provider app routes
app.use('/api/admin/on-demand/providers', serviceProviderRoutes); // Admin routes
app.use('/api/on-demand/bookings', onDemandBookingRoutes);
app.use('/api/admin/employees', employeeRoutes);
app.use('/api/admin/leads', adminLeadsRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/customers', customerRoutes);
app.use('/api/admin/projects', projectRoutes);
app.use('/api/admin/designs', designRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/payments', paymentRoutes);
app.use('/api/user', userPanelRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HOH 108 API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to HOH 108 API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      gallery: '/api/gallery',
      testimonials: '/api/testimonials',
      estimate: '/api/estimate',
      leads: '/api/leads'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Handle multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB per file.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Please check the upload form.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interior_managers';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');

    // Start server only after successful database connection
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit if database connection fails
  });

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});
