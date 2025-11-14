import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Storage keys
const TOKEN_KEY = '@provider_token';
const USER_KEY = '@provider_user';

/**
 * Auth Service for Provider App
 * Handles login, logout, and token management
 */

export const authService = {
  // Login provider
  login: async (phone, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        phone,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Check if user is a service provider
        if (user.role !== 'service_provider') {
          throw new Error('Invalid credentials. Only service providers can access this app.');
        }

        // Store token and user data
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        return { success: true, token, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  },

  // Logout provider
  logout: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
    }
  },

  // Get stored token
  getToken: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },

  // Get stored user
  getUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Get auth headers for API calls
  getAuthHeaders: async () => {
    const token = await authService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  },
};
