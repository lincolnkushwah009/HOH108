const mongoose = require('mongoose');
const ServiceProvider = require('./models/ServiceProvider');
const OnDemandBooking = require('./models/OnDemandBooking');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hoh108');

async function checkData() {
  try {
    // Find the provider
    const provider = await ServiceProvider.findOne({ phone: '9876543210' });

    if (!provider) {
      console.log('❌ Provider not found');
      process.exit(1);
    }

    console.log('✅ Provider found:');
    console.log('   ID:', provider._id);
    console.log('   Name:', provider.fullName);
    console.log('   Phone:', provider.phone);

    // Find bookings for this provider
    const bookings = await OnDemandBooking.find({ serviceProvider: provider._id });

    console.log('\n📋 Bookings found:', bookings.length);

    if (bookings.length > 0) {
      console.log('\nBooking Details:');
      bookings.forEach((booking, index) => {
        console.log(`\n${index + 1}. Booking ID: ${booking.bookingId || 'N/A'}`);
        console.log('   Status:', booking.status);
        console.log('   Customer:', booking.customer.name);
        console.log('   Scheduled:', booking.scheduledDate);
        console.log('   Service ID:', booking.service);
      });
    } else {
      console.log('\n❌ No bookings found for this provider');
      console.log('   Provider ID used for search:', provider._id);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkData();
