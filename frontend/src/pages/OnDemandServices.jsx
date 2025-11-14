/**
 * On-Demand Services (ODS) Page - Premium Luxury Edition
 *
 * User-facing page for browsing and booking ondemand services
 * Features: Premium design, glass morphism, service comparison
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { API_ENDPOINTS } from '../config/api'

const OnDemandServices = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedService, setSelectedService] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showComparisonModal, setShowComparisonModal] = useState(false)
  const [comparisonServices, setComparisonServices] = useState([])
  const [bookingId, setBookingId] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    serviceDate: '',
    timeSlot: '',
    alternatePhone: '',
    message: ''
  })

  const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'AC Service', 'Pest Control', 'Appliance Repair', 'Salon & Beauty', 'Painting']

  const timeSlots = [
    { value: 'morning', label: 'Morning (8 AM - 12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 4 PM)' },
    { value: 'evening', label: 'Evening (4 PM - 8 PM)' }
  ]

  // UrbanClap-style On-Demand Services
  const mockServices = [
    {
      _id: '1',
      title: 'Plumbing Services',
      description: 'Professional plumbing solutions for all your needs. Expert plumbers available for repairs, installations, and maintenance.',
      category: 'Plumbing',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800',
      pricing: { type: 'hourly', basePrice: 299, hourlyRate: 299, minHours: 1 },
      features: [
        'Tap & pipe repairs',
        'Toilet & bathroom fitting',
        'Water heater installation',
        'Drainage cleaning',
        'Leak detection & fixing',
        'Emergency services'
      ],
      duration: { estimated: 1, unit: 'hours' },
      popular: true
    },
    {
      _id: '2',
      title: 'Electrical Services',
      description: 'Certified electricians for all electrical work. Safe and reliable solutions for your home and office electrical needs.',
      category: 'Electrical',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
      pricing: { type: 'hourly', basePrice: 349, hourlyRate: 349, minHours: 1 },
      features: [
        'Wiring & rewiring',
        'Switch & socket installation',
        'MCB & fuse replacement',
        'Fan & light installation',
        'Appliance installation',
        'Safety inspection'
      ],
      duration: { estimated: 1, unit: 'hours' },
      popular: true
    },
    {
      _id: '3',
      title: 'Home Deep Cleaning',
      description: 'Professional deep cleaning service. Thorough cleaning of your entire home with eco-friendly products.',
      category: 'Cleaning',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
      pricing: { type: 'fixed', basePrice: 2499 },
      features: [
        'Kitchen deep clean',
        'Bathroom sanitization',
        'Floor mopping & polishing',
        'Dusting & vacuuming',
        'Balcony cleaning',
        'Eco-friendly products'
      ],
      duration: { estimated: 3, unit: 'hours' },
      popular: true
    },
    {
      _id: '4',
      title: 'AC Service & Repair',
      description: 'Complete AC maintenance and repair. Keep your AC running efficiently with our expert technicians.',
      category: 'AC Service',
      image: 'https://images.unsplash.com/photo-1631545806609-c8d6c91143c7?w=800',
      pricing: { type: 'fixed', basePrice: 399 },
      features: [
        'AC gas refilling',
        'Deep cleaning & servicing',
        'Filter replacement',
        'Cooling issue diagnosis',
        'Installation & uninstallation',
        'Annual maintenance'
      ],
      duration: { estimated: 1, unit: 'hours' }
    },
    {
      _id: '5',
      title: 'Pest Control Service',
      description: 'Safe and effective pest control. Get rid of cockroaches, ants, mosquitoes, and other pests.',
      category: 'Pest Control',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
      pricing: { type: 'fixed', basePrice: 899 },
      features: [
        'Cockroach control',
        'Mosquito control',
        'Ant treatment',
        'Termite treatment',
        'Rodent control',
        'Safe chemicals used'
      ],
      duration: { estimated: 1, unit: 'hours' },
      popular: true
    },
    {
      _id: '6',
      title: 'Washing Machine Repair',
      description: 'Expert repair for all washing machine brands. Quick and reliable service at your doorstep.',
      category: 'Appliance Repair',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800',
      pricing: { type: 'hourly', basePrice: 299, hourlyRate: 299, minHours: 1 },
      features: [
        'Not starting issues',
        'Drainage problems',
        'Spin cycle repair',
        'Noise issues',
        'Leak fixing',
        'All brands supported'
      ],
      duration: { estimated: 1, unit: 'hours' }
    },
    {
      _id: '7',
      title: 'Salon at Home - Women',
      description: 'Premium salon services at your home. Professional beauticians for haircare, skincare, and makeup.',
      category: 'Salon & Beauty',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      pricing: { type: 'fixed', basePrice: 599 },
      features: [
        'Hair cut & styling',
        'Hair spa & treatments',
        'Facial & cleanup',
        'Waxing & threading',
        'Manicure & pedicure',
        'Bridal makeup'
      ],
      duration: { estimated: 2, unit: 'hours' },
      popular: true
    },
    {
      _id: '8',
      title: 'Wall Painting Service',
      description: 'Professional painting service for your walls. Quality paints and skilled painters for perfect finish.',
      category: 'Painting',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
      pricing: { type: 'per_unit', basePrice: 12, unitPrice: 12, unitName: 'sq.ft' },
      features: [
        'Interior painting',
        'Exterior painting',
        'Wall preparation',
        'Premium paint brands',
        'Color consultation',
        'Furniture protection'
      ],
      duration: { estimated: 1, unit: 'days' }
    }
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ON_DEMAND_SERVICES)
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        setServices(data.data)
      } else {
        // Fallback to mock services if no services in database
        setServices(mockServices)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      // Fallback to mock services on error
      setServices(mockServices)
    }
  }

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(service => service.category === selectedCategory)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleBookService = (service) => {
    setSelectedService(service)
    setShowBookingModal(true)
  }

  const toggleCompareService = (service) => {
    setComparisonServices(prev => {
      const exists = prev.find(s => s._id === service._id)
      if (exists) {
        return prev.filter(s => s._id !== service._id)
      } else if (prev.length < 3) {
        return [...prev, service]
      }
      return prev
    })
  }

  const handleSubmitBooking = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse time slot to get start and end times
      const timeSlotMap = {
        'morning': { start: '08:00', end: '12:00' },
        'afternoon': { start: '12:00', end: '16:00' },
        'evening': { start: '16:00', end: '20:00' }
      }

      const timeSlotData = timeSlotMap[formData.timeSlot] || { start: '09:00', end: '17:00' }

      const bookingData = {
        serviceId: selectedService._id,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          alternatePhone: formData.alternatePhone
        },
        serviceAddress: {
          addressLine1: formData.address,
          city: formData.city,
          state: 'India', // You can make this dynamic
          pincode: formData.pincode
        },
        scheduledDate: formData.serviceDate,
        timeSlot: timeSlotData,
        serviceDetails: {
          description: formData.message || 'On-demand service booking'
        },
        pricing: {
          serviceCharge: selectedService.pricing.basePrice || selectedService.pricing.hourlyRate || 0,
          total: selectedService.pricing.basePrice || selectedService.pricing.hourlyRate || 0
        },
        source: 'Website'
      }

      console.log('Submitting On-Demand Service Booking:', bookingData)

      const response = await fetch(API_ENDPOINTS.ON_DEMAND_BOOKING_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (data.success) {
        setBookingId(data.data.bookingId)
        setShowBookingModal(false)
        setShowSuccessModal(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          pincode: '',
          serviceDate: '',
          timeSlot: '',
          alternatePhone: '',
          message: ''
        })
      } else {
        alert(data.message || 'Failed to submit booking. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to submit booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (pricing) => {
    if (pricing.type === 'fixed') {
      return `₹${pricing.basePrice}`
    } else if (pricing.type === 'hourly') {
      return `₹${pricing.hourlyRate}/hr`
    } else if (pricing.type === 'per_unit') {
      return `₹${pricing.unitPrice}/${pricing.unitName}`
    } else {
      return `₹${pricing.basePrice}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar />

      {/* Premium Hero Section with Glass Morphism */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg">
                ✨ Premium On-Demand Service Services
              </span>
            </motion.div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 bg-clip-text text-transparent">
              Quick Solutions, Anytime
            </h1>
            <p className="font-body text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
              Professional home services at your doorstep. Book trusted experts for plumbing, cleaning, beauty, repairs and more!
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              {[
                { icon: '✅', text: 'Verified Professionals' },
                { icon: '⏱️', text: 'Same Day Service' },
                { icon: '💯', text: 'Quality Guaranteed' },
                { icon: '🏆', text: 'Best Prices' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-gray-800">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Category Filter with Glass Effect */}
      <section className="sticky top-20 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <span className="font-semibold text-sm text-gray-700 whitespace-nowrap mr-2">Filter by:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Premium Card with Glass Morphism */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-500"></div>

                {/* Service Image with Overlay */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Popular Badge */}
                  {service.popular && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-purple-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                    >
                      <span>⭐</span> Popular
                    </motion.div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                    {service.category}
                  </div>

                  {/* Compare Checkbox */}
                  <div className="absolute top-4 left-4">
                    <label className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-full cursor-pointer hover:scale-105 transition-transform shadow-lg">
                      <input
                        type="checkbox"
                        checked={comparisonServices.some(s => s._id === service._id)}
                        onChange={() => toggleCompareService(service)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        disabled={comparisonServices.length >= 3 && !comparisonServices.some(s => s._id === service._id)}
                      />
                      <span className="text-xs font-semibold text-gray-700">Compare</span>
                    </label>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6 relative z-10">
                  <h3 className="font-heading text-2xl mb-3 bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent group-hover:scale-105 transition-transform origin-left">
                    {service.title}
                  </h3>
                  <p className="font-body text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features with Icons */}
                  {service.features && service.features.length > 0 && (
                    <div className="mb-5 space-y-2">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-purple-600 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 3 && (
                        <p className="text-xs text-gray-500 italic ml-5">+{service.features.length - 3} more premium features</p>
                      )}
                    </div>
                  )}

                  {/* Price and Duration - Premium Design */}
                  <div className="flex items-center justify-between mb-5 pt-5 border-t border-gray-200/50">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Starting from</p>
                      <p className="font-heading text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {formatPrice(service.pricing)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="font-semibold text-sm text-gray-700">
                        {service.duration.min}-{service.duration.max} {service.duration.unit}
                      </p>
                    </div>
                  </div>

                  {/* Premium CTA Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/service/${service._id}`)
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                      <span>View Details</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating Comparison Bar */}
      <AnimatePresence>
        {comparisonServices.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">
                    {comparisonServices.length} service{comparisonServices.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    {comparisonServices.map(service => (
                      <div key={service._id} className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-full text-sm">
                        <span className="font-medium text-purple-900">{service.title}</span>
                        <button
                          onClick={() => toggleCompareService(service)}
                          className="text-purple-600 hover:text-orange-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setComparisonServices([])}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowComparisonModal(true)}
                    disabled={comparisonServices.length < 2}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Compare Services
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparisonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowComparisonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-3xl bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent">
                    Compare Services
                  </h2>
                  <button
                    onClick={() => setShowComparisonModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-4 font-semibold text-gray-700">Feature</th>
                        {comparisonServices.map(service => (
                          <th key={service._id} className="p-4 text-center">
                            <div className="font-heading text-lg bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent">
                              {service.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{service.category}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 font-semibold text-gray-700">Image</td>
                        {comparisonServices.map(service => (
                          <td key={service._id} className="p-4">
                            <img src={service.image} alt={service.title} className="w-full h-32 object-cover rounded-xl" />
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="p-4 font-semibold text-gray-700">Price</td>
                        {comparisonServices.map(service => (
                          <td key={service._id} className="p-4 text-center">
                            <span className="font-heading text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {formatPrice(service.pricing)}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 font-semibold text-gray-700">Duration</td>
                        {comparisonServices.map(service => (
                          <td key={service._id} className="p-4 text-center text-gray-600">
                            {service.duration.min}-{service.duration.max} {service.duration.unit}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <td className="p-4 font-semibold text-gray-700">Description</td>
                        {comparisonServices.map(service => (
                          <td key={service._id} className="p-4 text-sm text-gray-600">
                            {service.description}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-4 font-semibold text-gray-700">Features</td>
                        {comparisonServices.map(service => (
                          <td key={service._id} className="p-4">
                            <ul className="space-y-2 text-sm">
                              {service.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-600">
                                  <span className="text-purple-600 mt-0.5">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4"></td>
                        {comparisonServices.map(service => (
                          <td key={service._id} className="p-4">
                            <button
                              onClick={() => {
                                setShowComparisonModal(false)
                                handleBookService(service)
                              }}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                            >
                              Book Now
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-3xl bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent">
                    Book Your Service
                  </h2>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedService && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50">
                    <h3 className="font-heading text-xl bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent mb-2">
                      {selectedService.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{selectedService.description.slice(0, 100)}...</p>
                    <p className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(selectedService.pricing)}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmitBooking} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Alternate Phone</label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Alternate number (optional)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Flat/House No, Building Name, Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Your city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="6-digit pincode"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Service Date *</label>
                      <input
                        type="date"
                        name="serviceDate"
                        value={formData.serviceDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot *</label>
                      <select
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select time slot</option>
                        {timeSlots.map(slot => (
                          <option key={slot.value} value={slot.value}>{slot.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Requirements</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Any specific requirements or instructions for the service provider..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Service Request</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <h3 className="font-heading text-3xl mb-3 bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent">
                Booking Confirmed!
              </h3>
              <p className="font-body text-gray-600 mb-6 leading-relaxed">
                Your ondemand service request has been received successfully. Our team will reach out to you soon!
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-6 border border-purple-200/50">
                <p className="text-sm text-gray-600 mb-2">Your Booking ID</p>
                <p className="font-mono text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {bookingId}
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                📧 Confirmation email sent<br />
                📞 We'll contact you within 24 hours
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default OnDemandServices
