/**
 * LeadJourney Component
 *
 * Visualizes the journey of a lead through different stages
 * Shows timeline of status changes, interactions, and notes
 */

import { motion } from 'framer-motion'

const LeadJourney = ({ lead }) => {
  // Create journey timeline from lead data
  const getJourneySteps = () => {
    const steps = []

    // Initial submission
    steps.push({
      title: 'Lead Submitted',
      description: `${lead.name} submitted inquiry`,
      timestamp: lead.createdAt,
      status: 'new',
      icon: '📝',
      color: 'bg-blue-500',
      user: 'Customer'
    })

    // Add history entries if available
    if (lead.history && lead.history.length > 0) {
      lead.history.forEach(entry => {
        const statusMatch = entry.description.match(/Status changed.*to "([^"]+)"/);
        const newStatus = statusMatch ? statusMatch[1].toLowerCase().replace(/ /g, '_') : lead.status;

        steps.push({
          title: entry.action === 'updated' ? 'Lead Updated' : entry.action,
          description: entry.description,
          timestamp: entry.timestamp,
          status: newStatus,
          icon: entry.action === 'updated' ? '✏️' : '📌',
          color: getStatusColor(newStatus),
          user: entry.changedByName || 'Admin User'
        })
      })
    } else {
      // Fallback to old behavior if no history
      // Status changes
      if (lead.status !== 'new') {
        steps.push({
          title: getStatusLabel(lead.status),
          description: `Status changed to ${getStatusLabel(lead.status)}`,
          timestamp: lead.updatedAt || lead.createdAt,
          status: lead.status,
          icon: getStatusIcon(lead.status),
          color: getStatusColor(lead.status),
          user: 'Admin User'
        })
      }

      // Add notes if available
      if (lead.notes && lead.notes.trim()) {
        steps.push({
          title: 'Notes Added',
          description: lead.notes,
          timestamp: lead.updatedAt || lead.createdAt,
          status: 'note',
          icon: '💬',
          color: 'bg-gray-500',
          user: 'Admin User'
        })
      }
    }

    // Sort by timestamp
    return steps.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }

  const getStatusLabel = (status) => {
    const labels = {
      'new': 'New Lead',
      'rnr': 'Ring & Remind',
      'qualified': 'Qualified',
      'lost': 'Lost',
      'non_prospect': 'Non Prospect',
      'not_reachable': 'Not Reachable',
      'low_budget': 'Low Budget',
      'non_serviceable_area': 'Non Serviceable Area',
      'future_prospect': 'Future Prospect'
    }
    return labels[status] || status
  }

  const getStatusIcon = (status) => {
    const icons = {
      'new': '🆕',
      'rnr': '🔔',
      'qualified': '✅',
      'lost': '❌',
      'non_prospect': '⛔',
      'not_reachable': '📵',
      'low_budget': '💰',
      'non_serviceable_area': '📍',
      'future_prospect': '⏳'
    }
    return icons[status] || '📌'
  }

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-500',
      'rnr': 'bg-gray-500',
      'qualified': 'bg-green-500',
      'lost': 'bg-red-500',
      'non_prospect': 'bg-gray-600',
      'not_reachable': 'bg-yellow-500',
      'low_budget': 'bg-orange-500',
      'non_serviceable_area': 'bg-purple-500',
      'future_prospect': 'bg-indigo-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const journeySteps = getJourneySteps()

  return (
    <div className="space-y-6">
      {/* Lead Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-2xl mb-2">{lead.name}</h3>
            <p className="font-body text-sm opacity-90">{lead.email}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-2">{getStatusIcon(lead.status)}</div>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-subheading">
              {getStatusLabel(lead.status)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
        >
          <div className="text-2xl mb-2">📍</div>
          <p className="font-subheading text-sm text-gray-600">Location</p>
          <p className="font-body text-primary">{lead.city || 'Not specified'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500"
        >
          <div className="text-2xl mb-2">📐</div>
          <p className="font-subheading text-sm text-gray-600">Carpet Area</p>
          <p className="font-body text-primary">{lead.carpetArea ? `${lead.carpetArea} sq ft` : 'Not specified'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-md border-l-4 border-accent"
        >
          <div className="text-2xl mb-2">💵</div>
          <p className="font-subheading text-sm text-gray-600">Estimated Cost</p>
          <p className="font-body text-primary">{lead.estimatedCost ? `₹${lead.estimatedCost.toLocaleString()}` : 'Not specified'}</p>
        </motion.div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="font-heading text-xl text-primary mb-6">Lead Journey Timeline</h4>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {journeySteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-4"
              >
                {/* Icon */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white text-xl shadow-lg`}>
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-subheading text-primary">{step.title}</h5>
                      {step.user && (
                        <p className="text-xs font-body text-gray-500 mt-1">
                          👤 Changed by: <span className="font-medium text-gray-700">{step.user}</span>
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-body text-gray-500 ml-2">{formatDate(step.timestamp)}</span>
                  </div>
                  <p className="font-body text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      {lead.requirements && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h4 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
            <span>📋</span> Requirements
          </h4>
          <p className="font-body text-gray-700 whitespace-pre-wrap">{lead.requirements}</p>
        </motion.div>
      )}
    </div>
  )
}

export default LeadJourney
