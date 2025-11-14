/**
 * Admin Blog Management Page
 *
 * Complete CRUD interface for managing blog posts
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../components/AdminLayout'
import { API_ENDPOINTS } from '../config/api'

const categories = ['Design Trends', 'Renovation', 'Tips & Tricks', 'Sustainability', 'Technology', 'Commercial']

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [publishFilter, setPublishFilter] = useState('all')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'Design Trends',
    author: '',
    authorImage: 'https://i.pravatar.cc/150?img=1',
    authorBio: '',
    readTime: '5 min read',
    featured: false,
    tags: '',
    published: false
  })

  useEffect(() => {
    fetchBlogs()
    fetchStats()
  }, [categoryFilter, searchTerm, publishFilter])

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token')
      let url = `${API_ENDPOINTS.BLOGS}/admin/all?`

      if (categoryFilter !== 'All') url += `category=${categoryFilter}&`
      if (searchTerm) url += `search=${searchTerm}&`
      if (publishFilter !== 'all') url += `published=${publishFilter === 'published'}&`

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        setBlogs(data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.BLOGS}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)

      const blogData = {
        ...formData,
        tags: tagsArray
      }

      const url = selectedBlog
        ? `${API_ENDPOINTS.BLOGS}/admin/${selectedBlog._id}`
        : `${API_ENDPOINTS.BLOGS}/admin/create`

      const method = selectedBlog ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        setShowAddModal(false)
        setShowEditModal(false)
        resetForm()
        fetchBlogs()
        fetchStats()
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Failed to save blog')
    }
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.BLOGS}/admin/${selectedBlog._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        setShowDeleteModal(false)
        setSelectedBlog(null)
        fetchBlogs()
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog')
    }
  }

  const togglePublish = async (blog) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ENDPOINTS.BLOGS}/admin/${blog._id}/toggle-publish`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()

      if (data.success) {
        fetchBlogs()
        fetchStats()
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      category: 'Design Trends',
      author: '',
      authorImage: 'https://i.pravatar.cc/150?img=1',
      authorBio: '',
      readTime: '5 min read',
      featured: false,
      tags: '',
      published: false
    })
    setSelectedBlog(null)
  }

  const openEditModal = (blog) => {
    setSelectedBlog(blog)
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      author: blog.author,
      authorImage: blog.authorImage,
      authorBio: blog.authorBio,
      readTime: blog.readTime,
      featured: blog.featured,
      tags: blog.tags.join(', '),
      published: blog.published
    })
    setShowEditModal(true)
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading text-primary mb-2">Blog Management</h1>
            <p className="text-sm sm:text-base text-gray-600 font-body">Manage your blog posts and articles</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="mt-4 md:mt-0 bg-accent text-white px-6 py-3 rounded-lg font-subheading hover:bg-accent/90 transition-colors"
          >
            + Add New Blog
          </motion.button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 font-body text-sm mb-2">Total Blogs</h3>
              <p className="text-3xl font-heading text-primary">{stats.totalBlogs}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 font-body text-sm mb-2">Published</h3>
              <p className="text-3xl font-heading text-green-600">{stats.publishedBlogs}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 font-body text-sm mb-2">Drafts</h3>
              <p className="text-3xl font-heading text-yellow-600">{stats.draftBlogs}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 font-body text-sm mb-2">Featured</h3>
              <p className="text-3xl font-heading text-accent">{stats.featuredBlogs}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-gray-500 font-body text-sm mb-2">Total Views</h3>
              <p className="text-3xl font-heading text-blue-600">{stats.totalViews}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={publishFilter}
              onChange={(e) => setPublishFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-subheading text-gray-600 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-subheading text-gray-600 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-subheading text-gray-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-subheading text-gray-600 uppercase">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-subheading text-gray-600 uppercase">Views</th>
                  <th className="px-4 py-3 text-left text-xs font-subheading text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-subheading text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500 font-body">
                      Loading...
                    </td>
                  </tr>
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500 font-body">
                      No blogs found
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img src={blog.image} alt={blog.title} className="w-16 h-16 object-cover rounded-lg" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-body text-gray-900 max-w-xs truncate">{blog.title}</div>
                        {blog.featured && (
                          <span className="inline-block bg-accent text-white text-xs px-2 py-1 rounded mt-1">Featured</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-body text-gray-600">{blog.category}</td>
                      <td className="px-4 py-3 font-body text-gray-600">{blog.author}</td>
                      <td className="px-4 py-3 font-body text-gray-600">{blog.views}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePublish(blog)}
                          className={`px-3 py-1 rounded-full text-xs font-body ${
                            blog.published
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          {blog.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBlog(blog)
                              setShowViewModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 font-body text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(blog)}
                            className="text-accent hover:text-accent/80 font-body text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBlog(blog)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-800 font-body text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {(showAddModal || showEditModal) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-heading text-primary mb-6">
                  {showEditModal ? 'Edit Blog' : 'Add New Blog'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body text-gray-700 mb-2">Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body text-gray-700 mb-2">Excerpt *</label>
                    <textarea
                      required
                      rows="2"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body text-gray-700 mb-2">Content (HTML) *</label>
                    <textarea
                      required
                      rows="10"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body font-mono text-sm"
                      placeholder="<p>Your content here...</p>"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body text-gray-700 mb-2">Image URL *</label>
                      <input
                        type="url"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body text-gray-700 mb-2">Author *</label>
                      <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body text-gray-700 mb-2">Author Image URL</label>
                      <input
                        type="url"
                        value={formData.authorImage}
                        onChange={(e) => setFormData({...formData, authorImage: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body text-gray-700 mb-2">Read Time</label>
                      <input
                        type="text"
                        value={formData.readTime}
                        onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body text-gray-700 mb-2">Author Bio</label>
                    <textarea
                      rows="2"
                      value={formData.authorBio}
                      onChange={(e) => setFormData({...formData, authorBio: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body text-gray-700 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="design trends, modern, 2024"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-body"
                    />
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="w-4 h-4 text-accent focus:ring-accent rounded"
                      />
                      <span className="font-body text-gray-700">Featured</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({...formData, published: e.target.checked})}
                        className="w-4 h-4 text-accent focus:ring-accent rounded"
                      />
                      <span className="font-body text-gray-700">Published</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-accent text-white px-6 py-3 rounded-lg font-subheading hover:bg-accent/90 transition-colors"
                    >
                      {showEditModal ? 'Update Blog' : 'Create Blog'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false)
                        setShowEditModal(false)
                        resetForm()
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-subheading hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* View Modal */}
        <AnimatePresence>
          {showViewModal && selectedBlog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-heading text-primary mb-4">{selectedBlog.title}</h2>
                <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-64 object-cover rounded-lg mb-4" />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-body">{selectedBlog.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-body">{selectedBlog.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="font-body">{selectedBlog.views}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-body">{selectedBlog.published ? 'Published' : 'Draft'}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Excerpt</p>
                  <p className="font-body text-gray-700">{selectedBlog.excerpt}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-body">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-subheading hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Modal */}
        <AnimatePresence>
          {showDeleteModal && selectedBlog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <h2 className="text-2xl font-heading text-primary mb-4">Delete Blog</h2>
                <p className="font-body text-gray-700 mb-6">
                  Are you sure you want to delete "{selectedBlog.title}"? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-subheading hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setSelectedBlog(null)
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-subheading hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

export default AdminBlogs
