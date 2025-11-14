/**
 * Construction Services Page - Premium Luxury Edition
 *
 * User-facing page for browsing and booking construction services
 * Features: Premium design, glass morphism, service comparison
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Construction = () => {
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
    propertyType: 'Residential',
    area: '',
    rooms: '',
    budget: '',
    preferredStyle: '',
    startDate: '',
    message: ''
  })

  const categories = ['All', 'Residential', 'Commercial', 'Office', 'Hospitality', 'Full Home']

  const designStyles = ['Modern', 'Contemporary', 'Traditional', 'Minimalist', 'Scandinavian', 'Industrial', 'Bohemian', 'Luxury']

  // Mock construction services
  const mockServices = [
    {
      _id: '1',
      title: 'Living Room Construction',
      description: 'Transform your living space with our expert construction. Complete living room construction including furniture selection, color schemes, lighting design, and decor placement.',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
      pricing: { type: 'per_sqft', basePrice: 450, minPrice: 45000, maxPrice: 150000 },
      features: [
        'Space planning and layout design',
        '3D visualization and renders',
        'Furniture selection and procurement',
        'Color consultation',
        'Lighting design',
        'Decor and accessories'
      ],
      duration: { min: 3, max: 6, unit: 'weeks' },
      popular: true
    },
    {
      _id: '2',
      title: 'Bedroom Construction',
      description: 'Create your dream bedroom sanctuary. Complete bedroom construction including wardrobe, bed design, lighting, and comfortable ambiance creation.',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
      pricing: { type: 'per_sqft', basePrice: 400, minPrice: 35000, maxPrice: 120000 },
      features: [
        'Master bedroom design',
        'Wardrobe and storage solutions',
        'Bed and furniture design',
        'Mood lighting setup',
        'Window treatments',
        'Personal styling consultation'
      ],
      duration: { min: 2, max: 5, unit: 'weeks' },
      popular: true
    },
    {
      _id: '3',
      title: 'Modular Kitchen Construction',
      description: 'Functional and beautiful kitchen construction. Complete modular kitchen with premium materials, smart storage, appliances integration, and modern aesthetics.',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      pricing: { type: 'fixed', basePrice: 250000, minPrice: 150000, maxPrice: 800000 },
      features: [
        'Modular kitchen cabinets',
        'Countertop selection',
        'Appliances integration',
        'Chimney and hob setup',
        'Storage optimization',
        'Backsplash design'
      ],
      duration: { min: 4, max: 8, unit: 'weeks' },
      popular: true
    },
    {
      _id: '4',
      title: 'Office Construction',
      description: 'Professional office space construction for productivity. Modern office construction with ergonomic furniture, efficient layouts, and brand-aligned aesthetics.',
      category: 'Office',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      pricing: { type: 'per_sqft', basePrice: 350, minPrice: 200000, maxPrice: 1000000 },
      features: [
        'Workspace planning',
        'Ergonomic furniture',
        'Meeting room design',
        'Reception area design',
        'Branding integration',
        'Cable management'
      ],
      duration: { min: 6, max: 12, unit: 'weeks' }
    },
    {
      _id: '5',
      title: 'Full Home Construction',
      description: 'Complete home construction solution. End-to-end construction for entire home including all rooms, coordination, and project management.',
      category: 'Full Home',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
      pricing: { type: 'custom', basePrice: 800000, minPrice: 500000, maxPrice: 5000000 },
      features: [
        'Complete home design',
        'All rooms coordination',
        'Consistent theme',
        'Project management',
        'Quality materials',
        'Timely execution',
        'Post-completion support'
      ],
      duration: { min: 8, max: 16, unit: 'weeks' },
      popular: true
    },
    {
      _id: '6',
      title: 'Restaurant Construction',
      description: 'Attractive restaurant and cafe construction. Design that enhances dining experience with perfect ambiance, seating arrangements, and branding.',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      pricing: { type: 'per_sqft', basePrice: 500, minPrice: 300000, maxPrice: 2000000 },
      features: [
        'Dining area layout',
        'Kitchen design',
        'Seating arrangements',
        'Lighting and ambiance',
        'Branding elements',
        'Outdoor seating design'
      ],
      duration: { min: 8, max: 14, unit: 'weeks' }
    }
  ]

  useEffect(() => {
    setServices(mockServices)
  }, [])

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
      const bookingData = {
        serviceId: selectedService._id,
        serviceName: selectedService.title,
        serviceType: 'construction',
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        propertyDetails: {
          type: formData.propertyType,
          area: parseInt(formData.area),
          rooms: formData.rooms
        },
        requirements: {
          budget: formData.budget,
          preferredStyle: formData.preferredStyle,
          preferredStartDate: formData.startDate,
          description: formData.message
        }
      }

      console.log('Construction Booking:', bookingData)

      // Mock booking success
      const mockBookingId = `CON-${Date.now()}`
      setBookingId(mockBookingId)
      setShowBookingModal(false)
      setShowSuccessModal(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        propertyType: 'Residential',
        area: '',
        rooms: '',
        budget: '',
        preferredStyle: '',
        startDate: '',
        message: ''
      })
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to submit booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (pricing) => {
    if (pricing.type === 'fixed') {
      return `₹${(pricing.basePrice / 100000).toFixed(1)}L`
    } else if (pricing.type === 'per_sqft') {
      return `₹${pricing.basePrice}/sq.ft`
    } else {
      return `₹${(pricing.minPrice / 100000).toFixed(1)}L - ₹${(pricing.maxPrice / 100000).toFixed(1)}L`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <Navbar />

      {/* Premium Hero Section with Glass Morphism */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-orange-400/30 to-red-400/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-gradient-to-br from-red-400/30 to-orange-400/30 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-1000"></div>
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
              <span className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full text-sm font-semibold shadow-lg">
                ✨ Premium Construction Services
              </span>
            </motion.div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 bg-clip-text text-transparent">
              Build Your Dream
            </h1>
            <p className="font-body text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
              Where luxury meets functionality. Experience world-class construction crafted by expert builders who bring your vision to life.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              {[
                { icon: '🎨', text: '3D Visualization' },
                { icon: '👨‍🎨', text: 'Expert Designers' },
                { icon: '⏱️', text: 'Timely Delivery' },
                { icon: '💎', text: 'Premium Materials' }
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
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/50 scale-105'
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
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-red-600/0 group-hover:from-orange-600/5 group-hover:to-red-600/5 transition-all duration-500"></div>

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
                      className="absolute top-4 right-4 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                    >
                      <span>⭐</span> Popular
                    </motion.div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 shadow-lg">
                    {service.category}
                  </div>

                  {/* Compare Checkbox */}
                  <div className="absolute top-4 left-4">
                    <label className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-full cursor-pointer hover:scale-105 transition-transform shadow-lg">
                      <input
                        type="checkbox"
                        checked={comparisonServices.some(s => s._id === service._id)}
                        onChange={() => toggleCompareService(service)}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                        disabled={comparisonServices.length >= 3 && !comparisonServices.some(s => s._id === service._id)}
                      />
                      <span className="text-xs font-semibold text-gray-700">Compare</span>
                    </label>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6 relative z-10">
                  <h3 className="font-heading text-2xl mb-3 bg-gradient-to-r from-orange-900 to-red-900 bg-clip-text text-transparent group-hover:scale-105 transition-transform origin-left">
                    {service.title}
                  </h3>
                  <p className="font-body text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features with Icons */}
                  <div className="mb-5 space-y-2">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-orange-600 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <p className="text-xs text-gray-500 italic ml-5">+{service.features.length - 3} more premium features</p>
                    )}
                  </div>

                  {/* Price and Duration - Premium Design */}
                  <div className="flex items-center justify-between mb-5 pt-5 border-t border-gray-200/50">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Starting from</p>
                      <p className="font-heading text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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

                  {/* Premium CTA Button */}
                  <button
                    onClick={() => handleBookService(service)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group"
                  >
                    <span>Request Quote</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
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
                      <div key={service._id} className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full text-sm">
                        <span className="font-medium text-orange-900">{service.title}</span>
                        <button
                          onClick={() => toggleCompareService(service)}
                          className="text-orange-600 hover:text-orange-800"
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
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                  <h2 className="font-heading text-3xl bg-gradient-to-r from-orange-900 to-red-900 bg-clip-text text-transparent">
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
                            <div className="font-heading text-lg bg-gradient-to-r from-orange-900 to-red-900 bg-clip-text text-transparent">
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
                            <span className="font-heading text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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
                                  <span className="text-orange-600 mt-0.5">✓</span>
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
                              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
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
                  <h2 className="font-heading text-3xl bg-gradient-to-r from-orange-900 to-red-900 bg-clip-text text-transparent">
                    Book Your Construction
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
                  <div className="mb-6 p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200/50">
                    <h3 className="font-heading text-xl bg-gradient-to-r from-orange-900 to-red-900 bg-clip-text text-transparent mb-2">
                      {selectedService.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{selectedService.description.slice(0, 100)}...</p>
                    <p className="font-semibold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Your city"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Your complete address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type *</label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Office">Office</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Area (sq.ft) *</label>
                      <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rooms</label>
                      <input
                        type="text"
                        name="rooms"
                        value={formData.rooms}
                        onChange={handleInputChange}
                        placeholder="e.g., 2 BHK"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Range</label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="e.g., 5-10 Lakhs"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Style</label>
                      <select
                        name="preferredStyle"
                        value={formData.preferredStyle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Style</option>
                        {designStyles.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Requirements</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Tell us about your vision, specific requirements, or any questions..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
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
                        <span>Submit Quote Request</span>
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

              <h3 className="font-heading text-3xl mb-3 bg-gradient-to-r from-orange-900 to-red-900 bg-clip-text text-transparent">
                Booking Confirmed!
              </h3>
              <p className="font-body text-gray-600 mb-6 leading-relaxed">
                Your construction quote request has been received successfully. Our team will reach out to you soon!
              </p>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 mb-6 border border-orange-200/50">
                <p className="text-sm text-gray-600 mb-2">Your Booking ID</p>
                <p className="font-mono text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {bookingId}
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                📧 Confirmation email sent<br />
                📞 We'll contact you within 24 hours
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
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

export default Construction
