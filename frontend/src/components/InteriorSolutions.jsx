/**
 * InteriorSolutions Component
 *
 * Comprehensive grid showcasing 15+ interior service categories
 * Similar to HomeLane's solutions section with icons and descriptions
 */

import { motion } from 'framer-motion'

const InteriorSolutions = () => {
  const solutions = [
    { name: 'False Ceiling', icon: '🏛️', description: 'Elegant ceiling designs' },
    { name: 'Lighting', icon: '💡', description: 'Ambient & accent lighting' },
    { name: 'Wallpaper', icon: '🎨', description: 'Designer wall coverings' },
    { name: 'Wall Paint', icon: '🖌️', description: 'Premium paint finishes' },
    { name: 'Flooring', icon: '📐', description: 'Wood, tile & vinyl flooring' },
    { name: 'Bathroom Fixtures', icon: '🚿', description: 'Modern sanitaryware' },
    { name: 'Kitchen Appliances', icon: '🔥', description: 'Built-in appliances' },
    { name: 'Pooja Unit', icon: '🕉️', description: 'Sacred space designs' },
    { name: 'Study Table', icon: '📚', description: 'Ergonomic workspaces' },
    { name: 'TV Unit', icon: '📺', description: 'Entertainment centers' },
    { name: 'Crockery Unit', icon: '🍽️', description: 'Display & storage' },
    { name: 'Sofa', icon: '🛋️', description: 'Custom upholstery' },
    { name: 'Curtains & Blinds', icon: '🪟', description: 'Window treatments' },
    { name: 'Shoe Rack', icon: '👞', description: 'Smart storage solutions' },
    { name: 'Storage Units', icon: '📦', description: 'Space optimization' },
    { name: 'Mirrors', icon: '🪞', description: 'Decorative & functional' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-primary mb-4">
            Complete Interior Solutions
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to transform your home, all under one roof
          </p>
        </div>

        {/* Solutions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: '0 10px 40px rgba(21, 48, 87, 0.15)' }}
              className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:border-accent"
            >
              <div className="text-5xl mb-3">{solution.icon}</div>
              <h3 className="font-subheading text-primary text-sm md:text-base mb-2">
                {solution.name}
              </h3>
              <p className="font-body text-gray-500 text-xs">
                {solution.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="font-body text-gray-600 mb-6">
            Can't find what you're looking for? We offer custom solutions too!
          </p>
          <motion.a
            href="#estimate"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-accent text-primary font-subheading text-lg px-8 py-4 rounded-2xl hover:bg-opacity-90 transition-all duration-200"
          >
            Discuss Your Requirements
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default InteriorSolutions
