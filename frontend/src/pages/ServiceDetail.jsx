/**
 * Service Detail Page
 *
 * Displays complete information about a specific on-demand service
 * Features: Full description, all features, pricing, booking form
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { API_ENDPOINTS } from '../config/api'

const ServiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    scheduledDate: '',
    timeSlot: '',
    specialInstructions: ''
  })

  useEffect(() => {
    fetchServiceDetail()
  }, [id])

  const fetchServiceDetail = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ON_DEMAND_SERVICES}/${id}`)
      const data = await response.json()

      if (data.success) {
        setService(data.data)
      } else {
        console.error('Service not found')
        navigate('/on-demand-services')
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      navigate('/on-demand-services')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (pricing) => {
    if (!pricing) return 'Contact for pricing'

    if (pricing.type === 'hourly') {
      return `₹${pricing.hourlyRate}/hr`
    } else if (pricing.type === 'per_unit') {
      return `₹${pricing.unitPrice}/${pricing.unitName}`
    } else {
      return `₹${pricing.basePrice}`
    }
  }

  const handleBookService = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

    if (!token || !user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/service/${id}`)
      return
    }

    // Pre-fill user data
    setBookingData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    }))

    setShowBookingModal(true)
  }

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setBookingSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))

      // Calculate price based on service pricing type
      let totalPrice = 0
      if (service.pricing.type === 'hourly') {
        totalPrice = service.pricing.hourlyRate * (service.pricing.minHours || 1)
      } else if (service.pricing.type === 'per_unit') {
        totalPrice = service.pricing.unitPrice * 100 // Default 100 units, can be modified
      } else {
        totalPrice = service.pricing.basePrice
      }

      const bookingPayload = {
        service: service._id,
        customer: {
          userId: user._id,
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone
        },
        serviceAddress: {
          addressLine1: bookingData.addressLine1,
          addressLine2: bookingData.addressLine2,
          city: bookingData.city,
          state: bookingData.state,
          pincode: bookingData.pincode
        },
        scheduledDate: bookingData.scheduledDate,
        timeSlot: {
          start: bookingData.timeSlot.split('-')[0],
          end: bookingData.timeSlot.split('-')[1]
        },
        serviceDetails: {
          specialInstructions: bookingData.specialInstructions
        },
        pricing: {
          serviceCharge: totalPrice,
          tax: totalPrice * 0.18, // 18% GST
          total: totalPrice + (totalPrice * 0.18)
        }
      }

      const response = await fetch(API_ENDPOINTS.ON_DEMAND_BOOKING_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      })

      const data = await response.json()

      if (data.success) {
        const bookingId = data.data.bookingId
        alert(`Booking successful!\n\nYour Booking ID: ${bookingId}\n\nYou can:\n• View your booking in "My Projects" section\n• Track status at /track-booking\n• We'll send updates via email/SMS`)
        setShowBookingModal(false)
        // Reset only address and schedule fields
        setBookingData(prev => ({
          ...prev,
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
          scheduledDate: '',
          timeSlot: '',
          specialInstructions: ''
        }))
        // Redirect to My Projects to see all bookings
        navigate('/profile/projects')
      } else {
        alert(data.message || 'Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('An error occurred while booking. Please try again.')
    } finally {
      setBookingSubmitting(false)
    }
  }

  // Create an array of images for the slider
  const getServiceImages = () => {
    if (!service) return []

    // Combine main image with additional slider images
    const allImages = []

    // Add main image first
    if (service.image) {
      allImages.push(service.image)
    }

    // Add additional slider images if they exist
    if (service.images && service.images.length > 0) {
      allImages.push(...service.images)
    }

    return allImages
  }

  const images = getServiceImages()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  // Auto-play slider
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      nextImage()
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [images.length, currentImageIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        prevImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentImageIndex])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h1>
          <button
            onClick={() => navigate('/on-demand-services')}
            className="text-purple-600 hover:underline"
          >
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-purple-600">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/on-demand-services')} className="hover:text-purple-600">
              On-Demand Services
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{service.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Image Slider */}
              {images.length > 0 && (
                <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Images */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={images[currentImageIndex]}
                        alt={`${service.title} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group z-10"
                      >
                        <svg className="w-6 h-6 text-gray-800 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group z-10"
                      >
                        <svg className="w-6 h-6 text-gray-800 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Dot Indicators */}
                  {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`transition-all duration-300 rounded-full ${
                            index === currentImageIndex
                              ? 'w-8 h-3 bg-white'
                              : 'w-3 h-3 bg-white/60 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Image Counter */}
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm z-10">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>
              )}

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="px-6 pt-4 pb-2">
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`relative h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'ring-4 ring-purple-500 scale-105'
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === currentImageIndex && (
                          <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 lg:p-8">
                {/* Badges */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {service.category}
                  </span>
                  {service.popular && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      ⭐ Popular
                    </span>
                  )}
                  {service.trending && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      🔥 Trending
                    </span>
                  )}
                </div>

                {/* Title and Rating */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h1>

                {service.rating && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(service.rating.average)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {service.rating.average.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({service.rating.count} reviews)
                    </span>
                  </div>
                )}

                {/* Description */}
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Features Section */}
            {service.features && service.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 lg:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Included Items */}
            {service.includedItems && service.includedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 lg:p-8 border border-purple-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What You Get</h2>
                <div className="space-y-3">
                  {service.includedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-purple-600 text-xl">✓</span>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 sticky top-24"
            >
              {/* Pricing */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Starting from</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(service.pricing)}
                </p>
              </div>

              {/* Duration */}
              {service.duration && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Estimated Duration</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {service.duration.estimated} {service.duration.unit}
                  </p>
                </div>
              )}

              {/* Availability */}
              {service.availability && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
                  <div className="space-y-2">
                    {service.availability.sameDay && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Same-day service available</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      <p>Available 7 days a week</p>
                      <p className="mt-1">Multiple time slots</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookService}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group mb-4"
              >
                <span>Book Now</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Contact Info */}
              <div className="text-center text-sm text-gray-600">
                <p>Need help? Call us at</p>
                <a href="tel:+911234567890" className="text-purple-600 font-semibold hover:underline">
                  +91 123 456 7890
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Modal Placeholder */}
      {showBookingModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book {service.title}</h2>
            <p className="text-gray-600 mb-6">
              Booking functionality will be implemented soon. Please call us to book this service.
            </p>
            <button
              onClick={() => setShowBookingModal(false)}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ServiceDetail
