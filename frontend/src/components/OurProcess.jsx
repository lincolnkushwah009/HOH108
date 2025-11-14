/**
 * OurProcess Component
 *
 * Displays the step-by-step process with images and descriptions
 * Matches the design from hoh108.com
 */

import { motion } from 'framer-motion'

const OurProcess = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section className="py-20 bg-[#f5f1ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16"
        >
          <h2 className="font-heading text-5xl md:text-6xl text-[#2c2420] mb-8">
            Our Process
          </h2>
          <p className="font-body text-lg text-gray-700 max-w-3xl leading-relaxed">
            At House of Hancet 108, our process is seamless and transparent. We believe in open communication and collaboration at every step of the project, ensuring that your vision is brought to life with precision and care. From the initial consultation to the final handover, we partner with you to create a design experience that is smooth, predictable, and enjoyable. Our on-site coordinators facilitate decision-making, ensuring your vision is realized with precision. Enjoy peace of mind through milestone-based payments that give you control and confidence at every step.
          </p>
        </motion.div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Step 1: Pre-Construction Design */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-[#b8956f] p-8 rounded-lg text-white"
          >
            <h3 className="font-heading text-3xl mb-4">PRE-CONSTRUCTION DESIGN</h3>
            <p className="font-body leading-relaxed">
              We're here with you right from the planning stage. Bringing unique ideas that stands out by understanding how you live, function and breathe. We sketch floor plans, play with materials (and offer moodboards) incorporating planning that suits lifestyle needs to create a space that feels both individually and aspirational.
            </p>
          </motion.div>

          {/* Step 2: Design & Construction Estimate */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800"
              alt="Design Planning"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <div className="absolute bottom-0 right-0 bg-[#b8956f] p-6 rounded-tl-lg max-w-md">
              <h3 className="font-heading text-2xl text-white mb-3">
                DESIGN & CONSTRUCTION ESTIMATE
              </h3>
              <p className="font-body text-white text-sm leading-relaxed">
                Our detailed design and construction estimate goes far beyond just numbers. It's a comprehensive breakdown of everything in your project – materials, labor, timelines, and costs – before we complete transparency, ensuring that your vision is routed with precision and your budget stays predictable.
              </p>
            </div>
          </motion.div>

          {/* Step 3: On-Site Consultations */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=800"
              alt="On-Site Consultation"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Step 4: The Finishing Touches */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-[#b8956f] p-8 rounded-lg text-white"
          >
            <h3 className="font-heading text-3xl mb-4">THE FINISHING TOUCHES</h3>
            <p className="font-body leading-relaxed">
              The final touches are where your home truly transitions into a reflection of your style and personality. We guide you through every detail, from paint color decisions and custom fittings to the placements of fixtures and finishes. Our consultants work with you to ensure no corner of the home is missed – integrating elegant, timeless, and thoughtfully design elements that bring the perfect harmony to every space.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default OurProcess
