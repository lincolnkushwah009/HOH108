const axios = require('axios');

async function testAPI() {
  try {
    // Login
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      phone: '9876543210',
      password: 'password123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 20) + '...');

    // Get provider bookings
    console.log('\n📋 Fetching provider bookings...');
    const bookingsResponse = await axios.get('http://localhost:8000/api/on-demand/providers/my-bookings', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('\n✅ Bookings fetched successfully');
    console.log('Total bookings:', bookingsResponse.data.data.length);

    if (bookingsResponse.data.data.length > 0) {
      console.log('\nFirst booking:');
      const booking = bookingsResponse.data.data[0];
      console.log('- ID:', booking.bookingId);
      console.log('- Status:', booking.status);
      console.log('- Customer:', booking.customer.name);
      console.log('- Scheduled:', booking.scheduledDate);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAPI();
