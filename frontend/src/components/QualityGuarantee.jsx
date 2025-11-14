/**
 * QualityGuarantee Component
 *
 * Displays the quality guarantee section with DQA model
 * Matches the design from hoh108.com
 */

import { motion } from 'framer-motion'

const QualityGuarantee = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <>
      {/* Our Quality Guarantee Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800"
                alt="Quality Interior"
                className="w-full h-[600px] object-cover rounded-lg shadow-xl"
              />
              {/* Decorative blocks */}
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-[#b8956f] rounded-lg"></div>
              <div className="absolute -right-4 -bottom-12 w-16 h-16 bg-[#8b7355] rounded-lg"></div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="font-heading text-5xl md:text-6xl text-[#2c2420] mb-8">
                Our Quality
                <br />
                Guarantee
              </h2>
              <p className="font-body text-lg text-gray-700 leading-relaxed mb-6">
                At House of Hancet 108, we take immense pride in delivering unmatched quality. Our team is dedicated to upholding the highest standards of craftsmanship, design, and customer satisfaction. Every project is a testament to our commitment to creating homes that stand the test of time, both in terms of structural integrity and aesthetic excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DQA Section */}
      <section className="py-20 bg-[#4a3f38] text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=2000"
            alt="Luxury Interior"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* DQA Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
            <h2 className="font-heading text-5xl md:text-6xl mb-6">
              DQA
            </h2>
            <p className="font-subheading text-xl mb-2">(Design, Quality, Assure)</p>
            <p className="font-body text-lg max-w-3xl leading-relaxed">
              At the heart of House of Hancet 108 lies our proprietary DQA approach that redefines how homeowners experience transparency and accountability. DQA isn't just a process—it's a philosophy. Every aspect is broken down and transparent into a wholesome, data-driven framework designed to convert complexity into confidence at every milestone, informed and every outcome is aligned.
            </p>
          </motion.div>

          {/* DQA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Design Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white text-[#2c2420] p-8 rounded-lg"
            >
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#b8956f] rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
                </svg>
              </div>
              <h3 className="font-heading text-3xl mb-4">Design</h3>
              <p className="font-body leading-relaxed">
                We bring to life inspiring and functional designs that reflect your lifestyle, bringing timeless beauty, practical functionality and sophisticated style into complete harmony.
              </p>
            </motion.div>

            {/* Quality Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white text-[#2c2420] p-8 rounded-lg"
            >
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#b8956f] rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-3xl mb-4">Quality</h3>
              <p className="font-body leading-relaxed">
                We maintain and account for every material used. We use only premium grade finishes backed by warranties so your haven stays beautiful, driven, and fully under our commitment.
              </p>
            </motion.div>

            {/* Assure Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white text-[#2c2420] p-8 rounded-lg"
            >
              <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#b8956f] rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-heading text-3xl mb-4">Assure</h3>
              <p className="font-body leading-relaxed">
                Through milestone-based, verifiable accountability, DQA ensures complete project aligned transparency and quality delivery, ensuring you stay in full control and confident, making it all possible.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Build Together Section */}
      <section className="py-20 bg-[#3a3230] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="font-heading text-4xl md:text-5xl mb-6">
              Let's Build Something
              <br />
              Beautiful Together
            </h2>
            <p className="font-body text-lg mb-12 leading-relaxed">
              Whether you're dreaming of a custom-built home or a stunning interior makeover, we're here to turn your vision into reality. Reach out to us today, share your project details with us today, and let's embark on a journey to build a home that resonates with your lifestyle and aspirations.
            </p>
            <motion.a
              href="#estimate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-[#b8956f] text-white font-subheading text-lg px-12 py-4 rounded-lg hover:bg-[#a07d5a] transition-all duration-200"
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default QualityGuarantee
