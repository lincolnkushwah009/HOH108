/**
 * HOH 108 Premium Home Page
 * Brand Colors: Primary #795535 (Brown), Secondary #e6e0da (Beige), Black #151413, Accent Gold
 * Typography: VICENZA (Primary), Montserrat (Secondary), ARASTIN STD (Numerics)
 * Tagline: "WHERE VISION MEETS HOME"
 */

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import logo from '../assets/IM-Logo.png'

const HomePage = () => {
  const [activeSection, setActiveSection] = useState(0)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  const services = [
    {
      icon: '🎨',
      title: 'Interior Design',
      description: 'Transform spaces into personalized sanctuaries with our expert design services',
      color: 'from-blue-600 to-purple-600',
      bgColor: 'bg-blue-50',
      href: '/interior-design'
    },
    {
      icon: '🏗️',
      title: 'Construction',
      description: 'Building dreams with precision, quality, and unwavering commitment',
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-50',
      href: '/construction'
    },
    {
      icon: '🔨',
      title: 'Renovations',
      description: 'Breathe new life into your existing spaces with expert renovation services',
      color: 'from-green-600 to-teal-600',
      bgColor: 'bg-green-50',
      href: '/renovations'
    },
    {
      icon: '⚡',
      title: 'On-Demand Services',
      description: 'Quick solutions for all your home maintenance and repair needs',
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
      href: '/on-demand-services'
    }
  ]

  const values = [
    {
      number: '01',
      title: 'Trust',
      description: 'Building relationships on the foundation of transparency and reliability',
      icon: '🤝'
    },
    {
      number: '02',
      title: 'Transparency',
      description: 'Clear communication and detailed insights at every step of your journey',
      icon: '💎'
    },
    {
      number: '03',
      title: 'Technology',
      description: 'Leveraging cutting-edge innovation to deliver exceptional experiences',
      icon: '🚀'
    },
    {
      number: '04',
      title: 'DQA Method',
      description: 'Detailed Quantity Analysis ensuring precision and accountability',
      icon: '📊'
    }
  ]

  const stats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '50+', label: 'Expert Team Members' },
    { number: '108', label: 'Symbol of Completeness' }
  ]

  return (
    <div className="min-h-screen bg-[#e6e0da]">
      <Navbar />

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-96 h-96 bg-gradient-to-br from-[#795535]/30 to-[#FDB913]/30 rounded-full blur-3xl -top-20 -left-20"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#795535]/20 to-[#151413]/20 rounded-full blur-3xl top-1/4 right-0"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute w-80 h-80 bg-gradient-to-br from-[#FDB913]/30 to-[#795535]/30 rounded-full blur-3xl bottom-0 left-1/3"
          />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          {/* Logo with Animation */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            <img src={logo} alt="HOH 108" className="h-32 w-auto mx-auto drop-shadow-2xl" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-heading text-6xl md:text-7xl lg:text-8xl mb-8 text-[#795535]"
          >
            WHERE VISION<br />MEETS HOME
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-[#151413]/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Pioneering home-curation that redefines construction through trust, transparency, and technology
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.a
              href="#estimate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#795535] to-[#151413] text-white px-12 py-4 rounded-full text-lg font-subheading shadow-2xl hover:shadow-[#795535]/50 transition-all duration-300"
            >
              Start Your Journey
            </motion.a>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/80 backdrop-blur-sm text-[#795535] px-12 py-4 rounded-full text-lg font-subheading border-2 border-[#795535]/20 hover:border-[#795535] transition-all duration-300"
            >
              Explore Services
            </motion.a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-[#795535] rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-[#795535] rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#795535] to-[#151413] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold text-[#FDB913] mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {stat.number}
                </div>
                <div className="text-white/90 text-sm md:text-base font-subheading">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy of 108 */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-96 h-96 border-2 border-[#795535]/10 rounded-full -top-48 -right-48"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-96 h-96 border-2 border-[#FDB913]/10 rounded-full -bottom-48 -left-48"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-9xl font-bold text-transparent bg-gradient-to-br from-[#795535] via-[#FDB913] to-[#151413] bg-clip-text mb-4"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                108
              </motion.div>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl text-[#795535] mb-6">
              The Philosophy of Completeness
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              The number 108 holds profound significance across cultures, symbolizing wholeness and perfection.
              At House of Hancet 108, we embody this philosophy in every project—delivering complete,
              comprehensive solutions that leave nothing to chance. From initial vision to final execution,
              we ensure every detail achieves the fullness of your dream home.
            </p>
          </motion.div>

          {/* Glass Morphism Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Complete Solutions', icon: '✓', desc: '108 checkpoints ensuring nothing is missed' },
              { title: 'Holistic Approach', icon: '◯', desc: 'Every aspect harmoniously integrated' },
              { title: 'Perfect Balance', icon: '☯', desc: 'Form, function, and beauty in unity' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/60 backdrop-blur-md border border-[#795535]/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-4xl text-[#FDB913] mb-4">{item.icon}</div>
                <h3 className="font-subheading text-xl text-[#795535] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gradient-to-br from-[#e6e0da] to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-[#795535] mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              The pillars that define our commitment to excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#795535]/10">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#FDB913] to-[#795535] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {value.number}
                  </div>

                  {/* Icon */}
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>

                  {/* Content */}
                  <h3 className="font-subheading text-2xl text-[#795535] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DQA Method Showcase */}
      <section className="py-24 bg-gradient-to-br from-[#151413] to-[#795535] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-full h-full bg-[url('/dots.svg')] opacity-10"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">
              The DQA Method
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Detailed Quantity Analysis: Our proprietary approach to transparency and precision
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 'Step 1',
                title: 'Detailed Analysis',
                desc: 'Comprehensive breakdown of every material and labor requirement',
                icon: '🔍'
              },
              {
                step: 'Step 2',
                title: 'Quantity Precision',
                desc: 'Exact measurements and quantities, eliminating wastage and overruns',
                icon: '📏'
              },
              {
                step: 'Step 3',
                title: 'Transparent Reporting',
                desc: 'Clear documentation at every stage, keeping you informed',
                icon: '📋'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-[#FDB913] font-subheading text-sm mb-2">{item.step}</div>
                <h3 className="text-white font-subheading text-xl mb-3">{item.title}</h3>
                <p className="text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-[#FDB913] text-[#151413] px-10 py-4 rounded-full font-subheading text-lg shadow-2xl hover:shadow-[#FDB913]/50 transition-all duration-300"
            >
              Learn More About DQA
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-[#795535] mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Comprehensive solutions for every aspect of your home journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <Link to={service.href}>
                  <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Animated Pattern */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-10">
                      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <h3 className="font-heading text-3xl text-white mb-4">
                        {service.title}
                      </h3>
                      <p className="text-white/90 text-lg mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center text-white font-subheading group-hover:translate-x-2 transition-transform duration-300">
                        Explore Service
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-[#e6e0da] to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-[#795535] mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Stories of transformation and satisfaction
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Homeowner',
                text: 'HOH 108 transformed our house into a dream home. The DQA method gave us complete transparency and peace of mind.',
                rating: 5
              },
              {
                name: 'Priya Sharma',
                role: 'Interior Designer',
                text: 'Working with HOH 108 was seamless. Their attention to detail and commitment to quality is unmatched.',
                rating: 5
              },
              {
                name: 'Amit Patel',
                role: 'Business Owner',
                text: 'From construction to interior design, they handled everything professionally. True to their philosophy of completeness.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#FDB913]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-subheading text-[#795535] font-semibold">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="estimate" className="py-24 bg-gradient-to-br from-[#795535] via-[#151413] to-[#795535] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-96 h-96 bg-[#FDB913] rounded-full blur-3xl top-0 right-0"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute w-96 h-96 bg-white rounded-full blur-3xl bottom-0 left-0"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">
              Ready to Transform Your Vision?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Let's begin your journey to the perfect home. Get a detailed estimate and consultation from our experts.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-[#FDB913] text-[#151413] px-12 py-5 rounded-full text-xl font-subheading shadow-2xl hover:shadow-[#FDB913]/50 transition-all duration-300"
            >
              Get Your Free Estimate
            </motion.a>
            <div className="mt-8 text-white/70 text-sm">
              No commitment required • Quick response • Detailed analysis
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
