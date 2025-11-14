/**
 * HowItWorks Component
 *
 * Visual step-by-step process flow with an animated warm tan progress line.
 * Shows the journey from consultation to completion.
 *
 * Design Features:
 * - Vertical progress line on mobile, horizontal on desktop
 * - Animated line that draws as you scroll
 * - Step numbers in accent circles
 */

import { motion } from 'framer-motion'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Initial Consultation',
      description: 'Share your vision and requirements. We discuss your style preferences, budget, and timeline.',
    },
    {
      number: '02',
      title: 'Design Concept',
      description: 'Our designers create custom concepts with 3D visualizations, mood boards, and material selections.',
    },
    {
      number: '03',
      title: 'Proposal & Approval',
      description: 'Review detailed plans and transparent pricing. Make revisions until you\'re 100% satisfied.',
    },
    {
      number: '04',
      title: 'Execution & Delivery',
      description: 'Our expert team brings your design to life with precision craftsmanship and on-time delivery.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
            How It Works
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            A seamless process from concept to completion, designed to bring your vision to life.
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">
          {/* Progress Line - Desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1">
            <div className="absolute inset-0 bg-gray-200" />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 bg-accent origin-left"
            />
          </div>

          {/* Progress Line - Mobile */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-1">
            <div className="absolute inset-0 bg-gray-200" />
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 bg-accent origin-top"
            />
          </div>

          {/* Steps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4 relative"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                className="relative flex lg:flex-col items-start lg:items-center pl-16 lg:pl-0"
              >
                {/* Step Number Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5, type: 'spring' }}
                  className="absolute left-0 lg:relative lg:left-auto flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 bg-accent text-primary rounded-full flex items-center justify-center font-subheading text-lg lg:text-xl mb-0 lg:mb-4 z-10"
                >
                  {step.number}
                </motion.div>

                {/* Step Content */}
                <div className="lg:text-center">
                  <h3 className="font-subheading text-xl lg:text-2xl text-primary mb-2 lg:mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#estimate"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(198, 156, 109, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-accent text-primary font-subheading text-lg px-8 py-4 rounded-2xl hover:bg-opacity-90 transition-all duration-200"
          >
            Start Your Project Today
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
