// API Configuration
// Change this to your backend URL when deploying
export const API_URL = 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/api/auth/login`,
  LOGOUT: `${API_URL}/api/auth/logout`,

  // Provider
  PROVIDER_PROFILE: `${API_URL}/api/on-demand/providers/profile`,
  PROVIDER_BOOKINGS: `${API_URL}/api/on-demand/providers/my-bookings`,

  // Bookings
  BOOKING_UPDATE_STATUS: (id) => `${API_URL}/api/on-demand/bookings/${id}/status`,
  BOOKING_DETAILS: (id) => `${API_URL}/api/on-demand/bookings/${id}`,
  REQUEST_COMPLETION_OTP: (id) => `${API_URL}/api/on-demand/bookings/${id}/request-completion-otp`,
  VERIFY_COMPLETION_OTP: (id) => `${API_URL}/api/on-demand/bookings/${id}/verify-completion-otp`,

  // On-Demand Services
  ODS_SERVICES: `${API_URL}/api/on-demand/services`,
};
