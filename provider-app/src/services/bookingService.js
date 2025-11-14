import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

/**
 * Booking Service for Provider App
 * Handles all booking-related API calls
 */

export const bookingService = {
  // Get provider's bookings
  getMyBookings: async (filters = {}) => {
    try {
      const headers = await authService.getAuthHeaders();
      const params = new URLSearchParams(filters).toString();
      const url = `${API_ENDPOINTS.PROVIDER_BOOKINGS}${params ? `?${params}` : ''}`;

      const response = await axios.get(url, { headers });

      if (response.data.success) {
        return { success: true, bookings: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Get bookings error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bookings',
      };
    }
  },

  // Get booking details
  getBookingDetails: async (bookingId) => {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await axios.get(API_ENDPOINTS.BOOKING_DETAILS(bookingId), {
        headers,
      });

      if (response.data.success) {
        return { success: true, booking: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Get booking details error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch booking details',
      };
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status, notes = '') => {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await axios.patch(
        API_ENDPOINTS.BOOKING_UPDATE_STATUS(bookingId),
        { status, notes },
        { headers }
      );

      if (response.data.success) {
        return { success: true, booking: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Update booking status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update booking status',
      };
    }
  },

  // Get today's bookings
  getTodaysBookings: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await bookingService.getMyBookings({ date: today });
    } catch (error) {
      console.error('Get today bookings error:', error);
      return { success: false, message: 'Failed to fetch today\'s bookings' };
    }
  },

  // Get upcoming bookings
  getUpcomingBookings: async () => {
    try {
      return await bookingService.getMyBookings({ status: 'confirmed,provider_on_way' });
    } catch (error) {
      console.error('Get upcoming bookings error:', error);
      return { success: false, message: 'Failed to fetch upcoming bookings' };
    }
  },

  // Request completion OTP
  requestCompletionOTP: async (bookingId) => {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await axios.post(
        API_ENDPOINTS.REQUEST_COMPLETION_OTP(bookingId),
        {},
        { headers }
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Request completion OTP error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP',
      };
    }
  },

  // Verify completion OTP
  verifyCompletionOTP: async (bookingId, otp) => {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await axios.post(
        API_ENDPOINTS.VERIFY_COMPLETION_OTP(bookingId),
        { otp },
        { headers }
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Verify completion OTP error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify OTP',
      };
    }
  },
};
