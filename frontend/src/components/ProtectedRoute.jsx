/**
 * ProtectedRoute Component
 *
 * Wrapper component that protects routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 */

import { Navigate } from 'react-router-dom'
import { auth } from '../services/api'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = auth.isAuthenticated()

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />
  }

  // Render the protected component if authenticated
  return children
}

export default ProtectedRoute
