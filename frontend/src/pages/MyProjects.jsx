/**
 * MyProjects Page Component
 *
 * Displays user's interior design projects.
 * Shows empty state when no projects exist.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileLayout from '../components/ProfileLayout'
import { API_URL, API_ENDPOINTS } from '../config/api'

// Project status mapping with details
const PROJECT_STAGES = [
  { key: 'inquiry', label: 'Inquiry', icon: '📋', color: 'bg-gray-100 text-gray-700' },
  { key: 'design_done', label: 'Design Done', icon: '✏️', color: 'bg-blue-100 text-blue-700' },
  { key: 'budget_approved', label: 'Budget Approved', icon: '💰', color: 'bg-green-100 text-green-700' },
  { key: 'stage1_fee_paid', label: 'Stage 1 Fee Paid', icon: '💳', color: 'bg-emerald-100 text-emerald-700' },
  { key: 'material_procurement_done', label: 'Material Procured', icon: '📦', color: 'bg-purple-100 text-purple-700' },
  { key: 'factory_production_started', label: 'Production Started', icon: '🏭', color: 'bg-indigo-100 text-indigo-700' },
  { key: 'factory_production_completed', label: 'Production Complete', icon: '✅', color: 'bg-cyan-100 text-cyan-700' },
  { key: 'dispatched', label: 'Dispatched', icon: '🚚', color: 'bg-orange-100 text-orange-700' },
  { key: 'delivered', label: 'Delivered', icon: '📍', color: 'bg-pink-100 text-pink-700' },
  { key: 'onsite_execution_started', label: 'Installation Started', icon: '🔨', color: 'bg-amber-100 text-amber-700' },
  { key: 'onsite_execution_completed', label: 'Installation Complete', icon: '🎨', color: 'bg-teal-100 text-teal-700' },
  { key: 'handover_move_in', label: 'Handover & Move-In', icon: '🏡', color: 'bg-green-100 text-green-700' }
]

const MyProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showImageGalleryModal, setShowImageGalleryModal] = useState(false)
  const [selectedProjectForImages, setSelectedProjectForImages] = useState(null)
  const [designImages, setDesignImages] = useState([])
  const [loadingImages, setLoadingImages] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_ENDPOINTS.USER_PROJECTS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      console.log('📊 MyProjects - Fetched data:', data)
      if (data.success) {
        console.log('📊 MyProjects - Projects:', data.data)
        if (data.data.length > 0) {
          console.log('📊 MyProjects - First project:', data.data[0])
          console.log('📊 MyProjects - First project customer:', data.data[0].customer)
        }
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentStageIndex = (status) => {
    return PROJECT_STAGES.findIndex(stage => stage.key === status)
  }

  const getProgressPercentage = (status) => {
    const currentIndex = getCurrentStageIndex(status)
    return ((currentIndex + 1) / PROJECT_STAGES.length) * 100
  }

  // Fetch design images for a project
  const fetchDesignImages = async (projectId) => {
    setLoadingImages(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        API_ENDPOINTS.DESIGNS_BY_PROJECT(projectId),
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const data = await response.json()

      if (data.success) {
        setDesignImages(data.data.images || [])
      }
    } catch (error) {
      console.error('Error fetching design images:', error)
    } finally {
      setLoadingImages(false)
    }
  }

  // Open image gallery modal
  const openImageGalleryModal = async (project) => {
    setSelectedProjectForImages(project)
    setShowImageGalleryModal(true)
    await fetchDesignImages(project._id)
  }

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Illustration */}
      <div className="mb-8">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Empty box illustration */}
          <rect x="50" y="80" width="100" height="80" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
          <rect x="60" y="70" width="80" height="10" rx="2" fill="#e5e7eb"/>

          {/* Person looking at empty box */}
          <circle cx="40" cy="40" r="15" fill="#c69c6d"/>
          <path d="M 40 55 Q 35 70 30 85 L 40 85 L 45 70 Q 42 60 40 55" fill="#2c2420"/>
          <path d="M 30 85 L 25 110 M 40 85 L 45 110" stroke="#2c2420" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 40 60 L 50 70" stroke="#2c2420" strokeWidth="2" strokeLinecap="round"/>

          {/* Floating papers/confetti */}
          <circle cx="150" cy="30" r="4" fill="#ff6b6b" opacity="0.6"/>
          <rect x="170" y="25" width="6" height="6" fill="#4ecdc4" opacity="0.6" transform="rotate(45 173 28)"/>
          <circle cx="165" cy="50" r="3" fill="#ffe66d" opacity="0.6"/>
        </svg>
      </div>

      {/* Message */}
      <h3 className="font-subheading text-2xl text-primary mb-2">
        No projects found
      </h3>
      <p className="font-body text-gray-600 mb-8 text-center max-w-md">
        Please book an order to show details here!
      </p>

      {/* CTA Button */}
      <motion.a
        href="/#estimate"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-accent text-primary font-subheading px-8 py-3 rounded-2xl hover:bg-opacity-90 transition-all duration-200 shadow-md"
      >
        Get Free Estimate
      </motion.a>
    </motion.div>
  )

  const ProgressTracker = ({ project }) => {
    const currentIndex = getCurrentStageIndex(project.status)
    const progressPercent = getProgressPercentage(project.status)

    return (
      <div className="mt-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-body text-gray-600">Project Progress</span>
            <span className="text-sm font-subheading text-primary">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
            />
          </div>
        </div>

        {/* Progress Stages */}
        <div className="space-y-4">
          {PROJECT_STAGES.map((stage, index) => {
            const isCompleted = index <= currentIndex
            const isCurrent = index === currentIndex

            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                  isCurrent ? 'bg-accent bg-opacity-20 border-2 border-accent' :
                  isCompleted ? 'bg-green-50 border border-green-200' :
                  'bg-gray-50 border border-gray-200'
                }`}
              >
                {/* Stage Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isCurrent ? 'bg-accent shadow-lg' :
                    isCompleted ? 'bg-green-500' :
                    'bg-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    isCurrent ? stage.icon : '✓'
                  ) : (
                    <span className="opacity-40">{stage.icon}</span>
                  )}
                </motion.div>

                {/* Stage Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-subheading text-base ${
                      isCurrent ? 'text-primary font-semibold' :
                      isCompleted ? 'text-gray-700' :
                      'text-gray-500'
                    }`}>
                      {stage.label}
                    </h4>
                    {isCurrent && (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="px-2 py-1 bg-accent text-primary text-xs font-body rounded-full"
                      >
                        In Progress
                      </motion.span>
                    )}
                    {isCompleted && !isCurrent && (
                      <span className="text-green-600 text-sm">✓ Completed</span>
                    )}
                  </div>
                </div>

                {/* Stage Number */}
                <div className={`font-body text-sm ${
                  isCurrent ? 'text-primary font-semibold' :
                  isCompleted ? 'text-gray-600' :
                  'text-gray-400'
                }`}>
                  {index + 1}/{PROJECT_STAGES.length}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const ProjectsList = () => (
    <div className="space-y-8">
      {projects.map((project, idx) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
          {/* Project Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-heading text-2xl">
                    {project.title}
                  </h3>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-body">
                    {project.projectId}
                  </span>
                </div>
                {project.description && (
                  <p className="font-body text-sm opacity-90 mb-3">
                    {project.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 text-sm font-body">
                  {project.projectType && (
                    <div className="flex items-center gap-1">
                      <span>🏢</span>
                      <span className="capitalize">{project.projectType}</span>
                    </div>
                  )}
                  {project.carpetArea && (
                    <div className="flex items-center gap-1">
                      <span>📏</span>
                      <span>{project.carpetArea} sq.ft</span>
                    </div>
                  )}
                  {project.budget?.estimated && (
                    <div className="flex items-center gap-1">
                      <span>💰</span>
                      <span>₹{project.budget.estimated.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Body */}
          <div className="p-6">
            {/* Customer Info (for Designers/CRM) */}
            {project.customer && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-subheading text-lg">
                    {project.customer.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-body text-gray-600 mb-1">Customer</p>
                    <p className="font-subheading text-base text-gray-900">{project.customer.fullName}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600">
                      {project.customer.customerId && (
                        <span className="font-body">ID: {project.customer.customerId}</span>
                      )}
                      {project.customer.email && (
                        <span className="font-body">📧 {project.customer.email}</span>
                      )}
                      {project.customer.phone && (
                        <span className="font-body">📞 {project.customer.phone}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Info */}
            {(project.assignedDesigner || project.assignedCRM) && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.assignedDesigner && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-subheading">
                      {project.assignedDesigner.fullName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-body text-gray-600">Designer</p>
                      <p className="font-subheading text-sm text-gray-800">{project.assignedDesigner.fullName}</p>
                    </div>
                  </div>
                )}
                {project.assignedCRM && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-subheading">
                      {project.assignedCRM.fullName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-body text-gray-600">CRM Manager</p>
                      <p className="font-subheading text-sm text-gray-800">{project.assignedCRM.fullName}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progress Tracker */}
            <ProgressTracker project={project} />

            {/* View Details Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedProject(selectedProject === project._id ? null : project._id)}
              className="mt-6 w-full py-3 bg-primary text-white font-subheading rounded-xl hover:bg-opacity-90 transition-all"
            >
              {selectedProject === project._id ? 'Hide Details' : 'View Full Timeline'}
            </motion.button>

            {/* View Design Images Button */}
            <button
              onClick={() => openImageGalleryModal(project)}
              className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Design Images
            </button>

            {/* Expandable Project Details */}
            <AnimatePresence>
              {selectedProject === project._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                    <h3 className="font-heading text-xl text-primary mb-6">Complete Project Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Location Details */}
                      {project.location && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">📍</span>
                            <h4 className="font-subheading text-lg text-gray-800">Location</h4>
                          </div>
                          <div className="space-y-1 text-sm font-body text-gray-600">
                            {project.location.address && (
                              <p>{project.location.address}</p>
                            )}
                            {(project.location.city || project.location.state) && (
                              <p>
                                {project.location.city && project.location.city}
                                {project.location.city && project.location.state && ', '}
                                {project.location.state && project.location.state}
                                {project.location.zipCode && ` - ${project.location.zipCode}`}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Timeline Details */}
                      {project.timeline && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">📅</span>
                            <h4 className="font-subheading text-lg text-gray-800">Timeline</h4>
                          </div>
                          <div className="space-y-2 text-sm font-body">
                            {project.timeline.startDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Start Date:</span>
                                <span className="text-gray-800 font-medium">
                                  {new Date(project.timeline.startDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {project.timeline.expectedEndDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Expected End:</span>
                                <span className="text-gray-800 font-medium">
                                  {new Date(project.timeline.expectedEndDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {project.timeline.actualEndDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Actual End:</span>
                                <span className="text-green-600 font-medium">
                                  {new Date(project.timeline.actualEndDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Budget Details */}
                      {project.budget && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">💰</span>
                            <h4 className="font-subheading text-lg text-gray-800">Budget Breakdown</h4>
                          </div>
                          <div className="space-y-2 text-sm font-body">
                            {project.budget.estimated && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Estimated:</span>
                                <span className="text-gray-800 font-medium">
                                  ₹{project.budget.estimated.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {project.budget.actual && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Actual:</span>
                                <span className="text-blue-600 font-medium">
                                  ₹{project.budget.actual.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {project.budget.currency && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Currency:</span>
                                <span className="text-gray-800 font-medium">
                                  {project.budget.currency}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Room Types */}
                      {project.roomTypes && project.roomTypes.length > 0 && (
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🚪</span>
                            <h4 className="font-subheading text-lg text-gray-800">Room Types</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.roomTypes.map((room, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-body rounded-full"
                              >
                                {room}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Project Notes */}
                      {project.notes && (
                        <div className="bg-white p-4 rounded-xl shadow-sm md:col-span-2">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">📝</span>
                            <h4 className="font-subheading text-lg text-gray-800">Project Notes</h4>
                          </div>
                          <p className="text-sm font-body text-gray-700 leading-relaxed">
                            {project.notes}
                          </p>
                        </div>
                      )}

                      {/* Contact Information */}
                      <div className="bg-white p-4 rounded-xl shadow-sm md:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">📞</span>
                          <h4 className="font-subheading text-lg text-gray-800">Need Help?</h4>
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm font-body">
                          {project.assignedDesigner && (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">Contact Designer:</span>
                                <span className="text-blue-600 font-medium">
                                  {project.assignedDesigner.fullName}
                                </span>
                              </div>
                              {project.assignedDesigner.phone && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">📞</span>
                                  <a href={`tel:${project.assignedDesigner.phone}`} className="text-blue-600 hover:underline">
                                    {project.assignedDesigner.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                          {project.assignedCRM && (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">Contact CRM:</span>
                                <span className="text-purple-600 font-medium">
                                  {project.assignedCRM.fullName}
                                </span>
                              </div>
                              {project.assignedCRM.phone && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">📞</span>
                                  <a href={`tel:${project.assignedCRM.phone}`} className="text-purple-600 hover:underline">
                                    {project.assignedCRM.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <ProfileLayout>
      <div className="bg-white rounded-2xl shadow-md p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-sm font-body text-gray-600 mb-2">
              <span>My Account</span>
              <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-red-600 font-semibold">My Projects</span>
            </div>
            <h1 className="font-heading text-3xl text-primary">
              My Projects
            </h1>
          </div>

        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : (
          <ProjectsList />
        )}
      </div>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {showImageGalleryModal && selectedProjectForImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageGalleryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-heading text-primary">Design Images</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedProjectForImages?.title} - {selectedProjectForImages?.projectId}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowImageGalleryModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {loadingImages ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : designImages.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">No design images available yet</p>
                    <p className="text-sm text-gray-400 mt-1">Your designer will share design images here</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Gallery ({designImages.length} {designImages.length === 1 ? 'image' : 'images'})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {designImages.map((image) => (
                        <div key={image._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <img
                            src={`${API_URL}${image.relativePath}`}
                            alt={image.originalName}
                            className="w-full h-64 object-cover cursor-pointer"
                            onClick={() => window.open(`${API_URL}${image.relativePath}`, '_blank')}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                            }}
                          />
                          <div className="p-3 bg-white">
                            <p className="text-sm text-gray-900 font-medium truncate" title={image.originalName}>
                              {image.originalName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(image.uploadedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowImageGalleryModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProfileLayout>
  )
}

export default MyProjects
