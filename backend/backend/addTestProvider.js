const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hoh108', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Service Provider Schema (simplified version)
const serviceProviderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'service_provider' },
  alternatePhone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OnDemandService' }],
  experienceYears: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  completedJobs: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'pending_verification', 'suspended'], default: 'active' },
  isVerified: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  availability: {
    monday: { available: Boolean, timeSlots: [{ start: String, end: String }] },
    tuesday: { available: Boolean, timeSlots: [{ start: String, end: String }] },
    wednesday: { available: Boolean, timeSlots: [{ start: String, end: String }] },
    thursday: { available: Boolean, timeSlots: [{ start: String, end: String }] },
    friday: { available: Boolean, timeSlots: [{ start: String, end: String }] },
    saturday: { available: Boolean, timeSlots: [{ start: String, end: String }] },
    sunday: { available: Boolean, timeSlots: [{ start: String, end: String }] }
  },
  documents: {
    aadhar: String,
    pan: String,
    verified: { type: Boolean, default: false }
  }
}, { timestamps: true });

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

async function createTestProvider() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test provider
    const provider = new ServiceProvider({
      fullName: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      password: hashedPassword,
      role: 'service_provider',
      alternatePhone: '9876543211',
      address: {
        street: 'MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      services: [],
      experienceYears: 5,
      rating: {
        average: 4.5,
        count: 10
      },
      completedJobs: 10,
      status: 'active',
      isVerified: true,
      isAvailable: true,
      availability: {
        monday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        tuesday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        wednesday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        thursday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        friday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        saturday: { available: true, timeSlots: [{ start: '09:00', end: '18:00' }] },
        sunday: { available: false, timeSlots: [] }
      },
      documents: {
        verified: true
      }
    });

    await provider.save();

    console.log('\n✅ Test Provider Created Successfully!\n');
    console.log('📋 Provider Details:');
    console.log('-------------------');
    console.log('Name:', provider.fullName);
    console.log('Email:', provider.email);
    console.log('Phone:', provider.phone);
    console.log('Password: password123');
    console.log('Role:', provider.role);
    console.log('Status:', provider.status);
    console.log('Rating:', provider.rating.average + '/5.0');
    console.log('Experience:', provider.experienceYears + ' years');
    console.log('\n🔐 Login Credentials for Provider App:');
    console.log('Phone: 9876543210');
    console.log('Password: password123');
    console.log('\n✨ You can now login to the provider app at http://localhost:8081\n');

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.error('\n❌ Error: Provider with this phone/email already exists!');
      console.log('\n💡 Existing Provider Login:');
      console.log('Phone: 9876543210');
      console.log('Password: password123');
      console.log('\nYou can login to the provider app at http://localhost:8081\n');
    } else {
      console.error('\n❌ Error creating provider:', error.message);
    }
    process.exit(1);
  }
}

// Run the function
createTestProvider();
