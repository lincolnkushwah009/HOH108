/**
 * Portfolio Page Component
 *
 * Full portfolio showcase of interior design projects
 * Features filtering, search, and detailed project views
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'Modern Living Room',
      category: 'residential',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200',
      description: 'Contemporary living space with minimalist design'
    },
    {
      id: 2,
      title: 'Luxury Bedroom Suite',
      category: 'residential',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200',
      description: 'Elegant master bedroom with custom wardrobes'
    },
    {
      id: 3,
      title: 'Contemporary Modular Kitchen',
      category: 'modular-kitchen',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200',
      description: 'Fully functional modular kitchen with premium finishes'
    },
    {
      id: 4,
      title: 'Executive Office Design',
      category: 'commercial',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200',
      description: 'Professional workspace with modern aesthetics'
    },
    {
      id: 5,
      title: 'Elegant Dining Space',
      category: 'full-home',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200',
      description: 'Sophisticated dining area with custom furniture'
    },
    {
      id: 6,
      title: 'Spa Bathroom Design',
      category: 'residential',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200',
      description: 'Luxurious bathroom with spa-like ambiance'
    },
    {
      id: 7,
      title: 'Minimalist Bedroom',
      category: 'residential',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200',
      description: 'Clean and serene bedroom design'
    },
    {
      id: 8,
      title: 'Open Plan Living',
      category: 'full-home',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200',
      description: 'Spacious open-concept living area'
    },
    {
      id: 9,
      title: 'Designer Wardrobe',
      category: 'residential',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200',
      description: 'Custom walk-in wardrobe with premium fittings'
    },
    {
      id: 10,
      title: 'Contemporary Lounge',
      category: 'commercial',
      image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?q=80&w=1200',
      description: 'Modern commercial lounge space'
    },
    {
      id: 11,
      title: 'Luxury Master Suite',
      category: 'residential',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200',
      description: 'Premium master bedroom with ensuite'
    },
    {
      id: 12,
      title: 'Modern Kitchen Island',
      category: 'modular-kitchen',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200',
      description: 'Contemporary kitchen with functional island'
    },
    {
      id: 13,
      title: 'Cozy Reading Nook',
      category: 'residential',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200',
      description: 'Intimate reading corner with custom shelving'
    },
    {
      id: 14,
      title: 'Corporate Office Space',
      category: 'commercial',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200',
      description: 'Professional office interior with ergonomic design'
    },
    {
      id: 15,
      title: 'Modern Bathroom',
      category: 'residential',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200',
      description: 'Contemporary bathroom with premium fixtures'
    },
    {
      id: 16,
      title: 'Elegant Living Area',
      category: 'full-home',
      image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?q=80&w=1200',
      description: 'Sophisticated living room with classic touches'
    },
    {
      id: 17,
      title: 'Chef\'s Kitchen',
      category: 'modular-kitchen',
      image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=1200',
      description: 'Professional-grade modular kitchen design'
    },
    {
      id: 18,
      title: 'Boutique Hotel Suite',
      category: 'commercial',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200',
      description: 'Luxurious hotel room interior design'
    },
  ]

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'modular-kitchen', label: 'Modular Kitchen' },
    { id: 'full-home', label: 'Full Home' },
  ]

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter)

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary to-primary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-5xl md:text-6xl text-white mb-6"
          >
            Our Portfolio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-xl text-white/90 max-w-3xl mx-auto"
          >
            Explore our collection of 100% custom interior designs crafted with complete transparency
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-subheading text-sm transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-accent text-primary shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeFilter}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
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

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <span className="inline-block font-subheading text-xs text-accent uppercase tracking-wider mb-2">
                      {filters.find(f => f.id === project.category)?.label || project.category}
                    </span>
                    <h3 className="font-subheading text-2xl text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="font-body text-sm text-white/80">
                      {project.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-xl text-gray-600">
                No projects found in this category
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl text-white mb-6"
          >
            Ready to Transform Your Space?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-xl text-white/90 mb-8"
          >
            Let's create a custom interior design solution tailored just for you
          </motion.p>
          <motion.a
            href="/#estimate"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-accent text-primary font-subheading text-lg px-10 py-5 rounded-2xl hover:bg-opacity-90 transition-all duration-200 shadow-2xl"
          >
            Get Free Estimate
          </motion.a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Portfolio
