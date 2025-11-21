/**
 * Construction Calculator Component
 * Handles all construction cost calculation logic and UI
 * Based on HOH Construction Cost Calculator – Final Logic PDF
 */

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import ConstructionLeadForm from './ConstructionLeadForm'
import { API_ENDPOINTS } from '../config/api'
import axios from 'axios'
import confetti from 'canvas-confetti'

const ConstructionCalculator = () => {
  const [constructionStep, setConstructionStep] = useState(1)
  const [constructionData, setConstructionData] = useState({
    projectType: '', // 'residential' or 'commercial'
    plotArea: '',
    floors: '',
    category: '', // 'affordable', 'premium', 'luxury'
    // Lead capture data
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    preferredBudget: '',
    plotDocument: null
  })

  // Floor multipliers for built-up area calculation
  const floorMultipliers = {
    'G': 1.0,
    'G+1': 1.8,
    'G+2': 2.6,
    'G+3': 3.4,
    'G+4': 4.2
  }

  // Floor display labels for better UX
  const floorLabels = {
    'G': { main: '1 Floor', sub: 'Ground Only' },
    'G+1': { main: '2 Floors', sub: 'Ground + 1' },
    'G+2': { main: '3 Floors', sub: 'Ground + 2' },
    'G+3': { main: '4 Floors', sub: 'Ground + 3' },
    'G+4': { main: '5 Floors', sub: 'Ground + 4' }
  }

  // Residential pricing rates (per sq.ft)
  const residentialRates = {
    affordable: { min: 1650, max: 1800 },
    premium: { min: 1850, max: 2150 },
    luxury: { min: 2150, max: 2750 }
  }

  // Commercial pricing rates (per sq.ft)
  const commercialRates = {
    affordable: { min: 1350, max: 1550 },
    premium: { min: 1550, max: 1850 },
    luxury: { min: 1850, max: 2400 }
  }

  // Calculate built-up area
  const calculateBuiltUpArea = () => {
    if (!constructionData.plotArea || !constructionData.floors) return 0
    const plotArea = parseInt(constructionData.plotArea)
    const multiplier = floorMultipliers[constructionData.floors]
    return Math.round(plotArea * multiplier)
  }

  // Calculate construction cost
  const calculateConstructionCost = () => {
    if (!constructionData.projectType || !constructionData.plotArea ||
        !constructionData.floors || !constructionData.category) {
      return null
    }

    const builtUpArea = calculateBuiltUpArea()
    const rates = constructionData.projectType === 'residential'
      ? residentialRates[constructionData.category]
      : commercialRates[constructionData.category]

    const minCost = builtUpArea * rates.min
    const maxCost = builtUpArea * rates.max

    return {
      builtUpArea,
      minCost: Math.round(minCost),
      maxCost: Math.round(maxCost),
      minCostLakhs: (minCost / 100000).toFixed(1),
      maxCostLakhs: (maxCost / 100000).toFixed(1)
    }
  }

  // Memoized input change handler
  const handleInputChange = useCallback((field, value) => {
    setConstructionData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Handle lead form submission
  const handleLeadSubmit = async () => {
    // Validate required fields
    if (!constructionData.fullName || !constructionData.phoneNumber ||
        !constructionData.email || !constructionData.city) {
      alert('Please fill in all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(constructionData.email)) {
      alert('Please enter a valid email address')
      return
    }

    // Phone validation
    const phoneRegex = /^[0-9+\s-]{10,}$/
    if (!phoneRegex.test(constructionData.phoneNumber)) {
      alert('Please enter a valid phone number')
      return
    }

    // Calculate cost for the lead
    const cost = calculateConstructionCost()

    try {
      // Prepare lead data for submission
      const leadData = {
        name: constructionData.fullName,
        email: constructionData.email,
        phone: constructionData.phoneNumber,
        city: constructionData.city,
        carpetArea: cost?.builtUpArea || 0,
        package: constructionData.category,
        estimatedCost: Math.round((cost.minCost + cost.maxCost) / 2) || 0,
        budgetRange: constructionData.preferredBudget || 'Not specified',
        projectType: constructionData.projectType,
        plotArea: constructionData.plotArea,
        floors: constructionData.floors,
        source: 'Construction Cost Calculator',
        serviceType: 'construction',
        leadType: 'cost_estimate',
        status: 'new',
        notes: `Project: ${constructionData.projectType}, Plot: ${constructionData.plotArea} sq.ft, Floors: ${constructionData.floors}, Built-up: ${cost?.builtUpArea} sq.ft, Category: ${constructionData.category}, Budget: ${constructionData.preferredBudget || 'Not specified'}`
      }

      // Submit to backend
      const response = await axios.post(API_ENDPOINTS.LEADS_PUBLIC, leadData)

      if (response.data.success) {
        console.log('Lead submitted successfully:', response.data)
        // Move to results
        setConstructionStep(6)
      } else {
        alert('Failed to submit lead. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
      // Still show results even if submission fails
      alert('Your information has been recorded. We will contact you shortly!')
      setConstructionStep(6)
    }
  }

  const cost = calculateConstructionCost()

  // Trigger confetti when results are shown
  useEffect(() => {
    if (constructionStep === 6) {
      // Fire confetti
      const duration = 3000
      const end = Date.now() + duration

      const colors = ['#ea580c', '#dc2626', '#FDB913']

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
  }, [constructionStep])

  return (
    <div className="space-y-8">
      {/* Step 1: Project Type Selection */}
      {constructionStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-heading text-white mb-6">What type of construction do you need?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setConstructionData({ ...constructionData, projectType: 'residential' })
                setConstructionStep(2)
              }}
              className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-4">🏠</div>
              <h4 className="text-xl font-subheading mb-2">Residential</h4>
              <p className="text-white text-sm">Homes, villas, apartments</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setConstructionData({ ...constructionData, projectType: 'commercial' })
                setConstructionStep(2)
              }}
              className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-4">🏢</div>
              <h4 className="text-xl font-subheading mb-2">Commercial</h4>
              <p className="text-white text-sm">Offices, shops, warehouses</p>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Plot Area Input */}
      {constructionStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-heading text-white mb-6">Please enter your plot area (in sq.ft)</h3>
          <div className="max-w-md mx-auto">
            <input
              type="number"
              value={constructionData.plotArea}
              onChange={(e) => {
                const value = e.target.value
                // Allow empty string or any numeric input while typing
                if (value === '' || !isNaN(value)) {
                  setConstructionData({ ...constructionData, plotArea: value })
                }
              }}
              className="w-full px-6 py-4 text-2xl text-center rounded-xl border-2 border-[#795535]/30 focus:border-orange-600 outline-none transition-all duration-300"
              placeholder="Enter plot area"
              min="400"
              max="20000"
            />
            <p className="text-sm text-gray-500 mt-2 text-center">Min: 400 sq.ft | Max: 20,000 sq.ft</p>
            {constructionData.plotArea && (parseInt(constructionData.plotArea) < 400 || parseInt(constructionData.plotArea) > 20000) && (
              <p className="text-sm text-red-500 mt-2 text-center">
                Please enter a value between 400 and 20,000 sq.ft
              </p>
            )}
          </div>
          <div className="flex gap-4 mt-8 justify-center">
            <button
              onClick={() => setConstructionStep(1)}
              className="text-orange-600 hover:underline"
            >
              ← Back
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setConstructionStep(3)}
              disabled={!constructionData.plotArea || parseInt(constructionData.plotArea) < 400}
              className={`px-8 py-3 rounded-xl transition-all duration-300 ${
                constructionData.plotArea && parseInt(constructionData.plotArea) >= 400
                  ? 'bg-orange-600 text-white hover:bg-red-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue →
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Floors Selection */}
      {constructionStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-heading text-white mb-6">Select the number of floors you want to construct</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.keys(floorMultipliers).map((floor, index) => {
              const floorCount = index + 1;
              const isSelected = constructionData.floors === floor;
              return (
                <motion.button
                  key={floor}
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setConstructionData({ ...constructionData, floors: floor })
                    setConstructionStep(4)
                  }}
                  className={`p-6 rounded-2xl transition-all duration-500 relative ${
                    isSelected
                      ? 'bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white shadow-2xl'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-orange-50 hover:to-orange-100 shadow-md hover:shadow-xl'
                  }`}
                >
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                  </div>

                  {/* Building SVG Illustration */}
                  <div className="relative flex items-center justify-center mb-4 h-32">
                    <motion.svg
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, type: "spring" }}
                      viewBox="0 0 200 160"
                      className="w-full h-full"
                      style={{ maxWidth: '140px' }}
                    >
                      {/* Ground/Foundation */}
                      <rect
                        x="10"
                        y="145"
                        width="180"
                        height="4"
                        fill={isSelected ? 'rgba(255,255,255,0.3)' : 'rgba(251,146,60,0.3)'}
                        rx="2"
                      />

                      {/* Building Structure */}
                      {[...Array(floorCount)].map((_, i) => {
                        const floorHeight = 25;
                        const baseWidth = 120;
                        const widthReduction = i * 8;
                        const width = baseWidth - widthReduction;
                        const x = 40 + (widthReduction / 2);
                        const y = 145 - (floorHeight * (i + 1));
                        const isGroundFloor = i === 0;
                        const isTopFloor = i === floorCount - 1;

                        return (
                          <g key={i}>
                            {/* Floor Body */}
                            <motion.rect
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.15, type: "spring" }}
                              x={x}
                              y={y}
                              width={width}
                              height={floorHeight - 2}
                              fill={isSelected
                                ? `url(#floorGradientSelected${i})`
                                : `url(#floorGradient${i})`
                              }
                              stroke={isSelected ? 'rgba(255,255,255,0.5)' : 'rgba(251,146,60,0.6)'}
                              strokeWidth="1.5"
                              rx="2"
                            />

                            {/* Windows */}
                            {[...Array(Math.min(4, Math.floor(width / 30)))].map((_, w) => {
                              const windowWidth = 8;
                              const spacing = width / (Math.min(4, Math.floor(width / 30)) + 1);
                              const windowX = x + spacing * (w + 1) - windowWidth / 2;
                              const windowY = y + 8;

                              return (
                                <motion.rect
                                  key={`window-${i}-${w}`}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.15 + w * 0.05 + 0.3 }}
                                  x={windowX}
                                  y={windowY}
                                  width={windowWidth}
                                  height={8}
                                  fill={isSelected
                                    ? 'rgba(251,146,60,0.7)'
                                    : 'rgba(253,224,71,0.8)'
                                  }
                                  stroke={isSelected ? 'rgba(200,100,40,0.5)' : 'rgba(255,255,255,0.4)'}
                                  strokeWidth="0.5"
                                  rx="1"
                                  style={{
                                    filter: isSelected
                                      ? 'drop-shadow(0 0 2px rgba(251,146,60,0.4))'
                                      : 'drop-shadow(0 0 4px rgba(253,224,71,0.6))'
                                  }}
                                />
                              );
                            })}

                            {/* Roof for Top Floor */}
                            {isTopFloor && (
                              <>
                                <motion.polygon
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.15 + 0.4 }}
                                  points={`${x},${y} ${x + width / 2},${y - 12} ${x + width},${y}`}
                                  fill={isSelected
                                    ? 'rgba(255,255,255,0.9)'
                                    : 'rgba(251,146,60,0.9)'
                                  }
                                  stroke={isSelected ? 'rgba(255,255,255,0.5)' : 'rgba(200,80,40,0.6)'}
                                  strokeWidth="1.5"
                                />
                                {/* Antenna */}
                                <motion.line
                                  initial={{ scaleY: 0 }}
                                  animate={{ scaleY: 1 }}
                                  transition={{ delay: i * 0.15 + 0.5 }}
                                  x1={x + width / 2}
                                  y1={y - 12}
                                  x2={x + width / 2}
                                  y2={y - 22}
                                  stroke={isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(251,146,60,0.7)'}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  style={{ transformOrigin: 'center' }}
                                />
                                {/* Antenna Light */}
                                <motion.circle
                                  animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.8, 1, 0.8]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  cx={x + width / 2}
                                  cy={y - 22}
                                  r="3"
                                  fill={isSelected ? 'rgba(251,146,60,0.9)' : 'rgba(253,224,71,0.9)'}
                                  style={{
                                    filter: isSelected
                                      ? 'drop-shadow(0 0 6px rgba(251,146,60,0.8))'
                                      : 'drop-shadow(0 0 6px rgba(253,224,71,0.8))'
                                  }}
                                />
                              </>
                            )}

                            {/* Gradients */}
                            <defs>
                              <linearGradient id={`floorGradient${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(251,146,60,1)" />
                                <stop offset="50%" stopColor="rgba(239,68,68,1)" />
                                <stop offset="100%" stopColor="rgba(251,146,60,1)" />
                              </linearGradient>
                              <linearGradient id={`floorGradientSelected${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                                <stop offset="50%" stopColor="rgba(243,244,246,1)" />
                                <stop offset="100%" stopColor="rgba(229,231,235,1)" />
                              </linearGradient>
                            </defs>
                          </g>
                        );
                      })}
                    </motion.svg>
                  </div>

                  {/* Floor count badge */}
                  <div className="relative">
                    <div className={`text-3xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-orange-600'}`}>
                      {floor}
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
          <button
            onClick={() => setConstructionStep(2)}
            className="mt-6 text-orange-600 hover:underline"
          >
            ← Back
          </button>
        </motion.div>
      )}

      {/* Step 4: Category Selection */}
      {constructionStep === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-heading text-white mb-6">Choose your construction category</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {['affordable', 'premium', 'luxury'].map((category) => {
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setConstructionData({ ...constructionData, category })
                    setConstructionStep(5)
                  }}
                  className="bg-white border-2 border-orange-600/30 hover:border-orange-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
                >
                  <div className="text-4xl mb-3">
                    {category === 'affordable' && '💰'}
                    {category === 'premium' && '✨'}
                    {category === 'luxury' && '👑'}
                  </div>
                  <h4 className="text-xl font-subheading text-[#795535] mb-2 capitalize">{category}</h4>
                  <p className="text-sm text-gray-600">
                    {category === 'affordable' && 'Quality construction on budget'}
                    {category === 'premium' && 'Enhanced materials & finishes'}
                    {category === 'luxury' && 'High-end premium construction'}
                  </p>
                </motion.button>
              )
            })}
          </div>
          <button
            onClick={() => setConstructionStep(3)}
            className="mt-6 text-orange-600 hover:underline"
          >
            ← Back
          </button>
        </motion.div>
      )}

      {/* Step 5: Lead Capture Form */}
      {constructionStep === 5 && (
        <ConstructionLeadForm
          formData={constructionData}
          onInputChange={handleInputChange}
          onBack={() => setConstructionStep(4)}
          onSubmit={handleLeadSubmit}
        />
      )}

      {/* Step 6: Results / Thank You Screen */}
      {constructionStep === 6 && cost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-12 rounded-3xl shadow-2xl"
        >
          <div className="text-6xl mb-6 text-center">🎉</div>
          <h3 className="text-3xl font-heading mb-8 text-center">Your Construction Estimate Is Ready!</h3>

          {/* Cost Estimate Display */}
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl max-w-3xl mx-auto mb-8">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="text-sm text-white/70">Project Type</div>
                <div className="text-lg font-semibold capitalize">{constructionData.projectType}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="text-sm text-white/70">Plot Area</div>
                <div className="text-lg font-semibold">{constructionData.plotArea} sq.ft</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="text-sm text-white/70">Floors</div>
                <div className="text-lg font-semibold">{constructionData.floors}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="text-sm text-white/70">Category</div>
                <div className="text-lg font-semibold capitalize">{constructionData.category}</div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl mb-4">
              <div className="text-sm text-white/80 mb-2">Estimated Built-up Area</div>
              <div className="text-3xl font-bold">{cost.builtUpArea.toLocaleString()} sq.ft</div>
            </div>

            <div className="bg-[#FDB913] text-[#151413] p-8 rounded-2xl">
              <div className="text-sm mb-2">Estimated Construction Cost</div>
              <div className="text-4xl font-bold mb-2">₹{cost.minCostLakhs}L - ₹{cost.maxCostLakhs}L</div>
              <div className="text-xs opacity-80">(Including structure + finishing based on your selection)</div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl max-w-2xl mx-auto mb-8">
            <p className="text-center text-white/90 mb-6">
              Our team will connect with you shortly at <strong>{constructionData.phoneNumber}</strong> to understand your requirements and share a customised proposal.
            </p>
            <h4 className="text-lg font-subheading mb-4 text-center">What happens next?</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📞</div>
                <div>
                  <div className="font-semibold">Call from our expert</div>
                  <div className="text-sm text-white/80">Within 24 hours</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">📋</div>
                <div>
                  <div className="font-semibold">Detailed cost breakdown</div>
                  <div className="text-sm text-white/80">Item-wise estimation & timeline</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🏗️</div>
                <div>
                  <div className="font-semibold">Site visit & planning</div>
                  <div className="text-sm text-white/80">Free consultation</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setConstructionStep(1)
                setConstructionData({
                  projectType: '',
                  plotArea: '',
                  floors: '',
                  category: '',
                  fullName: '',
                  phoneNumber: '',
                  email: '',
                  city: '',
                  preferredBudget: '',
                  plotDocument: null
                })
              }}
              className="bg-white text-orange-600 px-10 py-4 rounded-full font-subheading hover:bg-[#FDB913] hover:text-[#151413] transition-all duration-300"
            >
              Calculate Again
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ConstructionCalculator
