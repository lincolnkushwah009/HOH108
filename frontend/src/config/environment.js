/**
 * Environment Configuration
 *
 * Switch between production and testing environments easily
 * Change the ENV constant below to switch environments
 */

// ==========================================
// CHANGE THIS TO SWITCH ENVIRONMENTS
// Options: 'development', 'production'
// ==========================================
const ENV = 'development'; // Change to 'production' when deploying
// ==========================================

// Environment configurations
const environments = {
  development: {
    API_URL: 'http://localhost:8000',
    APP_NAME: 'HOH 108 (Dev)',
    DEBUG: true,
    ENABLE_LOGGING: true,
  },
  production: {
    API_URL: 'https://api.hoh108.com', // Replace with your production server URL
    APP_NAME: 'HOH 108',
    DEBUG: false,
    ENABLE_LOGGING: false,
  }
};

// Get current environment config
const currentConfig = environments[ENV] || environments.development;

// Export configuration
export const config = {
  ENV,
  ...currentConfig,
  isDevelopment: ENV === 'development',
  isProduction: ENV === 'production',
};

// Helper function to log only in development
export const devLog = (...args) => {
  if (config.ENABLE_LOGGING) {
    console.log(...args);
  }
};

// Helper function to log errors (always logs)
export const errorLog = (...args) => {
  console.error(...args);
};

export default config;
