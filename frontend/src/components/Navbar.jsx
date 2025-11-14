/**
 * Navbar Component
 *
 * A responsive navigation bar that transitions from transparent to solid dark brown on scroll.
 * Features uppercase links styled with Nexa Bold font and smooth animations.
 *
 * Brand Colors:
 * - Dark Brown (#2c2420) - solid background on scroll
 * - Warm Tan (#b8956f) - hover and active states
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { auth } from '../services/api'
import logo from '../assets/IM-Logo.png'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const location = useLocation()
  const isAuthenticated = auth.isAuthenticated()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'HOME', href: '/', isRoute: true },
    { name: 'PORTFOLIO', href: '/portfolio', isRoute: true },
    { name: 'BLOG', href: '/blog', isRoute: true },
    { name: 'HOW IT WORKS', href: '/how-it-works', isRoute: true },
    { name: 'WHY US', href: '/why-us', isRoute: true },
    { name: 'CONTACT', href: '/#contact', isRoute: false },
  ]

  const services = [
    { name: 'Interior Design', href: '/interior-design', icon: '🎨' },
    { name: 'Construction', href: '/construction', icon: '🏗️' },
    { name: 'Renovations', href: '/renovations', icon: '🔨' },
    { name: 'On-Demand Services (ODS)', href: '/on-demand-services', icon: '⚡' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-primary shadow-xl'
          : 'bg-primary/95 backdrop-blur-sm shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center">
              <img src={logo} alt="HOH 108" className="h-12 w-auto" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-subheading text-sm text-white hover:text-accent transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-subheading text-sm text-white hover:text-accent transition-colors duration-200"
                >
                  {link.name}
                </a>
              )
            ))}

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="font-subheading text-sm text-white hover:text-accent transition-colors duration-200 flex items-center gap-1">
                SERVICES
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 pt-2 w-64"
                >
                  <div className="bg-primary shadow-xl rounded-lg overflow-hidden border border-accent/20"
                >
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="flex items-center gap-3 px-4 py-3 text-white hover:bg-accent/10 hover:text-accent transition-colors duration-200 border-b border-white/10 last:border-b-0"
                    >
                      <span className="text-xl">{service.icon}</span>
                      <span className="font-subheading text-sm">{service.name}</span>
                    </Link>
                  ))}
                  </div>
                </motion.div>
              )}
            </div>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="font-subheading text-sm text-white hover:text-accent transition-colors duration-200"
              >
                LOGIN
              </Link>
            ) : (
              <>
                {/* User Profile Icon */}
                <Link to="/profile/projects">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 bg-support rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  >
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </Link>
              </>
            )}

            <motion.a
              href="/#estimate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-accent text-primary font-subheading px-6 py-2 rounded-2xl hover:bg-opacity-90 transition-all duration-200"
            >
              GET ESTIMATE
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-primary"
        >
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-subheading text-sm text-white hover:text-accent transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-subheading text-sm text-white hover:text-accent transition-colors duration-200"
                >
                  {link.name}
                </a>
              )
            ))}

            {/* Mobile Services Dropdown */}
            <div>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="w-full flex items-center justify-between font-subheading text-sm text-white hover:text-accent transition-colors duration-200"
              >
                SERVICES
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 ml-4 space-y-2"
                >
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setIsServicesOpen(false)
                      }}
                      className="flex items-center gap-2 text-white/90 hover:text-accent transition-colors duration-200 text-sm py-1"
                    >
                      <span className="text-base">{service.icon}</span>
                      <span>{service.name}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>

            {!isAuthenticated ? (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-subheading text-sm text-white hover:text-accent transition-colors duration-200"
              >
                LOGIN
              </Link>
            ) : (
              <>
                <Link
                  to="/profile/projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-subheading text-sm text-white hover:text-accent transition-colors duration-200"
                >
                  MY PROFILE
                </Link>
              </>
            )}

            <a
              href="/#estimate"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center bg-accent text-primary font-subheading px-6 py-2 rounded-2xl hover:bg-opacity-90 transition-all duration-200"
            >
              GET ESTIMATE
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
