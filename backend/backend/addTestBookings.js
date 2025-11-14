const mongoose = require('mongoose');
const OnDemandBooking = require('./models/OnDemandBooking');
const OnDemandService = require('./models/OnDemandService');
const ServiceProvider = require('./models/ServiceProvider');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hoh108');

async function createTestBookings() {
  try {
    // Find the test provider
    const provider = await ServiceProvider.findOne({ phone: '9876543210' });

    if (!provider) {
      console.log('❌ Test provider not found. Please run addTestProvider.js first.');
      process.exit(1);
    }

    console.log('✅ Found provider:', provider.fullName);

    // Find or create a test service
    let service = await OnDemandService.findOne({ title: 'Plumbing Service' });

    if (!service) {
      service = await OnDemandService.create({
        title: 'Plumbing Service',
        category: 'Plumbing',
        description: 'Professional plumbing services for your home',
        image: 'https://via.placeholder.com/300',
        pricing: {
          type: 'fixed',
          basePrice: 500,
          currency: 'INR'
        },
        duration: {
          estimated: 1,
          unit: 'hours'
        },
        availability: {
          daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          timeSlots: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '18:00' }
          ],
          sameDay: true
        },
        active: true
      });
      console.log('✅ Created test service:', service.title);
    } else {
      console.log('✅ Found service:', service.title);
    }

    // Find or create a test customer
    let customer = await User.findOne({ email: 'customer@example.com' });

    if (!customer) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);

      customer = await User.create({
        fullName: 'Test Customer',
        email: 'customer@example.com',
        phone: '9999999999',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        address: {
          street: '123 Main Street',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        }
      });
      console.log('✅ Created test customer:', customer.fullName);
    } else {
      console.log('✅ Found customer:', customer.fullName);
    }

    // Delete existing test bookings
    await OnDemandBooking.deleteMany({
      'customer.email': 'customer@example.com'
    });
    console.log('🗑️  Cleared old test bookings');

    // Create test bookings with different statuses
    const bookings = [];

    // Today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Confirmed booking for today
    bookings.push({
      service: service._id,
      customer: {
        userId: customer._id,
        name: customer.fullName,
        email: customer.email,
        phone: customer.phone
      },
      serviceAddress: {
        addressLine1: '123 Main Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716] // Bangalore coordinates
        }
      },
      scheduledDate: new Date(today.getTime() + 10 * 60 * 60 * 1000), // Today 10 AM
      timeSlot: {
        start: '10:00',
        end: '12:00'
      },
      serviceProvider: provider._id,
      serviceDetails: {
        description: 'Fix leaking kitchen tap',
        requirements: ['Tap repair', 'Leak fixing'],
        specialInstructions: 'Please call before arriving'
      },
      pricing: {
        serviceCharge: 500,
        materials: 200,
        tax: 70,
        total: 770,
        advancePaid: 0,
        remainingAmount: 770
      },
      payment: {
        method: 'cash',
        status: 'pending'
      },
      status: 'confirmed',
      statusHistory: [
        { status: 'pending', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) }
      ]
    });

    // 2. On the way booking
    bookings.push({
      service: service._id,
      customer: {
        userId: customer._id,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '9888888888'
      },
      serviceAddress: {
        addressLine1: '45 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560002',
        location: {
          type: 'Point',
          coordinates: [77.6033, 12.9784]
        }
      },
      scheduledDate: new Date(today.getTime() + 11 * 60 * 60 * 1000), // Today 11 AM
      timeSlot: {
        start: '11:00',
        end: '13:00'
      },
      serviceProvider: provider._id,
      serviceDetails: {
        description: 'Bathroom pipe replacement',
        requirements: ['Pipe replacement'],
        specialInstructions: 'Ring doorbell twice'
      },
      pricing: {
        serviceCharge: 800,
        materials: 500,
        tax: 130,
        total: 1430,
        advancePaid: 500,
        remainingAmount: 930
      },
      payment: {
        method: 'upi',
        status: 'partial'
      },
      status: 'provider_on_way',
      statusHistory: [
        { status: 'pending', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { status: 'provider_on_way', timestamp: new Date(Date.now() - 30 * 60 * 1000) }
      ],
      providerArrival: {
        estimatedTime: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    // 3. In progress booking
    bookings.push({
      service: service._id,
      customer: {
        userId: customer._id,
        name: 'Amit Kumar',
        email: 'amit@example.com',
        phone: '9777777777'
      },
      serviceAddress: {
        addressLine1: '78 Brigade Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        location: {
          type: 'Point',
          coordinates: [77.6067, 12.9716]
        }
      },
      scheduledDate: new Date(today.getTime() + 9 * 60 * 60 * 1000), // Today 9 AM
      timeSlot: {
        start: '09:00',
        end: '11:00'
      },
      serviceProvider: provider._id,
      serviceDetails: {
        description: 'Water heater installation',
        requirements: ['Installation', 'Testing'],
        specialInstructions: 'Equipment available on site'
      },
      pricing: {
        serviceCharge: 1200,
        materials: 3000,
        tax: 420,
        total: 4620,
        advancePaid: 2000,
        remainingAmount: 2620
      },
      payment: {
        method: 'card',
        status: 'partial'
      },
      status: 'in_progress',
      statusHistory: [
        { status: 'pending', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
        { status: 'provider_on_way', timestamp: new Date(Date.now() - 90 * 60 * 1000) },
        { status: 'in_progress', timestamp: new Date(Date.now() - 60 * 60 * 1000) }
      ],
      workDuration: {
        startTime: new Date(Date.now() - 60 * 60 * 1000)
      }
    });

    // 4. Work completed - ready for OTP
    bookings.push({
      service: service._id,
      customer: {
        userId: customer._id,
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '9666666666'
      },
      serviceAddress: {
        addressLine1: '12 Indiranagar',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
        location: {
          type: 'Point',
          coordinates: [77.6408, 12.9784]
        }
      },
      scheduledDate: new Date(today.getTime() + 8 * 60 * 60 * 1000), // Today 8 AM
      timeSlot: {
        start: '08:00',
        end: '10:00'
      },
      serviceProvider: provider._id,
      serviceDetails: {
        description: 'Kitchen sink blockage',
        requirements: ['Drain cleaning'],
        specialInstructions: 'Use service entrance'
      },
      pricing: {
        serviceCharge: 600,
        materials: 150,
        tax: 75,
        total: 825,
        advancePaid: 0,
        remainingAmount: 825
      },
      payment: {
        method: 'cash',
        status: 'pending'
      },
      status: 'work_completed',
      statusHistory: [
        { status: 'pending', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
        { status: 'provider_on_way', timestamp: new Date(Date.now() - 150 * 60 * 1000) },
        { status: 'in_progress', timestamp: new Date(Date.now() - 120 * 60 * 1000) },
        { status: 'work_completed', timestamp: new Date(Date.now() - 10 * 60 * 1000) }
      ],
      workDuration: {
        startTime: new Date(Date.now() - 120 * 60 * 1000),
        endTime: new Date(Date.now() - 10 * 60 * 1000),
        actualDuration: 110
      }
    });

    // 5. Tomorrow's booking
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    bookings.push({
      service: service._id,
      customer: {
        userId: customer._id,
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        phone: '9555555555'
      },
      serviceAddress: {
        addressLine1: '90 Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        location: {
          type: 'Point',
          coordinates: [77.6191, 12.9352]
        }
      },
      scheduledDate: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000), // Tomorrow 2 PM
      timeSlot: {
        start: '14:00',
        end: '16:00'
      },
      serviceProvider: provider._id,
      serviceDetails: {
        description: 'Bathroom renovation consultation',
        requirements: ['Consultation', 'Quotation'],
        specialInstructions: 'Bring design samples'
      },
      pricing: {
        serviceCharge: 300,
        materials: 0,
        tax: 30,
        total: 330,
        advancePaid: 0,
        remainingAmount: 330
      },
      payment: {
        method: 'cash',
        status: 'pending'
      },
      status: 'confirmed',
      statusHistory: [
        { status: 'pending', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000) }
      ]
    });

    // 6. Completed booking (for history)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    bookings.push({
      service: service._id,
      customer: {
        userId: customer._id,
        name: 'Lakshmi Iyer',
        email: 'lakshmi@example.com',
        phone: '9444444444'
      },
      serviceAddress: {
        addressLine1: '33 Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560066',
        location: {
          type: 'Point',
          coordinates: [77.7499, 12.9698]
        }
      },
      scheduledDate: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000),
      timeSlot: {
        start: '10:00',
        end: '12:00'
      },
      serviceProvider: provider._id,
      serviceDetails: {
        description: 'Emergency leak repair',
        requirements: ['Emergency service'],
        specialInstructions: 'Urgent - water leaking'
      },
      pricing: {
        serviceCharge: 1000,
        materials: 300,
        tax: 130,
        total: 1430,
        advancePaid: 0,
        remainingAmount: 0
      },
      payment: {
        method: 'cash',
        status: 'completed',
        paidAt: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000)
      },
      status: 'completed',
      statusHistory: [
        { status: 'pending', timestamp: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000) },
        { status: 'confirmed', timestamp: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000) },
        { status: 'provider_on_way', timestamp: new Date(yesterday.getTime() + 9.5 * 60 * 60 * 1000) },
        { status: 'in_progress', timestamp: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000) },
        { status: 'work_completed', timestamp: new Date(yesterday.getTime() + 12 * 60 * 60 * 1000) },
        { status: 'completed', timestamp: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000) }
      ],
      workDuration: {
        startTime: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000),
        endTime: new Date(yesterday.getTime() + 12 * 60 * 60 * 1000),
        actualDuration: 120
      },
      rating: {
        customerToProvider: {
          rating: 5,
          review: 'Excellent service! Very professional and quick.',
          ratedAt: new Date(yesterday.getTime() + 15 * 60 * 60 * 1000)
        }
      }
    });

    // Insert all bookings one by one to trigger pre-save hooks
    const createdBookings = [];
    for (const bookingData of bookings) {
      const booking = await OnDemandBooking.create(bookingData);
      createdBookings.push(booking);
    }

    console.log(`\n✅ Created ${createdBookings.length} test bookings!\n`);
    console.log('📊 Booking Summary:');
    console.log('------------------');
    console.log(`Today's bookings: ${bookings.filter(b => {
      const bookingDate = new Date(b.scheduledDate);
      return bookingDate.toDateString() === today.toDateString();
    }).length}`);
    console.log(`Tomorrow's bookings: 1`);
    console.log(`Completed bookings: 1`);
    console.log('\n📍 Status Breakdown:');
    console.log('- Confirmed: 2');
    console.log('- On the way: 1');
    console.log('- In progress: 1');
    console.log('- Work completed (ready for OTP): 1');
    console.log('- Completed: 1');

    console.log('\n🔐 Test Provider Login:');
    console.log('Phone: 9876543210');
    console.log('Password: password123');
    console.log('\n✨ You can now login to the provider app and see all these bookings!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test bookings:', error);
    process.exit(1);
  }
}

createTestBookings();
