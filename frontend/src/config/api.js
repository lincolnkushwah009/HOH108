/**
 * API Configuration
 * Centralized API URL management
 */

import { config } from './environment';

// Get API URL from centralized environment config
export const API_URL = config.API_URL;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: `${API_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_URL}/api/auth/register`,
  AUTH_ME: `${API_URL}/api/auth/me`,

  // Admin Dashboard
  DASHBOARD_STATS: `${API_URL}/api/admin/dashboard/stats`,
  DASHBOARD_ACTIVITIES: `${API_URL}/api/admin/dashboard/recent-activities`,

  // Leads - Public
  LEADS_PUBLIC: `${API_URL}/api/leads`, // Public endpoint for lead submissions

  // Leads - Admin
  LEADS: `${API_URL}/api/admin/leads`,
  LEADS_STATS: `${API_URL}/api/admin/leads/stats`,
  LEAD_BY_ID: (id) => `${API_URL}/api/admin/leads/${id}`,

  // Projects
  PROJECTS: `${API_URL}/api/admin/projects`,
  PROJECT_BY_ID: (id) => `${API_URL}/api/admin/projects/${id}`,

  // Employees
  EMPLOYEES: `${API_URL}/api/admin/employees`,
  EMPLOYEE_BY_ID: (id) => `${API_URL}/api/admin/employees/${id}`,

  // Customers
  CUSTOMERS: `${API_URL}/api/admin/customers`,
  CUSTOMERS_STATS: `${API_URL}/api/admin/customers/stats`,
  CUSTOMER_BY_ID: (id) => `${API_URL}/api/admin/customers/${id}`,
  CUSTOMER_ASSIGN_CRM: (id) => `${API_URL}/api/admin/customers/${id}/assign-crm`,
  CUSTOMER_ASSIGN_DESIGNER: (id) => `${API_URL}/api/admin/customers/${id}/assign-designer`,

  // Users
  USER_CHANGE_PASSWORD: (id) => `${API_URL}/api/admin/users/${id}/change-password`,
  USER_PROJECTS: `${API_URL}/api/user/projects`,

  // Designs
  DESIGNS_BY_PROJECT: (projectId) => `${API_URL}/api/admin/designs/${projectId}`,

  // Contact
  CONTACT: `${API_URL}/api/contact`,

  // Estimate
  ESTIMATE: `${API_URL}/api/estimate`,

  // Blogs
  BLOGS: `${API_URL}/api/blogs`,
  BLOG_BY_ID: (id) => `${API_URL}/api/blogs/${id}`,

  // KYC
  KYC_UPLOAD: `${API_URL}/api/kyc/upload`,
  KYC_STATUS: `${API_URL}/api/kyc/status`,
  KYC_DELETE_DOCUMENT: (documentId) => `${API_URL}/api/kyc/document/${documentId}`,
  KYC_PENDING: `${API_URL}/api/kyc/pending`,
  KYC_ALL: `${API_URL}/api/kyc/all`,
  KYC_CUSTOMER: (userId) => `${API_URL}/api/kyc/customer/${userId}`,
  KYC_VERIFY: (userId) => `${API_URL}/api/kyc/verify/${userId}`,
  KYC_REJECT: (userId) => `${API_URL}/api/kyc/reject/${userId}`,

  // Payments/Collections
  PAYMENTS: `${API_URL}/api/admin/payments`,
  PAYMENT_STATS: `${API_URL}/api/admin/payments/stats`,
  OVERDUE_PAYMENTS: `${API_URL}/api/admin/payments/overdue`,
  EXPORT_PAYMENTS: `${API_URL}/api/admin/payments/export`,
  PAYMENT_BY_ID: (id) => `${API_URL}/api/admin/payments/${id}`,
  MARK_PAYMENT_PAID: (id) => `${API_URL}/api/admin/payments/${id}/mark-paid`,

  // Renovation Services - Public
  RENOVATION_SERVICES: `${API_URL}/api/renovation-services`,
  RENOVATION_SERVICE_BY_ID: (id) => `${API_URL}/api/renovation-services/${id}`,

  // Renovation Services - Admin
  RENOVATION_SERVICES_ADMIN: `${API_URL}/api/renovation-services/admin/all`,
  RENOVATION_SERVICES_STATS: `${API_URL}/api/renovation-services/admin/stats`,
  RENOVATION_SERVICE_CREATE: `${API_URL}/api/renovation-services/admin`,
  RENOVATION_SERVICE_UPDATE: (id) => `${API_URL}/api/renovation-services/admin/${id}`,
  RENOVATION_SERVICE_DELETE: (id) => `${API_URL}/api/renovation-services/admin/${id}`,
  RENOVATION_SERVICE_TOGGLE_ACTIVE: (id) => `${API_URL}/api/renovation-services/admin/${id}/toggle-active`,
  RENOVATION_SERVICE_TOGGLE_POPULAR: (id) => `${API_URL}/api/renovation-services/admin/${id}/toggle-popular`,

  // Renovation Bookings - Public
  RENOVATION_BOOKING_CREATE: `${API_URL}/api/renovation-bookings`,
  RENOVATION_BOOKING_BY_ID: (id) => `${API_URL}/api/renovation-bookings/${id}`,

  // Renovation Bookings - Admin
  RENOVATION_BOOKINGS_ADMIN: `${API_URL}/api/renovation-bookings/admin/all`,
  RENOVATION_BOOKINGS_STATS: `${API_URL}/api/renovation-bookings/admin/stats`,
  RENOVATION_BOOKING_UPDATE: (id) => `${API_URL}/api/renovation-bookings/admin/${id}`,

  // On-Demand Services - Public
  ON_DEMAND_SERVICES: `${API_URL}/api/on-demand/services`,
  ON_DEMAND_SERVICE_BY_ID: (id) => `${API_URL}/api/on-demand/services/${id}`,
  ON_DEMAND_SERVICES_POPULAR: `${API_URL}/api/on-demand/services/popular`,
  ON_DEMAND_SERVICES_CATEGORIES: `${API_URL}/api/on-demand/services/categories`,
  ON_DEMAND_SERVICES_BY_CATEGORY: (category) => `${API_URL}/api/on-demand/services/category/${category}`,

  // On-Demand Services - Admin
  ON_DEMAND_SERVICES_STATS: `${API_URL}/api/on-demand/services/admin/stats`,
  ON_DEMAND_SERVICE_CREATE: `${API_URL}/api/on-demand/services`,
  ON_DEMAND_SERVICE_UPDATE: (id) => `${API_URL}/api/on-demand/services/${id}`,
  ON_DEMAND_SERVICE_DELETE: (id) => `${API_URL}/api/on-demand/services/${id}`,

  // Service Providers - Public
  PROVIDERS_AVAILABLE: (serviceId) => `${API_URL}/api/admin/on-demand/providers/available/${serviceId}`,

  // Service Providers - Admin
  SERVICE_PROVIDERS: `${API_URL}/api/admin/on-demand/providers`,
  SERVICE_PROVIDER_BY_ID: (id) => `${API_URL}/api/admin/on-demand/providers/${id}`,
  SERVICE_PROVIDER_STATS: `${API_URL}/api/admin/on-demand/providers/stats`,
  SERVICE_PROVIDER_CREATE: `${API_URL}/api/admin/on-demand/providers`,
  SERVICE_PROVIDER_UPDATE: (id) => `${API_URL}/api/admin/on-demand/providers/${id}`,
  SERVICE_PROVIDER_DELETE: (id) => `${API_URL}/api/admin/on-demand/providers/${id}`,
  SERVICE_PROVIDER_UPDATE_STATUS: (id) => `${API_URL}/api/admin/on-demand/providers/${id}/status`,
  SERVICE_PROVIDER_VERIFY_DOCS: (id) => `${API_URL}/api/admin/on-demand/providers/${id}/verify-documents`,
  SERVICE_PROVIDER_UPDATE_AVAILABILITY: (id) => `${API_URL}/api/admin/on-demand/providers/${id}/availability`,

  // On-Demand Bookings - Public
  ON_DEMAND_BOOKING_CREATE: `${API_URL}/api/on-demand/bookings/create`,
  ON_DEMAND_BOOKING_TRACK: `${API_URL}/api/on-demand/bookings/track`,
  ON_DEMAND_BOOKING_VERIFY_OTP: (id) => `${API_URL}/api/on-demand/bookings/${id}/verify-otp`,
  ON_DEMAND_MY_BOOKINGS: `${API_URL}/api/on-demand/bookings/my-bookings`,

  // On-Demand Bookings - Protected
  ON_DEMAND_BOOKINGS: `${API_URL}/api/on-demand/bookings`,
  ON_DEMAND_BOOKING_BY_ID: (id) => `${API_URL}/api/on-demand/bookings/${id}`,
  ON_DEMAND_BOOKING_UPDATE: (id) => `${API_URL}/api/on-demand/bookings/${id}`,
  ON_DEMAND_BOOKING_UPDATE_STATUS: (id) => `${API_URL}/api/on-demand/bookings/${id}/status`,
  ON_DEMAND_BOOKING_ASSIGN_PROVIDER: (id) => `${API_URL}/api/on-demand/bookings/${id}/assign-provider`,
  ON_DEMAND_BOOKING_ADD_RATING: (id) => `${API_URL}/api/on-demand/bookings/${id}/rating`,
  ON_DEMAND_BOOKING_RESCHEDULE: (id) => `${API_URL}/api/on-demand/bookings/${id}/reschedule`,
  ON_DEMAND_BOOKINGS_STATS: `${API_URL}/api/on-demand/bookings/stats/overview`,
  ON_DEMAND_PROVIDER_BOOKINGS: (providerId) => `${API_URL}/api/on-demand/bookings/provider/${providerId}`,
  RENOVATION_BOOKING_UPDATE_STATUS: (id) => `${API_URL}/api/renovation-bookings/admin/${id}/status`,
  RENOVATION_BOOKING_ASSIGN: (id) => `${API_URL}/api/renovation-bookings/admin/${id}/assign`,
  RENOVATION_BOOKING_SEND_QUOTATION: (id) => `${API_URL}/api/renovation-bookings/admin/${id}/quotation`,
  RENOVATION_BOOKING_DELETE: (id) => `${API_URL}/api/renovation-bookings/admin/${id}`,
};

export default API_URL;
