/**
 * Interior Calculator Component
 * Handles all interior cost calculation logic and UI
 */

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InteriorLeadForm from './InteriorLeadForm'
import { API_ENDPOINTS } from '../config/api'
import axios from 'axios'
import confetti from 'canvas-confetti'

const InteriorCalculator = () => {
  const [interiorStep, setInteriorStep] = useState(1)
  const [showLimitError, setShowLimitError] = useState(false)
  const [limitErrorMessage, setLimitErrorMessage] = useState('')
  const [interiorData, setInteriorData] = useState({
    bhk: '',
    size: '',
    category: '',
    workType: 'full', // 'full' or 'specific'
    selectedSpaces: [],
    // Lead capture data
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    customCarpetArea: '',
    budgetRange: '',
    startTimeline: '',
    floorPlan: null
  })

  // Pricing categories from the PDF
  const pricingCategories = {
    affordable: 1700,
    premium: 2000,
    luxury: 2350,
    superLuxury: 3000
  }

  // Size mapping from the PDF
  const sizeMapping = {
    '1BHK': { small: 550, large: 700 },
    '2BHK': { small: 850, large: 1100 },
    '3BHK': { small: 1300, large: 1600 },
    '4BHK': { small: 1800, large: 2300 },
    '5BHK+': { small: 2400, large: 3000 }
  }

  // Space allocation percentages from the PDF
  const spaceAllocation = {
    bedroom: 20, // per bedroom
    kitchen: 12,
    livingRoom: 20,
    dining: 10,
    foyer: 5,
    puja: 5,
    furniture: 7
  }

  // Validation Rules from Section 4 of the PDF
  const roomLimits = {
    '1BHK': { bedroom: 1, kitchen: 1, livingRoom: 1, dining: 1 },
    '2BHK': { bedroom: 2, kitchen: 1, livingRoom: 1, dining: 1 },
    '3BHK': { bedroom: 3, kitchen: 1, livingRoom: 1, dining: 1 },
    '4BHK': { bedroom: 4, kitchen: 2, livingRoom: 2, dining: 2 },
    '5BHK+': { bedroom: 6, kitchen: 2, livingRoom: 2, dining: 2 }
  }

  // Check if space selection exceeds limits
  const checkSpaceLimit = (spaceId) => {
    if (!interiorData.bhk) return true

    const limits = roomLimits[interiorData.bhk]
    const currentCount = interiorData.selectedSpaces.filter(s => s === spaceId).length + 1

    switch(spaceId) {
      case 'bedroom':
        return currentCount <= limits.bedroom
      case 'kitchen':
        return currentCount <= limits.kitchen
      case 'livingRoom':
        return currentCount <= limits.livingRoom
      case 'dining':
        return currentCount <= limits.dining
      default:
        return true // No limits for foyer, puja, furniture
    }
  }

  // Get count of selected space
  const getSpaceCount = (spaceId) => {
    return interiorData.selectedSpaces.filter(s => s === spaceId).length
  }

  // Calculate Interior Cost
  const calculateInteriorCost = () => {
    if (!interiorData.bhk || !interiorData.size || !interiorData.category) return null

    // Get total square footage - either from custom input or size mapping
    let totalSqFt
    if (interiorData.size === 'custom' && interiorData.customCarpetArea) {
      totalSqFt = parseInt(interiorData.customCarpetArea)
    } else if (sizeMapping[interiorData.bhk] && sizeMapping[interiorData.bhk][interiorData.size]) {
      totalSqFt = sizeMapping[interiorData.bhk][interiorData.size]
    } else {
      return null // Invalid size selection
    }

    // If specific spaces selected, calculate based on percentages
    if (interiorData.workType === 'specific' && interiorData.selectedSpaces.length > 0) {
      totalSqFt = interiorData.selectedSpaces.reduce((acc, space) => {
        return acc + (totalSqFt * (spaceAllocation[space] / 100))
      }, 0)
    }

    const categoryRate = pricingCategories[interiorData.category]
    const totalCost = totalSqFt * categoryRate
    const minCost = totalCost * 0.9
    const maxCost = totalCost * 1.1

    return {
      totalCost: Math.round(totalCost),
      minCost: Math.round(minCost),
      maxCost: Math.round(maxCost),
      totalSqFt: Math.round(totalSqFt)
    }
  }

  // Memoized input change handler
  const handleInputChange = useCallback((field, value) => {
    setInteriorData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Handle space selection
  const handleSpaceToggle = (spaceId) => {
    const isSelected = interiorData.selectedSpaces.includes(spaceId)

    if (isSelected) {
      // Remove the space
      const index = interiorData.selectedSpaces.indexOf(spaceId)
      const newSpaces = [...interiorData.selectedSpaces]
      newSpaces.splice(index, 1)
      setInteriorData({ ...interiorData, selectedSpaces: newSpaces })
    } else {
      // Check if we can add this space
      if (checkSpaceLimit(spaceId)) {
        setInteriorData({
          ...interiorData,
          selectedSpaces: [...interiorData.selectedSpaces, spaceId]
        })
      } else {
        // Show error
        const limits = roomLimits[interiorData.bhk]
        const spaceName = spaceId.replace(/([A-Z])/g, ' $1').trim()
        const maxAllowed = limits[spaceId]
        setLimitErrorMessage(
          `Maximum ${maxAllowed} ${spaceName}${maxAllowed > 1 ? 's' : ''} allowed for ${interiorData.bhk}`
        )
        setShowLimitError(true)
      }
    }
  }

  // Handle lead form submission
  const handleLeadSubmit = async () => {
    // Validate required fields
    if (!interiorData.fullName || !interiorData.phoneNumber || !interiorData.email ||
        !interiorData.city || !interiorData.budgetRange || !interiorData.startTimeline) {
      alert('Please fill in all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(interiorData.email)) {
      alert('Please enter a valid email address')
      return
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\s-]{10,}$/
    if (!phoneRegex.test(interiorData.phoneNumber)) {
      alert('Please enter a valid phone number')
      return
    }

    // Calculate cost for the lead
    const cost = calculateInteriorCost()

    try {
      // Use custom carpet area if provided, otherwise use calculated area
      const finalCarpetArea = interiorData.customCarpetArea
        ? parseInt(interiorData.customCarpetArea)
        : cost?.totalSqFt || 0;

      // Prepare lead data for submission
      const leadData = {
        name: interiorData.fullName,
        email: interiorData.email,
        phone: interiorData.phoneNumber,
        city: interiorData.city,
        bhk: interiorData.bhk,
        size: interiorData.size, // small or large
        carpetArea: finalCarpetArea,
        package: interiorData.category,
        estimatedCost: cost?.totalCost || 0,
        budgetRange: interiorData.budgetRange,
        startTimeline: interiorData.startTimeline,
        workType: interiorData.workType,
        selectedSpaces: interiorData.selectedSpaces,
        source: 'Interior Cost Calculator',
        serviceType: 'interior', // Set service type to interior
        leadType: 'cost_estimate', // Set lead type to cost_estimate
        status: 'new'
      }

      // Submit to backend
      console.log('📤 Submitting lead data:', leadData)
      const response = await axios.post(API_ENDPOINTS.LEADS_PUBLIC, leadData)

      if (response.data.success) {
        console.log('✅ Lead submitted successfully:', response.data)
        console.log('💰 Budget Range sent:', leadData.budgetRange)
        // Move to results
        setInteriorStep(7)
      } else {
        alert('Failed to submit lead. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
      // Still show results even if submission fails
      alert('Your information has been recorded. We will contact you shortly!')
      setInteriorStep(7)
    }
  }

  const cost = calculateInteriorCost()

  // Trigger confetti when results are shown
  useEffect(() => {
    if (interiorStep === 7) {
      // Fire confetti
      const duration = 3000
      const end = Date.now() + duration

      const colors = ['#795535', '#FDB913', '#e6e0da']

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }

      frame()
    }
  }, [interiorStep])

  return (
    <div className="space-y-8">
      {/* Error Modal */}
      <AnimatePresence>
        {showLimitError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowLimitError(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4 text-center">⚠️</div>
              <h3 className="text-xl font-heading text-[#795535] mb-4 text-center">Room Limit Exceeded</h3>
              <p className="text-gray-600 text-center mb-6">{limitErrorMessage}</p>
              <button
                onClick={() => setShowLimitError(false)}
                className="w-full bg-[#795535] text-white py-3 rounded-xl hover:bg-[#151413] transition-colors duration-300"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Work Type Selection */}
      {interiorStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-heading text-white mb-6">Select Work Type</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setInteriorData({ ...interiorData, workType: 'full' })
                setInteriorStep(2)
              }}
              className="bg-gradient-to-br from-[#795535] to-[#151413] text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-4">🏠</div>
              <h4 className="text-xl font-subheading mb-2">Full Home Interiors</h4>
              <p className="text-white text-sm">Complete interior design for your entire home</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setInteriorData({ ...interiorData, workType: 'specific' })
                setInteriorStep(2)
              }}
              className="bg-gradient-to-br from-[#795535] to-[#151413] text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-4">🔧</div>
              <h4 className="text-xl font-subheading mb-2">Specific Rooms Only</h4>
              <p className="text-white text-sm">Select specific spaces you want to design</p>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Step 2: BHK Selection */}
      {interiorStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-heading text-white mb-6">Select Your Home Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.keys(sizeMapping).map((bhk) => (
              <motion.button
                key={bhk}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setInteriorData({ ...interiorData, bhk })
                  setInteriorStep(3)
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  interiorData.bhk === bhk
                    ? 'border-[#795535] bg-[#795535] text-white'
                    : 'border-[#795535]/30 hover:border-[#795535] bg-white'
                }`}
              >
                <div className="text-3xl mb-2">🏡</div>
                <div className="font-subheading text-lg">{bhk}</div>
              </motion.button>
            ))}
          </div>
          <button
            onClick={() => setInteriorStep(1)}
            className="mt-6 text-[#795535] hover:underline"
          >
            ← Back
          </button>
        </motion.div>
      )}

      {/* Step 3: Size Selection */}
      {interiorStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-heading text-white mb-6">Choose Your Home Size</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setInteriorData({ ...interiorData, size: 'small', customCarpetArea: '' })
                setInteriorStep(interiorData.workType === 'specific' ? 4 : 5)
              }}
              className="bg-white border-2 border-[#795535]/30 hover:border-[#795535] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl mb-3">📐</div>
              <h4 className="text-xl font-subheading text-[#795535] mb-2">Small</h4>
              <p className="text-3xl font-bold text-[#795535] mb-2">
                {sizeMapping[interiorData.bhk]?.small} sq.ft
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setInteriorData({ ...interiorData, size: 'large', customCarpetArea: '' })
                setInteriorStep(interiorData.workType === 'specific' ? 4 : 5)
              }}
              className="bg-white border-2 border-[#795535]/30 hover:border-[#795535] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl mb-3">📏</div>
              <h4 className="text-xl font-subheading text-[#795535] mb-2">Large</h4>
              <p className="text-3xl font-bold text-[#795535] mb-2">
                {sizeMapping[interiorData.bhk]?.large} sq.ft
              </p>
            </motion.button>
          </div>

          {/* Custom Carpet Area Input */}
          <div className="bg-white/50 border-2 border-dashed border-[#795535]/30 p-6 rounded-2xl">
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-subheading text-[#795535] mb-2 text-center">
                Or Enter Your Actual Carpet Area
              </label>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <input
                    type="number"
                    value={interiorData.customCarpetArea}
                    onChange={(e) => setInteriorData({ ...interiorData, customCarpetArea: e.target.value })}
                    placeholder="Enter carpet area (e.g., 1200)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#795535]/30 focus:border-[#795535] outline-none transition-all duration-300"
                    min="1"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (interiorData.customCarpetArea && parseInt(interiorData.customCarpetArea) > 0) {
                      setInteriorData({ ...interiorData, size: 'custom' })
                      setInteriorStep(interiorData.workType === 'specific' ? 4 : 5)
                    } else {
                      alert('Please enter a valid carpet area')
                    }
                  }}
                  className="bg-gradient-to-r from-[#795535] to-[#151413] text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300"
                >
                  Continue →
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter your exact carpet area in sq.ft
              </p>
            </div>
          </div>

          <button
            onClick={() => setInteriorStep(2)}
            className="mt-6 text-[#795535] hover:underline"
          >
            ← Back
          </button>
        </motion.div>
      )}

      {/* Step 4: Specific Spaces Selection (only if workType is 'specific') */}
      {interiorStep === 4 && interiorData.workType === 'specific' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-heading text-white mb-6">Select Spaces to Design</h3>
          <p className="text-sm text-gray-600 mb-6">
            Maximum rooms for {interiorData.bhk}: Bedrooms ({roomLimits[interiorData.bhk].bedroom}),
            Kitchens ({roomLimits[interiorData.bhk].kitchen}),
            Living Rooms ({roomLimits[interiorData.bhk].livingRoom}),
            Dining ({roomLimits[interiorData.bhk].dining})
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { id: 'bedroom', label: 'Bedroom', icon: '🛏️', percentage: 20, hasLimit: true },
              { id: 'kitchen', label: 'Kitchen', icon: '🍳', percentage: 12, hasLimit: true },
              { id: 'livingRoom', label: 'Living Room', icon: '🛋️', percentage: 20, hasLimit: true },
              { id: 'dining', label: 'Dining', icon: '🍽️', percentage: 10, hasLimit: true },
              { id: 'foyer', label: 'Foyer', icon: '🚪', percentage: 5, hasLimit: false },
              { id: 'puja', label: 'Puja Room', icon: '🕉️', percentage: 5, hasLimit: false },
              { id: 'furniture', label: 'Furniture Only', icon: '🪑', percentage: 7, hasLimit: false }
            ].map((space) => {
              const count = getSpaceCount(space.id)
              const limit = space.hasLimit ? roomLimits[interiorData.bhk][space.id] : null
              const isMaxed = space.hasLimit && count >= limit

              return (
                <motion.button
                  key={space.id}
                  whileHover={{ scale: isMaxed ? 1 : 1.02 }}
                  whileTap={{ scale: isMaxed ? 1 : 0.98 }}
                  onClick={() => handleSpaceToggle(space.id)}
                  disabled={isMaxed && !interiorData.selectedSpaces.includes(space.id)}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    interiorData.selectedSpaces.includes(space.id)
                      ? 'border-[#795535] bg-[#795535] text-white'
                      : isMaxed
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-[#795535]/30 hover:border-[#795535] bg-white'
                  }`}
                >
                  {count > 0 && (
                    <div className="absolute top-2 right-2 bg-[#FDB913] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {count}
                    </div>
                  )}
                  <div className="text-4xl mb-2">{space.icon}</div>
                  <div className="font-subheading text-sm mb-1">{space.label}</div>
                  <div className={`text-xs ${interiorData.selectedSpaces.includes(space.id) ? 'text-white/80' : 'text-gray-500'}`}>
                    {space.percentage}% of area
                  </div>
                  {space.hasLimit && (
                    <div className={`text-xs mt-1 ${interiorData.selectedSpaces.includes(space.id) ? 'text-white/60' : 'text-gray-400'}`}>
                      Max: {limit}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setInteriorStep(3)}
              className="text-[#795535] hover:underline"
            >
              ← Back
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInteriorStep(5)}
              disabled={interiorData.selectedSpaces.length === 0}
              className={`flex-1 px-8 py-3 rounded-xl transition-all duration-300 ${
                interiorData.selectedSpaces.length > 0
                  ? 'bg-[#795535] text-white hover:bg-[#151413]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue →
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Step 5: Category Selection */}
      {interiorStep === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-heading text-white mb-6">Choose Your Design Category</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setInteriorData({ ...interiorData, category: 'affordable' })
                setInteriorStep(6)
              }}
              className="bg-white border-2 border-[#795535]/30 hover:border-[#795535] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="text-4xl mb-3">💰</div>
              <h4 className="text-xl font-subheading text-[#795535] mb-3">Affordable / Basic</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Functional designs with essential storage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Standard materials & laminates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Reliable hardware with clean finishes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Budget-friendly & quick execution</span>
                </li>
              </ul>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setInteriorData({ ...interiorData, category: 'premium' })
                setInteriorStep(6)
              }}
              className="bg-white border-2 border-[#795535]/30 hover:border-[#795535] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="text-4xl mb-3">✨</div>
              <h4 className="text-xl font-subheading text-[#795535] mb-3">Premium</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Enhanced designs with better detailing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Gurjan/HDHMR materials with premium laminates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Soft-close hardware & improved accessories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Balanced comfort, quality & aesthetics</span>
                </li>
              </ul>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setInteriorData({ ...interiorData, category: 'luxury' })
                setInteriorStep(6)
              }}
              className="bg-white border-2 border-[#795535]/30 hover:border-[#795535] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="text-4xl mb-3">💎</div>
              <h4 className="text-xl font-subheading text-[#795535] mb-3">Luxury</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Fully customised design concepts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Premium PU, veneer, fluted panels & high-end finishes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Imported hardware and advanced accessories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Designer ceilings & feature elements</span>
                </li>
              </ul>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setInteriorData({ ...interiorData, category: 'superLuxury' })
                setInteriorStep(6)
              }}
              className="bg-white border-2 border-[#795535]/30 hover:border-[#795535] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="text-4xl mb-3">👑</div>
              <h4 className="text-xl font-subheading text-[#795535] mb-3">Super Luxury</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Dedicated HOH senior designer for bespoke concepts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Signature materials: Italian veneers, metal inlays, leather panels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Smart lighting, imported fittings & high-end engineering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#795535] mr-2">•</span>
                  <span>Complete boutique experience with unique design identity</span>
                </li>
              </ul>
            </motion.button>
          </div>
          <button
            onClick={() => setInteriorStep(interiorData.workType === 'specific' ? 4 : 3)}
            className="mt-6 text-[#795535] hover:underline"
          >
            ← Back
          </button>
        </motion.div>
      )}

      {/* Step 6: Lead Capture Form */}
      {interiorStep === 6 && (
        <InteriorLeadForm
          formData={interiorData}
          onInputChange={handleInputChange}
          onBack={() => setInteriorStep(5)}
          onSubmit={handleLeadSubmit}
        />
      )}

      {/* Step 7: Results */}
      {interiorStep === 7 && cost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-br from-[#795535] to-[#151413] text-white p-12 rounded-3xl shadow-2xl"
        >
          <h3 className="text-3xl font-heading mb-8 text-center">Your Estimated Cost</h3>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <div className="text-sm text-white/70 mb-2">Minimum</div>
              <div className="text-3xl font-bold">₹{cost.minCost.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl ring-2 ring-[#FDB913]">
              <div className="text-sm text-white/70 mb-2">Expected</div>
              <div className="text-4xl font-bold">₹{cost.totalCost.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <div className="text-sm text-white/70 mb-2">Maximum</div>
              <div className="text-3xl font-bold">₹{cost.maxCost.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl mb-8">
            <h4 className="text-xl font-subheading mb-4">Project Summary</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/70">Home Type:</span>
                <span className="ml-2 font-semibold">{interiorData.bhk}</span>
              </div>
              <div>
                <span className="text-white/70">Size:</span>
                <span className="ml-2 font-semibold">{cost.totalSqFt} sq.ft</span>
              </div>
              <div>
                <span className="text-white/70">Category:</span>
                <span className="ml-2 font-semibold capitalize">{interiorData.category.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
              <div>
                <span className="text-white/70">Work Type:</span>
                <span className="ml-2 font-semibold capitalize">{interiorData.workType === 'full' ? 'Full Home' : 'Specific Rooms'}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/80 mb-6">Our team will contact you shortly at {interiorData.phoneNumber}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setInteriorStep(1)
                setInteriorData({
                  bhk: '',
                  size: '',
                  category: '',
                  workType: 'full',
                  selectedSpaces: [],
                  fullName: '',
                  phoneNumber: '',
                  email: '',
                  city: '',
                  budgetRange: '',
                  startTimeline: '',
                  floorPlan: null
                })
              }}
              className="bg-white text-[#795535] px-10 py-4 rounded-full font-subheading hover:bg-[#FDB913] hover:text-white transition-all duration-300"
            >
              Calculate Again
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default InteriorCalculator
