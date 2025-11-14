/**
 * HeroSection Component
 *
 * Full-screen hero section with luxury interior background and animated content.
 * Features fade-in and upward motion animations using Framer Motion.
 *
 * Design Elements:
 * - The Season font for headline
 * - Warm Tan CTA button
 * - Responsive layout for all screen sizes
 */

import { motion } from 'framer-motion'

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-center justify-end overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right w-full"
      >
        <div className="max-w-2xl ml-auto">
          <motion.h1
            variants={itemVariants}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          >
            Designed to Reflect You
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-body text-base sm:text-lg text-white/90 mb-8 leading-relaxed"
          >
            Timeless interiors that blend beauty, function, and personal style to create spaces uniquely yours.
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
