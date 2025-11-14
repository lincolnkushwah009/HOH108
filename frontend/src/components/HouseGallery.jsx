/**
 * HouseGallery Component
 *
 * Displays "Crafting Tailor made Homes & Interiors" with house gallery
 */

import { motion } from 'framer-motion'

const HouseGallery = () => {
  const houses = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=800',
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

  const imageVariants = {
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
    <section className="py-20 bg-support">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-primary mb-2">
            Crafting Tailor made
          </h2>
          <h3 className="font-heading text-4xl md:text-5xl text-accent">
            Homes & Interiors
          </h3>
        </motion.div>

        {/* Gallery */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex overflow-x-auto gap-6 pb-6 mb-12 scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
          }}
        >
          {houses.map((house, index) => (
            <motion.div
              key={index}
              variants={imageVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              className="flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img
                src={house}
                alt={`House ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <p className="font-body text-base md:text-lg text-gray-700 leading-relaxed mb-4">
            Welcome to House of Hancet 108. Are you dreaming of a home that feels truly yours, inside and out?
          </p>
          <p className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
            We're here to make it happen. As a full-service residential construction and interior design company, we take care of
            everything for you, from the first blueprint to handing over the keys to your fully finished interiors.
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

export default HouseGallery
