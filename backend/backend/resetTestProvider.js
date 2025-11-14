const mongoose = require('mongoose');
const ServiceProvider = require('./models/ServiceProvider');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hoh108');

async function resetTestProvider() {
  try {
    // Delete existing provider
    await ServiceProvider.deleteOne({ phone: '9876543210' });
    console.log('✅ Deleted existing provider');

    // Create new provider with correct schema
    const provider = new ServiceProvider({
      fullName: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      password: 'password123', // Will be hashed by pre-save hook
      role: 'service_provider',
      alternatePhone: '9876543211',
      address: {
        street: 'MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      services: [],
      experience: {
        years: 5,
        description: 'Experienced service provider'
      },
      rating: {
        average: 4.5,
        count: 10
      },
      performance: {
        totalBookings: 10,
        completedBookings: 10,
        cancelledBookings: 0,
        onTimeCompletions: 9
      },
      status: 'active',
      verified: {
        email: true,
        phone: true,
        documents: true,
        background: true
      },
      availability: {
        status: 'available',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: {
          start: '09:00',
          end: '18:00'
        }
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
    console.log('Provider ID:', provider.providerId);
    console.log('Rating:', provider.rating.average + '/5.0');
    console.log('\n🔐 Login Credentials for Provider App:');
    console.log('Phone: 9876543210');
    console.log('Password: password123');
    console.log('\n✨ You can now login to the provider app at http://localhost:8081\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the function
resetTestProvider();
