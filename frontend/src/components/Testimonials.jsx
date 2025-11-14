/**
 * Testimonials Component
 *
 * Carousel/slider displaying client testimonials and reviews.
 *
 * Design Features:
 * - Light grey background cards with navy text
 * - Warm tan rating stars
 * - Smooth slide animations
 * - Auto-play with manual controls
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Testimonials data
const testimonialsData = [
  {
    id: 1,
    name: 'Priya Sharma',
    rating: 5,
    text: 'Working with HOH 108 was an absolute pleasure. They transformed our living room into a stunning space that perfectly reflects our style. The attention to detail and professionalism was outstanding.',
    project: 'Living Room Renovation',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    rating: 5,
    text: 'I was impressed by their creative vision and ability to work within our budget. The team was responsive, professional, and delivered beyond our expectations. Highly recommend!',
    project: 'Office Redesign',
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    rating: 5,
    text: 'From concept to completion, the entire process was seamless. They listened to our needs and created a beautiful, functional kitchen that we absolutely love. Worth every penny!',
    project: 'Kitchen Remodel',
  },
  {
    id: 4,
    name: 'Vikram Patel',
    rating: 5,
    text: 'The designers at HOH 108 are true professionals. They turned our dated bedroom into a luxurious retreat. The quality of work and materials used exceeded our expectations.',
    project: 'Master Bedroom Suite',
  },
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-accent' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  if (testimonialsData.length === 0) {
    return null
  }

  const currentTestimonial = testimonialsData[currentIndex]

  // Safety check
  if (!currentTestimonial) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-primary mb-4">
            What Our Clients Say
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 md:p-12 rounded-2xl shadow-lg"
              >
                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  {renderStars(currentTestimonial.rating || 5)}
                </div>

                {/* Testimonial Text */}
                <blockquote className="font-body text-lg text-gray-700 text-center mb-8 leading-relaxed">
                  "{currentTestimonial.text}"
                </blockquote>

                {/* Client Info */}
                <div className="text-center">
                  <h4 className="font-subheading text-xl text-primary mb-1">
                    {currentTestimonial.name}
                  </h4>
                  <p className="font-body text-accent text-sm">
                    {currentTestimonial.project}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white p-3 rounded-full shadow-lg hover:bg-accent hover:text-white transition-all duration-200 group"
          >
            <svg
              className="w-6 h-6 text-primary group-hover:text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white p-3 rounded-full shadow-lg hover:bg-accent hover:text-white transition-all duration-200 group"
          >
            <svg
              className="w-6 h-6 text-primary group-hover:text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-accent w-8'
                    : 'bg-support hover:bg-accent hover:bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
