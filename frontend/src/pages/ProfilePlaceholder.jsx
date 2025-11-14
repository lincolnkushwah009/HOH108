/**
 * ProfilePlaceholder Page Component
 *
 * Generic placeholder page for profile sections.
 * Used for pages not yet fully implemented.
 */

import { motion } from 'framer-motion'
import ProfileLayout from '../components/ProfileLayout'

const ProfilePlaceholder = ({ title, breadcrumb, description, icon }) => {
  return (
    <ProfileLayout>
      <div className="bg-white rounded-2xl shadow-md p-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-sm font-body text-gray-600 mb-2">
              <span>My Account</span>
              <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-red-600 font-semibold">{breadcrumb || title}</span>
            </div>
            <h1 className="font-heading text-3xl text-primary">
              {title}
            </h1>
          </div>
        </div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          {icon || (
            <svg className="w-32 h-32 text-gray-300 mb-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          )}
          <h3 className="font-subheading text-2xl text-primary mb-2">
            Coming Soon
          </h3>
          <p className="font-body text-gray-600 mb-8 text-center max-w-md">
            {description || 'This feature is under development and will be available soon.'}
          </p>
        </motion.div>
      </div>
    </ProfileLayout>
  )
}

export default ProfilePlaceholder
