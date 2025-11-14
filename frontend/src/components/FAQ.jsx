/**
 * FAQ Component
 *
 * Accordion-style FAQ section addressing common customer questions
 * Similar to HomeLane's comprehensive FAQ about process, timeline, and customization
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqs = [
    {
      question: 'What is the typical timeline for completing an interior design project?',
      answer: 'Our standard timeline is 45 days from design approval to final installation. This includes manufacturing, quality checks, and professional installation. The timeline may vary based on project scope and customization requirements.'
    },
    {
      question: 'Do you provide a warranty on your work?',
      answer: 'Yes, we offer a comprehensive 10-year warranty on all our modular products including kitchen cabinets, wardrobes, and furniture. This covers manufacturing defects and material quality issues.'
    },
    {
      question: 'Can I customize the designs shown in your portfolio?',
      answer: 'Absolutely! All our designs are fully customizable. Our expert designers work with you to understand your preferences, space requirements, and budget to create personalized solutions that match your vision.'
    },
    {
      question: 'What is your payment structure?',
      answer: 'We follow a milestone-based payment structure for transparency: 10% booking, 30% on design approval, 30% on production start, 20% on installation, and 10% final payment after handover. This ensures you pay as the project progresses.'
    },
    {
      question: 'Do you provide 3D design visualization?',
      answer: 'Yes, we provide detailed 3D visualizations of your space before starting any work. This helps you see exactly how your interiors will look and allows for any modifications before production begins.'
    },
    {
      question: 'What materials and finishes do you use?',
      answer: 'We use premium quality materials including marine-grade plywood, MDF boards, and high-pressure laminates. We offer a wide range of finishes including matte, glossy, wood grain, and solid colors. Hardware is sourced from European brands for durability.'
    },
    {
      question: 'Do you handle structural changes and civil work?',
      answer: 'Yes, we provide end-to-end services including civil work, electrical installations, plumbing, false ceiling, flooring, and painting. Our team coordinates all aspects of your interior project.'
    },
    {
      question: 'How do I track my project progress?',
      answer: 'We provide real-time project tracking through our online portal and dedicated project manager. You will receive regular updates at each milestone with photos and timelines.'
    },
    {
      question: 'What if I am not satisfied with the final result?',
      answer: 'Customer satisfaction is our priority. We conduct a thorough walkthrough before final handover and address any concerns immediately. Our warranty covers any manufacturing or installation issues that may arise.'
    },
    {
      question: 'Do you offer financing options?',
      answer: 'Yes, we partner with leading financial institutions to offer flexible EMI options and home improvement loans to make your dream interiors more affordable.'
    }
  ]

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-lg text-gray-600">
            Find answers to common questions about our services, process, and policies
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="font-subheading text-primary text-base md:text-lg pr-8">
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-6 h-6 text-accent flex-shrink-0"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 font-body text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="font-body text-gray-600 mb-6">
            Still have questions? Our team is here to help!
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-accent text-primary font-subheading text-lg px-8 py-4 rounded-2xl hover:bg-opacity-90 transition-all duration-200"
          >
            Contact Us
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
