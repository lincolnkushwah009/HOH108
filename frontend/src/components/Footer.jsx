/**
 * Footer Component
 *
 * Site footer with multiple columns for About, Quick Links, Services, and Contact.
 * Deep navy background with light grey text that turns tan on hover.
 *
 * Design Features:
 * - Four column layout on desktop, stacked on mobile
 * - Social media icons
 * - Newsletter signup
 * - Copyright and legal links
 */

import { motion } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  const currentYear = new Date().getFullYear()

  // Check if we're on auth pages (login/signup)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  // Don't show footer on auth pages
  if (isAuthPage) {
    return null
  }

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Team', href: '#team' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' },
    ],
    quickLinks: [
      { name: 'Home', href: '#home' },
      { name: 'Portfolio', href: '#gallery' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Testimonials', href: '#testimonials' },
    ],
    services: [
      { name: 'Residential Design', href: '/how-it-works', isRoute: true },
      { name: 'Space Planning', href: '/how-it-works', isRoute: true },
      { name: 'Consultation', href: '/#estimate', isRoute: false },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy', isRoute: true },
      { name: 'Terms of Service', href: '#terms', isRoute: false },
      { name: 'Cookie Policy', href: '#cookies', isRoute: false },
    ],
  }


  return (
    <footer id="contact" className="bg-primary text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* About Column */}
          <div>
            <h3 className="font-heading text-2xl text-white mb-4">
              HOH 108
            </h3>
            <p className="font-body text-sm leading-relaxed">
              Where Vision Meets Home. Full-service residential construction and interior design — from blueprint to handover, we handle it all under one roof.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-subheading text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-subheading text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="font-body text-sm hover:text-accent transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="font-body text-sm hover:text-accent transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-subheading text-white mb-4">Get In Touch</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-accent mb-1">Bengaluru</p>
                  <span>3/1, 11th St, Venkatapura,<br />Koramangala, Bengaluru, Karnataka 560034</span>
                  <p className="font-semibold text-accent mb-1 mt-3">Mysore</p>
                  <span>264/1AD 47/1A, First Floor,<br />2nd Main Road, V.V. Mohalla, Mysore 570002</span>
                </div>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a
                  href="tel:+919108771647"
                  className="hover:text-accent transition-colors"
                >
                  +91 91087 71647
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a
                  href="mailto:info@hoh108.com"
                  className="hover:text-accent transition-colors"
                >
                  info@hoh108.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-center md:text-left">
            {currentYear} HOH 108. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {footerLinks.legal.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-body text-sm hover:text-accent transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-body text-sm hover:text-accent transition-colors duration-200"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
