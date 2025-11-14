/**
 * ProcessTimeline Component
 *
 * Displays the step-by-step process and payment milestones
 * Similar to HomeLane's payment slider showing transparency in timeline
 */

import { motion } from 'framer-motion'
import { useState } from 'react'

const ProcessTimeline = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      number: '01',
      title: 'Booking',
      description: 'Confirm your interest and secure your slot',
      icon: '📝'
    },
    {
      number: '02',
      title: 'Design Consultation and Measurements',
      description: 'Our team visits your site for consultation and precise measurements',
      icon: '📐'
    },
    {
      number: '03',
      title: 'Customised Design Approval',
      description: 'Review and approve your personalized design concept',
      icon: '✨'
    },
    {
      number: '04',
      title: 'Material Selection',
      description: 'Choose materials that match your vision and budget',
      icon: '🎨'
    },
    {
      number: '05',
      title: 'Customised Budget',
      description: 'Detailed budget prepared based on your selections',
      icon: '💰'
    },
    {
      number: '06',
      title: 'Customised Budget Approval',
      description: 'Review and approve the final project budget',
      icon: '✅'
    },
    {
      number: '07',
      title: 'HOH 108 Fees',
      description: 'Payment of HOH 108 service fee',
      icon: '💳'
    },
    {
      number: '08',
      title: 'Material Procurement and Payment to Vendors directly',
      description: 'Direct payment to vendors for complete transparency',
      icon: '🤝'
    },
    {
      number: '09',
      title: 'Factory Production with Timeline',
      description: 'Manufacturing begins with clear timeline and milestones',
      icon: '🏭'
    },
    {
      number: '10',
      title: 'Dispatch',
      description: 'Materials dispatched from factory to site',
      icon: '🚚'
    },
    {
      number: '11',
      title: 'On site Execution & Installation',
      description: 'Professional installation and on-site execution',
      icon: '🔧'
    },
    {
      number: '12',
      title: 'Payment to On site Vendors',
      description: 'Direct payment to on-site execution vendors',
      icon: '💸'
    },
    {
      number: '13',
      title: 'Handover',
      description: 'Project quality-checked and handed over',
      icon: '🏠'
    },
    {
      number: '14',
      title: 'Balance amounts Cleared',
      description: 'Final settlement of all pending amounts',
      icon: '💼'
    },
    {
      number: '15',
      title: 'Move in Certificate',
      description: 'Official move-in certification provided',
      icon: '📜'
    },
    {
      number: '16',
      title: 'Free Maintenance Visits',
      description: 'Complimentary maintenance support post-handover',
      icon: '🛠️'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-primary mb-4">
            Our Process
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Complete transparency from booking to handover — track every step of your interior journey
          </p>
        </div>

        {/* Steps with Flowing Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Steps in grid pattern */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              return (
                <motion.div
                  key={index}
                  variants={stepVariants}
                  onMouseEnter={() => setActiveStep(index)}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`relative bg-white p-6 rounded-2xl shadow-xl border-2 ${
                    activeStep === index ? 'border-accent bg-accent/5' : 'border-gray-100'
                  } transition-all duration-300 hover:shadow-2xl`}
                  style={{
                    zIndex: 10
                  }}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                    <span className="font-bold text-white text-sm">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="text-5xl mb-4 mt-2 text-center">{step.icon}</div>

                  {/* Title */}
                  <h3 className="font-subheading text-base text-primary mb-2 text-center min-h-[48px] flex items-center justify-center">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-gray-600 text-xs leading-relaxed text-center">
                    {step.description}
                  </p>

                  {/* Active indicator */}
                  {activeStep === index && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-accent rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-6 bg-white rounded-2xl shadow-lg"
          >
            <div className="font-heading text-4xl text-accent mb-2">Handover</div>
            <div className="font-subheading text-primary">In 720 Working Hours </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center p-6 bg-white rounded-2xl shadow-lg"
          >
            <div className="font-heading text-4xl text-accent mb-2">100%</div>
            <div className="font-subheading text-primary">Quality Assured</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ProcessTimeline
