/**
 * PrivacyPolicy Component
 *
 * Privacy Policy page with comprehensive information about data collection,
 * usage, and protection practices.
 */

import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information that you provide directly to us when using our services, including:

• Personal Information: Name, email address, phone number, and address
• Project Details: Information about your interior design requirements and preferences
• Payment Information: Billing details and transaction information
• Communication Data: Messages, queries, and feedback you share with us
• Technical Data: IP address, browser type, device information, and usage patterns`
    },
    {
      title: 'How We Use Your Information',
      content: `We use the collected information for the following purposes:

• To provide and improve our interior design services
• To communicate with you about your projects and inquiries
• To process payments and manage transactions
• To send updates, newsletters, and promotional materials (with your consent)
• To analyze and enhance user experience on our website
• To comply with legal obligations and resolve disputes`
    },
    {
      title: 'Information Sharing and Disclosure',
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

• Service Providers: With trusted vendors and contractors who assist in delivering our services
• Legal Requirements: When required by law or to protect our rights and safety
• Business Transfers: In connection with mergers, acquisitions, or asset sales
• With Your Consent: When you explicitly authorize us to share your information`
    },
    {
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
    },
    {
      title: 'Cookies and Tracking Technologies',
      content: `Our website uses cookies and similar technologies to enhance user experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings. Disabling cookies may affect website functionality.`
    },
    {
      title: 'Your Rights and Choices',
      content: `You have the right to:

• Access and review your personal information
• Correct or update inaccurate data
• Request deletion of your information (subject to legal requirements)
• Opt-out of marketing communications
• Withdraw consent for data processing
• Lodge a complaint with data protection authorities

To exercise these rights, please contact us at contact@hoh108.com`
    },
    {
      title: 'Children\'s Privacy',
      content: `Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.`
    },
    {
      title: 'Third-Party Links',
      content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.`
    },
    {
      title: 'Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on our website with a revised effective date.`
    },
    {
      title: 'Contact Us',
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

HOH 108
972, 8th Cross Rd, 1st Sector
HSR Layout, Bengaluru, Karnataka 560102
Email: contact@hoh108.com

Last Updated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`
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
              Privacy Policy
            </h1>
            <p className="font-body text-xl text-white/90 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
          >
            {/* Introduction */}
            <div className="mb-12">
              <p className="font-body text-gray-700 leading-relaxed mb-4">
                At HOH 108, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes how we collect, use, store, and disclose your information when you use our website and services.
              </p>
              <p className="font-body text-gray-700 leading-relaxed">
                By accessing or using our services, you agree to the terms of this Privacy Policy. If you do not agree with any part of this policy, please do not use our services.
              </p>
            </div>

            {/* Policy Sections */}
            <div className="space-y-10">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h2 className="font-heading text-2xl text-primary mb-4">
                    {section.title}
                  </h2>
                  <div className="font-body text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="font-body text-sm text-gray-600 text-center">
                This Privacy Policy is governed by the laws of India. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy
