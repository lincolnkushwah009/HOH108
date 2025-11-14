/**
 * EstimateForm Component
 *
 * Contact form section with dark brown background
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { API_ENDPOINTS } from '../config/api'

const EstimateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Prepare data for leads endpoint
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: 'Not specified',
        carpetArea: 0,
        estimatedCost: 0
      }

      // Submit to public leads endpoint
      const leadsResponse = await fetch(API_ENDPOINTS.LEADS_PUBLIC, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (leadsResponse.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        })
      } else {
        const errorData = await leadsResponse.json()
        console.error('Server error:', errorData)
        throw new Error(errorData.message || 'Failed to submit form')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="estimate" className="relative py-20 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Heading and Addresses */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
              Let's Build Something
            </h2>
            <h3 className="font-heading text-4xl md:text-5xl text-accent mb-12">
              Beautiful Together
            </h3>

            <p className="font-body text-white/80 mb-12 leading-relaxed">
              Whether you're dreaming of a custom-built home or a stunning interior makeover, we're here to make it happen.
              As a full-service residential construction and interior design company, we take care of everything for you
              from expert planning, transparent execution, and design that reflects your unique vision.
            </p>

            {/* Addresses */}
            <div className="space-y-8">
              <div>
                <h4 className="font-subheading text-accent text-lg mb-2">Bengaluru</h4>
                <p className="font-body text-white/70 text-sm">
                  3/1, 11th St, Venkatapura,<br />
                  Koramangala, Bengaluru, Karnataka 560034
                </p>
              </div>

              <div>
                <h4 className="font-subheading text-accent text-lg mb-2">Mysore</h4>
                <p className="font-body text-white/70 text-sm">
                  264/1AD 47/1A, First Floor,<br />
                  2nd Main Road, V.V. Mohalla, Mysore 570002
                </p>
              </div>

              <div>
                <h4 className="font-subheading text-accent text-lg mb-2">Contact</h4>
                <p className="font-body text-white/70 text-sm">
                  Phone: +91 91087 71647<br />
                  Email: info@hoh108.com
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
              >
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-primary"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-subheading text-2xl text-white mb-3">
                  Thank You!
                </h3>
                <p className="font-body text-white/80 mb-6">
                  We've received your message and will get back to you within 24 hours.
                </p>
                <motion.button
                  onClick={() => setSubmitStatus(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-accent text-primary font-subheading px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200"
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block font-subheading text-white/90 mb-2 text-sm uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg font-body text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors ${
                      errors.name ? 'border-red-500' : 'border-white/30'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400 font-body">{errors.name}</p>
                  )}
                </div>

                {/* Email and Phone - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block font-subheading text-white/90 mb-2 text-sm uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-lg font-body text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors ${
                        errors.email ? 'border-red-500' : 'border-white/30'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400 font-body">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block font-subheading text-white/90 mb-2 text-sm uppercase">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg font-body text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors"
                      placeholder="+91 12345 67890"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block font-subheading text-white/90 mb-2 text-sm uppercase">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg font-body text-white placeholder-white/50 focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full bg-accent text-primary font-subheading text-lg px-8 py-4 rounded-lg transition-all duration-200 uppercase ${
                    isSubmitting
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-opacity-90 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </motion.button>

                {submitStatus === 'error' && (
                  <p className="text-center text-red-400 font-body">
                    Something went wrong. Please try again or contact us directly.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default EstimateForm
