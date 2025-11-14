/**
 * HowItWorks Component
 *
 * Explains the step-by-step process of working with HOH 108
 */

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const HowItWorks = () => {
  const steps = [
    { number: '01', title: 'Booking', description: 'Confirm your interest and secure your slot' },
    { number: '02', title: 'Design Consultation & Technical Visit', description: 'Our team visits your site and discusses design goals' },
    { number: '03', title: 'Tentative Budget Approval', description: 'We present an approximate estimate for review' },
    { number: '04', title: 'HOH 108 Booking Fees', description: 'Pay a token to begin detailed design and planning' },
    { number: '05', title: 'Material Selection & Final Budget', description: 'You choose materials; we finalise actual costs' },
    { number: '06', title: 'Stage-Wise Fees', description: 'Payments are split across defined milestones' },
    { number: '07', title: 'Material Procurement', description: 'You pay vendors directly for transparency' },
    { number: '08', title: 'Factory Production', description: 'Execution begins under factory supervision' },
    { number: '09', title: 'Dispatch & Delivery', description: 'Materials dispatched from the factory' },
    { number: '10', title: 'Installation & On-site Work', description: 'Site assembly and finishing begin' },
    { number: '11', title: 'Vendor Payments', description: 'Pay vendors as per work completion' },
    { number: '12', title: 'Handover Complete', description: 'Project quality-checked and approved' },
    { number: '13', title: 'Final Service Fee Settlement', description: 'Remaining HOH 108 service fee collected' },
    { number: '14', title: 'Handover Certificate Shared', description: 'Formal completion and documentation of your project' }
  ]

  const features = [
    {
      title: 'Express Delivery',
      description: 'Fast execution without compromising on quality',
      icon: '⚡'
    },
    {
      title: 'Quality Assurance',
      description: 'Rigorous quality checks at every stage',
      icon: '🛡️'
    },
    {
      title: 'Transparent Pricing',
      description: 'No hidden costs, clear pricing from day one',
      icon: '💎'
    },
    {
      title: 'Dedicated Project Manager',
      description: 'Single point of contact throughout your journey',
      icon: '👤'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              How It Works
            </h1>
            <p className="font-body text-xl text-white/90 max-w-3xl mx-auto">
              We ensure a fully managed yet fully visible process, designed to give you flexibility, clarity, and confidence at every stage
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section - Grid Layout */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto">
              From idea to handover, we make sure every step is transparent, timely, and tailored for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-subheading text-lg text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="font-body text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">
              What Makes Us Different
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto">
              We combine expertise, quality, and customer satisfaction in everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-subheading text-xl text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="font-body text-xl text-white/90 mb-8">
              Get started with a free consultation and see how we can bring your vision to life
            </p>
            <Link
              to="/signup"
              className="inline-block bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Get Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HowItWorks
