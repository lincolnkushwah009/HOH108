/**
 * CostEstimate Component
 *
 * Allows users to get instant cost estimates based on:
 * - BHK configuration (2BHK, 3BHK, 4BHK)
 * - Package type (Basic, Standard, Premium, Luxury)
 * - Contact information (Name, Email, Phone)
 *
 * Displays estimated cost and saves lead to database
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { costEstimateData, bhkOptions, packageOptions, packageDescriptions } from '../data/costEstimates'
import { API_ENDPOINTS } from '../config/api'

const CostEstimate = () => {
  const [formData, setFormData] = useState({
    bhk: '',
    package: '',
    name: '',
    email: '',
    phone: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [estimatedCost, setEstimatedCost] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }

      // Reset package if BHK changes
      if (name === 'bhk') {
        newData.package = ''
      }

      return newData
    })

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.bhk) {
      newErrors.bhk = 'Please select BHK configuration'
    }

    if (!formData.package) {
      newErrors.package = 'Please select a package'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s\-\(\)\+]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Calculate estimated cost on form submission
    const calculatedCost = costEstimateData[formData.bhk][formData.package]
    setEstimatedCost(calculatedCost)

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bhk: formData.bhk,
        package: formData.package,
        estimatedCost: calculatedCost,
        leadType: 'cost_estimate'
      }

      const response = await fetch(API_ENDPOINTS.LEADS_PUBLIC, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (response.ok) {
        setSubmitStatus('success')
      } else {
        const errorData = await response.json()
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

  const handleNewEstimate = () => {
    setFormData({
      bhk: '',
      package: '',
      name: '',
      email: '',
      phone: ''
    })
    setEstimatedCost(null)
    setSubmitStatus(null)
    setErrors({})
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <section id="cost-estimate" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
            Get Instant Cost Estimate
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Select your BHK and package to see transparent pricing instantly
          </p>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-3xl mx-auto">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-amber-800">Disclaimer:</span> The values presented for each category represent initial estimates; these may be further refined after the design phase, ensuring that any changes in material selection, scope, or measurements are accurately accommodated for the final proposal.
            </p>
          </div>
        </motion.div>

        {submitStatus === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-accent"
          >
            <div className="text-center">
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
              <h3 className="font-subheading text-2xl text-primary mb-3">
                Thank You!
              </h3>
              <div className="bg-accent/10 rounded-xl p-6 mb-6">
                <p className="font-body text-gray-700 mb-2">Your Estimated Project Cost</p>
                <p className="font-heading text-4xl text-accent mb-1">
                  {formatCurrency(estimatedCost)}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.bhk} • {formData.package} Package
                </p>
              </div>
              <p className="font-body text-gray-600 mb-6">
                Our team will contact you shortly to discuss your project in detail and provide a customized quote.
              </p>
              <motion.button
                onClick={handleNewEstimate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent text-primary font-subheading px-6 py-3 rounded-2xl hover:bg-opacity-90 transition-all duration-200"
              >
                Get Another Estimate
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* BHK Selection */}
              <div>
                <label className="block font-subheading text-primary mb-3">
                  Select BHK Configuration *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {bhkOptions.map((bhk) => (
                    <motion.button
                      key={bhk}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'bhk', value: bhk } })}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 font-subheading transition-all ${
                        formData.bhk === bhk
                          ? 'border-accent bg-accent/10 text-primary'
                          : 'border-gray-200 hover:border-accent/50'
                      }`}
                    >
                      {bhk}
                    </motion.button>
                  ))}
                </div>
                {errors.bhk && (
                  <p className="mt-2 text-sm text-red-500 font-body">{errors.bhk}</p>
                )}
              </div>

              {/* Package Selection */}
              {formData.bhk && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block font-subheading text-primary mb-3">
                    Select Package *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageOptions[formData.bhk].map((pkg) => (
                      <motion.button
                        key={pkg}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'package', value: pkg } })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.package === pkg
                            ? 'border-accent bg-accent/10'
                            : 'border-gray-200 hover:border-accent/50'
                        }`}
                      >
                        <div className="font-subheading text-primary mb-1">{pkg}</div>
                        <div className="text-sm text-gray-600 font-body">
                          {packageDescriptions[pkg]}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.package && (
                    <p className="mt-2 text-sm text-red-500 font-body">{errors.package}</p>
                  )}
                </motion.div>
              )}

              {/* Contact Information */}
              <div className="border-t-2 border-gray-100 pt-6 space-y-6">
                <h3 className="font-subheading text-xl text-primary">Your Contact Details</h3>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block font-subheading text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl font-body focus:outline-none focus:border-accent transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 font-body">{errors.name}</p>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block font-subheading text-primary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl font-body focus:outline-none focus:border-accent transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 font-body">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block font-subheading text-primary mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl font-body focus:outline-none focus:border-accent transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="9876543210"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500 font-body">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full bg-accent text-primary font-subheading text-lg px-8 py-4 rounded-xl transition-all duration-200 ${
                  isSubmitting
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-opacity-90 hover:shadow-lg'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Get Detailed Quote'}
              </motion.button>

              {submitStatus === 'error' && (
                <p className="text-center text-red-500 font-body">
                  Something went wrong. Please try again or contact us directly.
                </p>
              )}
            </form>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default CostEstimate
