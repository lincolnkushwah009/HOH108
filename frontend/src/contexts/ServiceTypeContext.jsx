/**
 * Service Type Context
 *
 * Provides service type state management across the admin dashboard
 * Allows super_admin to switch between different service types
 */

import { createContext, useContext, useState, useEffect } from 'react'

const ServiceTypeContext = createContext()

export const useServiceType = () => {
  const context = useContext(ServiceTypeContext)
  if (!context) {
    throw new Error('useServiceType must be used within a ServiceTypeProvider')
  }
  return context
}

export const ServiceTypeProvider = ({ children }) => {
  // Get user info to determine if they're super admin
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
  const isSuperAdmin = userInfo.role === 'super_admin'

  // Initialize with default service type
  const [selectedServiceType, setSelectedServiceType] = useState(() => {
    // For super admin, use localStorage or default to 'interior'
    if (isSuperAdmin) {
      return localStorage.getItem('selectedServiceType') || 'interior'
    }
    // For regular admin, use their assigned service type
    return userInfo.serviceType || 'interior'
  })

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (isSuperAdmin) {
      localStorage.setItem('selectedServiceType', selectedServiceType)
    }
  }, [selectedServiceType, isSuperAdmin])

  const value = {
    selectedServiceType,
    setSelectedServiceType,
    isSuperAdmin
  }

  return (
    <ServiceTypeContext.Provider value={value}>
      {children}
    </ServiceTypeContext.Provider>
  )
}
