const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const OnDemandService = require('./models/OnDemandService');

// Services data - Only 5 services
const services = [
  {
    title: 'Plumbing',
    description: 'Transform your home with our comprehensive professional plumbing services designed to solve all your water and drainage needs. Our team of certified and experienced plumbers brings years of expertise in handling everything from minor repairs to major installations. We understand that plumbing issues can disrupt your daily routine, which is why we offer same-day service availability and emergency support to ensure your home runs smoothly. Our services cover the complete spectrum of plumbing work including tap and pipe repairs, toilet and bathroom fitting, water heater installation and maintenance, drainage cleaning and unclogging, leak detection using advanced equipment, and fixing of all types of plumbing fixtures. We use only high-quality materials and modern techniques to ensure long-lasting results. Every job comes with a service warranty and our plumbers are trained to maintain cleanliness during and after the work. Whether you need a simple tap replacement or a complete bathroom plumbing overhaul, our experts provide reliable solutions with transparent pricing and no hidden costs. We prioritize customer satisfaction and stand behind our work with quality guarantees.',
    category: 'Plumbing',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800',
    pricing: {
      type: 'hourly',
      basePrice: 299,
      hourlyRate: 299,
      minHours: 1
    },
    duration: {
      estimated: 1,
      unit: 'hours'
    },
    features: [
      'Tap & pipe repairs',
      'Toilet & bathroom fitting',
      'Water heater installation',
      'Drainage cleaning',
      'Leak detection & fixing',
      'Emergency services available'
    ],
    includedItems: ['Basic tools and materials', 'Service warranty', 'Professional expertise'],
    availability: {
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      timeSlots: [
        { start: '08:00', end: '12:00' },
        { start: '12:00', end: '16:00' },
        { start: '16:00', end: '20:00' }
      ],
      advanceBookingDays: 3,
      sameDay: true
    },
    popular: true,
    active: true
  },
  {
    title: 'Electrical',
    description: 'Ensure the safety and efficiency of your home or office with our certified professional electrical services. Our team of licensed electricians brings extensive experience and knowledge to handle all types of electrical work with the highest safety standards. Electrical work requires precision, expertise, and strict adherence to safety codes - that\'s exactly what we deliver. We specialize in comprehensive electrical solutions including complete home wiring and rewiring, switchboard repairs and upgrades, installation of lights, fans, and other fixtures, circuit breaker troubleshooting and fixing, power socket repairs and installations, and thorough electrical safety inspections. Every electrician on our team is certified and regularly trained on the latest electrical codes and technologies. We use only premium quality electrical components and follow strict safety protocols to protect your property and loved ones. Our services include detailed electrical system assessments, identification of potential hazards, and recommendations for upgrades to improve efficiency and safety. Whether you need emergency electrical repairs or planned installations, we respond promptly with all necessary tools and materials. We guarantee all our electrical work with comprehensive warranties and ensure complete compliance with local electrical codes and regulations.',
    category: 'Electrical',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
    pricing: {
      type: 'hourly',
      basePrice: 349,
      hourlyRate: 349,
      minHours: 1
    },
    duration: {
      estimated: 1,
      unit: 'hours'
    },
    features: [
      'Wiring & rewiring',
      'Switchboard repairs',
      'Light & fan installation',
      'Circuit breaker fixing',
      'Power socket repairs',
      'Electrical safety inspection'
    ],
    includedItems: ['Basic tools and materials', 'Service warranty', 'Professional expertise'],
    availability: {
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      timeSlots: [
        { start: '08:00', end: '12:00' },
        { start: '12:00', end: '16:00' },
        { start: '16:00', end: '20:00' }
      ],
      advanceBookingDays: 3,
      sameDay: true
    },
    popular: true,
    active: true
  },
  {
    title: 'Painting',
    description: 'Give your home a fresh, vibrant look with our expert professional painting services that combine artistic skill with technical precision. Our team of experienced painters specializes in transforming residential and commercial spaces with beautiful, long-lasting finishes that enhance the aesthetic appeal and value of your property. We offer comprehensive painting solutions for both interior and exterior surfaces including walls, ceilings, doors, windows, and decorative elements. Our service begins with thorough surface preparation - we clean, sand, repair cracks, and apply primer to ensure the paint adheres perfectly and lasts for years. We work exclusively with premium quality paints from trusted brands that offer excellent coverage, durability, and fade resistance. Our painters are skilled in various techniques including standard painting, texture painting, stencil work, and decorative finishes to match your vision perfectly. We understand that painting can be disruptive, so we work efficiently while maintaining high quality standards, protecting your furniture and belongings, and ensuring minimal mess. Every project includes proper masking, drop cloth protection, and thorough cleanup after completion. We provide color consultation to help you choose the perfect shades that complement your space and personal style. Whether it\'s a single room refresh or a complete home makeover, we deliver exceptional results with attention to detail and customer satisfaction guaranteed.',
    category: 'Painting',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
    pricing: {
      type: 'per_unit',
      basePrice: 12,
      unitPrice: 12,
      unitName: 'sq.ft'
    },
    duration: {
      estimated: 3,
      unit: 'hours'
    },
    features: [
      'Wall painting (interior & exterior)',
      'Ceiling painting',
      'Texture painting',
      'Primer application',
      'Surface preparation',
      'Premium quality paints',
      'Cleaning after work'
    ],
    includedItems: ['Premium paints', 'All tools and equipment', 'Surface preparation', 'Post-work cleanup'],
    availability: {
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: [
        { start: '08:00', end: '12:00' },
        { start: '12:00', end: '16:00' }
      ],
      advanceBookingDays: 5,
      sameDay: false
    },
    popular: true,
    trending: true,
    active: true
  },
  {
    title: 'Furniture Installation',
    description: 'Save time and ensure perfect assembly with our professional furniture installation and assembly services. Our skilled technicians specialize in assembling and installing all types of furniture, from simple pieces to complex modular systems, ensuring every item is secure, stable, and built to last. We understand that furniture assembly can be time-consuming and frustrating, especially with complex instructions and numerous parts. That\'s where our expertise makes a difference. Our team is experienced in handling furniture from all major brands and manufacturers, familiar with various assembly systems and techniques. We provide comprehensive installation services for beds of all types including platform beds, storage beds, and bunk beds, complete wardrobe and closet systems, dining tables and chairs, office desks and workstations, TV units and entertainment centers, bookshelves and storage units, kitchen cabinets and islands, and outdoor furniture. Every installation includes careful inspection of all parts, precise assembly following manufacturer specifications, proper leveling and alignment, secure wall mounting where required, and thorough testing to ensure stability and functionality. We bring all necessary professional tools and equipment, work efficiently to minimize disruption to your day, and clean up completely after the job. Our technicians take extra care to protect your floors and walls during the installation process. We also offer disassembly and reassembly services for moves or room rearrangements. With our furniture installation service, you can enjoy your new furniture immediately without the hassle of DIY assembly.',
    category: 'Carpentry',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
    pricing: {
      type: 'fixed',
      basePrice: 499
    },
    duration: {
      estimated: 2,
      unit: 'hours'
    },
    features: [
      'Bed assembly',
      'Wardrobe installation',
      'Table & chair assembly',
      'Shelf mounting',
      'Cabinet installation',
      'TV unit assembly',
      'All hardware included'
    ],
    includedItems: ['Professional tools', 'Assembly service', 'Quality check', 'Secure installation'],
    availability: {
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      timeSlots: [
        { start: '08:00', end: '12:00' },
        { start: '12:00', end: '16:00' },
        { start: '16:00', end: '20:00' }
      ],
      advanceBookingDays: 2,
      sameDay: true
    },
    popular: true,
    trending: true,
    active: true
  },
  {
    title: 'Deep Cleaning',
    description: 'Experience the difference of a truly clean space with our comprehensive professional deep cleaning services designed to restore your home or office to pristine condition. Our expert cleaning team goes beyond regular cleaning to eliminate dirt, grime, and bacteria from every corner, creating a healthier and more pleasant environment for you and your family. Deep cleaning is essential for maintaining hygiene and extending the life of your furnishings and fixtures. Our service covers every area of your space with meticulous attention to detail. We specialize in intensive kitchen cleaning including degreasing of countertops, cabinets, and appliances, thorough scrubbing of tiles and grout, cleaning inside ovens and microwaves, and sanitizing all surfaces. Our bathroom deep cleaning includes removing soap scum and limescale, disinfecting toilets and sinks, cleaning shower doors and tiles, polishing fixtures and fittings, and eliminating mold and mildew. For living areas and bedrooms, we provide comprehensive dusting of all surfaces including hard-to-reach areas, vacuuming and mopping of all floors, cleaning under furniture and behind appliances, window and glass cleaning, and detailed attention to baseboards and corners. We use only eco-friendly, non-toxic cleaning products that are safe for children and pets while being highly effective against dirt and germs. Our team arrives with professional-grade equipment including high-powered vacuums, steam cleaners, and specialized tools for different surfaces. Every team member is trained in proper cleaning techniques and follows a detailed checklist to ensure nothing is missed. We understand that every home is unique, so we customize our approach based on your specific needs and concerns. Whether you need a one-time deep clean, post-renovation cleaning, or regular deep cleaning services, we deliver exceptional results that exceed your expectations.',
    category: 'Cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    pricing: {
      type: 'fixed',
      basePrice: 2499
    },
    duration: {
      estimated: 4,
      unit: 'hours'
    },
    features: [
      'Kitchen deep cleaning',
      'Bathroom deep cleaning',
      'Floor scrubbing & mopping',
      'Furniture dusting',
      'Window & glass cleaning',
      'Balcony cleaning',
      'Eco-friendly products',
      'Professional equipment'
    ],
    includedItems: ['Cleaning materials', 'Professional equipment', 'Eco-friendly products', 'Trained cleaning staff'],
    availability: {
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: [
        { start: '08:00', end: '12:00' },
        { start: '12:00', end: '16:00' }
      ],
      advanceBookingDays: 3,
      sameDay: false
    },
    popular: true,
    active: true
  }
];

const seedServices = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hoh108');
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing services
    console.log('🗑️  Clearing existing services...');
    await OnDemandService.deleteMany({});
    console.log('✅ Existing services cleared');

    // Insert new services
    console.log('📝 Creating 5 on-demand services...');
    const createdServices = [];
    for (const serviceData of services) {
      const service = await OnDemandService.create(serviceData);
      createdServices.push(service);
      console.log(`✅ Created: ${service.title} (ID: ${service._id})`);
    }

    console.log('\n🎉 Successfully seeded 5 on-demand services!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Services:');
    createdServices.forEach((service, index) => {
      let pricing = '';
      if (service.pricing.type === 'hourly') {
        pricing = `₹${service.pricing.hourlyRate}/hr`;
      } else if (service.pricing.type === 'per_unit') {
        pricing = `₹${service.pricing.unitPrice}/${service.pricing.unitName}`;
      } else {
        pricing = `₹${service.pricing.basePrice}`;
      }
      console.log(`${index + 1}. ${service.title} - ${pricing}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedServices();
