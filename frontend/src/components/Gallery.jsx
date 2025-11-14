/**
 * Gallery Component
 *
 * Responsive grid showcasing featured interior design projects.
 *
 * Design Features:
 * - Masonry-style responsive grid
 * - Hover effect with tan overlay and title
 * - Smooth animations and loading states
 */

import { motion } from 'framer-motion'

// Gallery projects data
const galleryProjects = [
    {
      id: 1,
      title: 'Modern Living Room',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200',
    },
    {
      id: 2,
      title: 'Luxury Bedroom Suite',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200',
    },
    {
      id: 3,
      title: 'Contemporary Modular Kitchen',
      category: 'Modular Kitchen',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200',
    },
    {
      id: 4,
      title: 'Executive Office Design',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200',
    },
    {
      id: 5,
      title: 'Elegant Dining Space',
      category: 'Full Home',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200',
    },
    {
      id: 6,
      title: 'Spa Bathroom Design',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200',
    },
    {
      id: 7,
      title: 'Minimalist Bedroom',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200',
    },
    {
      id: 8,
      title: 'Open Plan Living',
      category: 'Full Home',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200',
    },
    {
      id: 9,
      title: 'Designer Wardrobe',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200',
    },
    {
      id: 10,
      title: 'Contemporary Lounge',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?q=80&w=1200',
    },
    {
      id: 11,
      title: 'Luxury Master Suite',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200',
    },
    {
      id: 12,
      title: 'Modern Kitchen Island',
      category: 'Modular Kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200',
    },
  ]

const Gallery = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50">
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
            Featured Designs
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            100% custom interior solutions crafted with complete transparency — no templates, just unique designs tailored to your vision.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {galleryProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer aspect-[4/3]"
            >
              {/* Project Image */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Hover Overlay with Accent Color */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-20"
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <span className="inline-block font-subheading text-xs text-accent uppercase tracking-wider mb-2">
                    {project.category}
                  </span>
                  <h3 className="font-subheading text-2xl text-white">
                    {project.title}
                  </h3>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/portfolio"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block border-2 border-primary text-primary font-subheading text-lg px-8 py-4 rounded-2xl hover:bg-primary hover:text-white transition-all duration-200"
          >
            View Full Portfolio
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Gallery
