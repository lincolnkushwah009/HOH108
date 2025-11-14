/**
 * TrustIndicators Component
 *
 * Displays glass-morphism feature cards with background image
 */

import { motion } from 'framer-motion'

const TrustIndicators = () => {
  const features = [
    {
      icon: '💡',
      title: 'Material Choices Guided by Our Experts',
      description: 'Expert-approved by subcontracting shows',
    },
    {
      icon: '👥',
      title: 'In-house Team with Transparency',
      description: 'No subcontracting shows',
    },
    {
      icon: '⏱️',
      title: 'On-Time Delivery',
      description: 'Guaranteed completion as scheduled',
    },
    {
      icon: '💰',
      title: 'No Margin Stacking',
      description: 'Transparent pricing with no hidden costs',
    },
    {
      icon: '🏠',
      title: 'Design + Execution Under One Roof',
      description: 'Complete service consolidated',
    },
    {
      icon: '⭐',
      title: 'A-Z list',
      description: 'Comprehensive services from start to finish',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000')`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group cursor-pointer"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 h-full transition-all duration-300 hover:bg-white/20">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-subheading text-lg text-white mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-white/80">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TrustIndicators
