/**
 * BrownServiceCards Component
 *
 * Displays four service cards with brown background and icons
 */

import { motion } from 'framer-motion'

const BrownServiceCards = () => {
  const services = [
    {
      title: 'CONSTRUCTION',
      description: 'We build homes with the DQA model ensuring transparency, accurate timelines, and detailed planning from blueprint to handover.',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800',
    },
    {
      title: 'INTERIOR DESIGN',
      description: 'We transform spaces into fresh, functional homes with clear specifications, known costs, and predictable timelines.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800',
    },
    {
      title: 'RENOVATION',
      description: 'Reimagining existing spaces using the DQA approach for clarity on changes, costs, and completion.',
      image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=800',
    },
    {
      title: 'HOME AUTOMATION',
      description: 'Integrating smart systems for lighting, climate, security, and appliances controllable via phone or voice.',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800',
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
    <section className="py-20 bg-support">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-primary p-8 h-full flex flex-col md:flex-row gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Text Content */}
                <div className="flex-1 text-white">
                  <h3 className="font-subheading text-xl mb-4 text-accent">
                    {service.title}
                  </h3>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Image */}
                <div className="w-full md:w-32 h-32 flex-shrink-0">
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default BrownServiceCards
