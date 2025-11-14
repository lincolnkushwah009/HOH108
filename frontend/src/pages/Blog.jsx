/**
 * Blog Page Component
 *
 * Beautiful blog listing page with interior design articles, tips, and inspiration.
 *
 * Design Features:
 * - Stunning card animations with hover effects
 * - Parallax scroll effects
 * - Category filtering with smooth transitions
 * - Featured post section with gradient overlay
 * - Masonry-style grid layout
 * - Search functionality
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { API_ENDPOINTS } from '../config/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Fallback demo blog posts data (if API fails)
const demoBlogPosts = [
  {
    id: 1,
    title: '10 Modern Living Room Design Trends for 2024',
    excerpt: 'Discover the latest trends in modern living room design, from minimalist aesthetics to bold statement pieces that transform your space.',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200',
    category: 'Design Trends',
    author: 'Priya Sharma',
    date: 'March 15, 2024',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Kitchen Remodeling',
    excerpt: 'Planning a kitchen renovation? Our comprehensive guide covers everything from layout planning to choosing the perfect materials.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1200',
    category: 'Renovation',
    author: 'Arjun Mehta',
    date: 'March 10, 2024',
    readTime: '8 min read',
    featured: false,
  },
  {
    id: 3,
    title: 'Color Psychology in Interior Design',
    excerpt: 'Learn how different colors affect mood and atmosphere, and how to choose the perfect palette for each room in your home.',
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1200',
    category: 'Tips & Tricks',
    author: 'Kavya Reddy',
    date: 'March 5, 2024',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 4,
    title: 'Sustainable Interior Design: Eco-Friendly Choices',
    excerpt: 'Explore sustainable materials, energy-efficient solutions, and eco-friendly practices for creating beautiful, environmentally conscious spaces.',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200',
    category: 'Sustainability',
    author: 'Rohan Kapoor',
    date: 'February 28, 2024',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: 5,
    title: 'Small Space Solutions: Maximizing Your Home',
    excerpt: 'Smart design strategies and clever storage solutions to make the most of compact living spaces without sacrificing style.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200',
    category: 'Tips & Tricks',
    author: 'Sneha Patel',
    date: 'February 20, 2024',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 6,
    title: 'Luxury Bedroom Design: Creating Your Dream Retreat',
    excerpt: 'Transform your bedroom into a luxurious sanctuary with these expert tips on lighting, textures, and sophisticated design elements.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200',
    category: 'Design Trends',
    author: 'Vikram Singh',
    date: 'February 15, 2024',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 7,
    title: 'Smart Home Integration in Modern Design',
    excerpt: 'Seamlessly blend technology with aesthetics. Discover how to integrate smart home features while maintaining beautiful design.',
    image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?q=80&w=1200',
    category: 'Technology',
    author: 'Aisha Khan',
    date: 'February 10, 2024',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: 8,
    title: 'Vastu Shastra Tips for Home Interiors',
    excerpt: 'How to incorporate traditional Vastu principles into modern interior design for positive energy and harmony in your home.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200',
    category: 'Tips & Tricks',
    author: 'Rajesh Kumar',
    date: 'February 5, 2024',
    readTime: '8 min read',
    featured: false,
  },
  {
    id: 9,
    title: 'Bathroom Spa Design: Luxury at Home',
    excerpt: 'Create a spa-like experience in your own bathroom with these design ideas featuring natural materials and calming aesthetics.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200',
    category: 'Renovation',
    author: 'Ananya Iyer',
    date: 'January 30, 2024',
    readTime: '5 min read',
    featured: false,
  },
]

const categories = ['All', 'Design Trends', 'Renovation', 'Tips & Tricks', 'Sustainability', 'Technology', 'Commercial']

const Blog = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.BLOGS)
        const data = await response.json()

        if (data.success && data.data) {
          // Format the API data to match our component structure
          const formattedBlogs = data.data.map(blog => ({
            id: blog._id,
            title: blog.title,
            excerpt: blog.excerpt,
            image: blog.image,
            category: blog.category,
            author: blog.author,
            date: new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            readTime: blog.readTime,
            featured: blog.featured
          }))
          setBlogPosts(formattedBlogs)
        } else {
          // Use demo data if API fails
          setBlogPosts(demoBlogPosts)
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
        // Use demo data if API fails
        setBlogPosts(demoBlogPosts)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`)
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Interior Design Blog | Tips, Trends & Inspiration | HOH 108</title>
        <meta name="title" content="Interior Design Blog | Tips, Trends & Inspiration | HOH 108" />
        <meta
          name="description"
          content="Explore expert interior design tips, latest trends, renovation guides, and creative inspiration. Get professional advice on home decor, modular kitchens, and commercial spaces."
        />
        <meta
          name="keywords"
          content="interior design blog, home decor tips, design trends 2024, renovation guide, modular kitchen ideas, commercial interior design, sustainable design, smart home integration"
        />
        <meta name="author" content="HOH 108" />
        <link rel="canonical" href="https://hoh108.com/blog" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hoh108.com/blog" />
        <meta property="og:title" content="Interior Design Blog | Tips, Trends & Inspiration | HOH 108" />
        <meta
          property="og:description"
          content="Explore expert interior design tips, latest trends, renovation guides, and creative inspiration from HOH 108."
        />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200"
        />
        <meta property="og:site_name" content="HOH 108" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hoh108.com/blog" />
        <meta property="twitter:title" content="Interior Design Blog | Tips, Trends & Inspiration" />
        <meta
          property="twitter:description"
          content="Explore expert interior design tips, latest trends, renovation guides, and creative inspiration."
        />
        <meta
          property="twitter:image"
          content="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200"
        />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

        {/* Structured Data - Blog */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "HOH 108 Blog",
            "description": "Expert interior design tips, trends, and inspiration",
            "url": "https://hoh108.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "HOH 108",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hoh108.com/logo.png"
              }
            },
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "image": post.image,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "datePublished": post.date,
              "url": `https://hoh108.com/blog/${post.id}`
            }))
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-20 overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="w-full h-full"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl mb-6">
              Design Insights & Inspiration
            </h1>
            <p className="font-body text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Expert tips, latest trends, and creative ideas to transform your space
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 rounded-2xl font-body text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent shadow-xl"
                />
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-subheading text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="font-heading text-3xl text-primary mb-8 flex items-center gap-3">
              <span className="bg-accent text-white px-4 py-1 rounded-full text-sm">Featured</span>
              Editor's Pick
            </h2>
            <motion.div
              whileHover={{ y: -10 }}
              onClick={() => handlePostClick(featuredPost.id)}
              className="group relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer h-[500px]"
            >
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block bg-accent text-white px-4 py-1 rounded-full text-sm font-subheading mb-4">
                    {featuredPost.category}
                  </span>
                  <h3 className="font-heading text-4xl md:text-5xl text-white mb-4 group-hover:text-accent transition-colors duration-300">
                    {featuredPost.title}
                  </h3>
                  <p className="font-body text-lg text-white/90 mb-6 max-w-3xl">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-white/80 font-body text-sm">
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchTerm}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {regularPosts.length > 0 ? (
              regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={cardVariants}
                  whileHover={{ y: -15, scale: 1.02 }}
                  onClick={() => handlePostClick(post.id)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-56">
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <motion.span
                      initial={{ x: -100 }}
                      animate={{ x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-subheading"
                    >
                      {post.category}
                    </motion.span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-subheading text-xl text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="font-body text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 font-body">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="text-xs text-gray-400 font-body mt-2">
                      {post.date}
                    </div>

                    {/* Read More Arrow */}
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      className="mt-4 flex items-center gap-2 text-accent font-subheading text-sm"
                    >
                      Read More
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <svg
                  className="w-20 h-20 mx-auto text-gray-300 mb-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-body text-xl text-gray-500">No articles found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All')
                    setSearchTerm('')
                  }}
                  className="mt-6 px-6 py-3 bg-accent text-white rounded-full font-subheading hover:bg-accent/90 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-primary to-primary/90 text-white py-20 mt-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-4xl sm:text-5xl mb-6"
          >
            Stay Inspired
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-xl text-white/90 mb-8"
          >
            Get the latest design trends, tips, and inspiration delivered to your inbox
          </motion.p>
          <motion.form
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-2xl font-body text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-accent text-white px-8 py-4 rounded-2xl font-subheading text-lg hover:bg-accent/90 transition-colors shadow-lg"
            >
              Subscribe
            </motion.button>
          </motion.form>
        </div>
      </motion.section>
      </div>
      <Footer />
    </>
  )
}

export default Blog
