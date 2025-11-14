/**
 * WhyUs Component
 *
 * Highlights the unique value propositions and reasons to choose HOH 108
 */

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const WhyUs = () => {
  const reasons = [
    {
      title: 'Complete Customisation',
      description: 'Your design, your style, your choice. Every project is tailored to your unique vision and requirements.',
      icon: '🎨',
      stats: '100% Custom'
    },
    {
      title: 'Cost-Plus Model',
      description: 'Actual cost + fixed HOH 108 service fee. Complete transparency in every rupee you spend.',
      icon: '💰',
      stats: 'Full Transparency'
    },
    {
      title: 'Vendor-Managed Interiors',
      description: 'We coordinate directly with verified vendors to ensure quality and timely delivery at every stage.',
      icon: '🤝',
      stats: 'Verified Partners'
    },
    {
      title: 'Direct Purchase System',
      description: 'You pay vendors directly, no hidden margins. See exactly where your money goes.',
      icon: '💳',
      stats: 'Zero Hidden Costs'
    },
    {
      title: 'Factory Production',
      description: 'Quality-controlled production with timely delivery. Factory-grade standards for your peace of mind.',
      icon: '🏭',
      stats: 'Quality Assured'
    },
    {
      title: 'On-Time & On-Budget Execution',
      description: 'Every rupee tracked, every stage monitored. We ensure your project stays on schedule and within budget.',
      icon: '⏱️',
      stats: 'Fully Monitored'
    }
  ]

  // const achievements = [
  //   {
  //     number: '5000+',
  //     label: 'Projects Completed',
  //     icon: '🏠'
  //   },
  //   {
  //     number: '15+',
  //     label: 'Years Experience',
  //     icon: '📅'
  //   },
  //   {
  //     number: '4.8/5',
  //     label: 'Customer Rating',
  //     icon: '⭐'
  //   },
  //   {
  //     number: '100+',
  //     label: 'Design Experts',
  //     icon: '👥'
  //   }
  // ]

  const values = [
    {
      title: 'Quality First',
      description: 'We never compromise on quality. Every piece of furniture, every finish, every detail is crafted to perfection.',
      icon: '✨'
    },
    {
      title: 'Customer-Centric',
      description: 'Your vision, your comfort, your satisfaction - everything revolves around you. We listen, understand, and deliver.',
      icon: '❤️'
    },
    {
      title: 'Innovation',
      description: 'We stay ahead with the latest design trends, materials, and technology to give you contemporary and timeless spaces.',
      icon: '💡'
    },
    // {
    //   title: 'Sustainability',
    //   description: 'We care about the environment. Our processes and materials are eco-friendly and sustainable for a better tomorrow.',
    //   icon: '🌱'
    // }
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
              Why Choose HOH 108?
            </h1>
            <p className="font-body text-xl text-white/90 max-w-3xl mx-auto">
              Because we believe great design should come with clarity, not confusion. Our transparent workflow empowers you to make informed decisions at every step – design, budget, and execution – while our expert team manages the entire process seamlessly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="font-heading text-3xl md:text-4xl text-primary mb-2">
                  {achievement.number}
                </div>
                <div className="font-body text-gray-600">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Main Reasons */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">
              What Sets Us Apart
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              At HOH 108, transparency isn't a feature — it's our foundation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
                    {reason.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl text-primary mb-2">
                      {reason.title}
                    </h3>
                    <p className="font-body text-gray-600 mb-3 leading-relaxed">
                      {reason.description}
                    </p>
                    <div className="inline-block bg-accent/10 text-primary px-4 py-2 rounded-full font-semibold text-sm">
                      {reason.stats}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">
              Our Core Values
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center">
  {values.map((value, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center p-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-shadow mx-auto w-full max-w-sm"
    >
      <div className="text-5xl mb-4">{value.icon}</div>
      <h3 className="font-subheading text-xl text-primary mb-3">
        {value.title}
      </h3>
      <p className="font-body text-gray-600">
        {value.description}
      </p>
    </motion.div>
  ))}
</div>
        </div>
      </section>

      {/* Testimonial Highlight */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💬</div>
              <div className="text-yellow-500 text-3xl mb-4">★★★★★</div>
            </div>
            <p className="font-body text-xl text-gray-700 italic text-center mb-6 leading-relaxed">
              "Working with HOH 108 was the best decision we made for our home. The team was professional, the design was stunning, and the execution was flawless. Our home has transformed into a space we absolutely love!"
            </p>
            <div className="text-center">
              <p className="font-semibold text-primary text-lg">Priya & Raj Sharma</p>
              <p className="text-gray-600">Bangalore</p>
            </div>
          </motion.div>
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
              Experience Excellence in Interior Design
            </h2>
            <p className="font-body text-xl text-white/90 mb-8">
              Join thousands of satisfied customers and transform your space with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-block bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Start Your Project
              </Link>
              <Link
                to="/how-it-works"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Learn How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default WhyUs
