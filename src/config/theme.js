// HOH108 Provider App - Stunning Color Theme
// A modern, vibrant color system with gradients and shadows

export const colors = {
  // Primary Brand Colors - Purple Gradient Theme
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',  // Main brand color
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Secondary - Complementary Blue
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Success - Emerald Green
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Warning - Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error - Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral - Gray Scale
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Gradients
  gradients: {
    primary: ['#9333ea', '#7e22ce', '#6b21a8'],
    sunset: ['#f59e0b', '#ef4444', '#dc2626'],
    ocean: ['#3b82f6', '#2563eb', '#1d4ed8'],
    forest: ['#10b981', '#059669', '#047857'],
    purple: ['#c084fc', '#9333ea', '#7e22ce'],
    rainbow: ['#f59e0b', '#ef4444', '#9333ea', '#3b82f6'],
  },

  // Status Colors (for bookings)
  status: {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    provider_on_way: '#8b5cf6',
    in_progress: '#6366f1',
    work_completed: '#10b981',
    completed: '#059669',
    cancelled_by_customer: '#ef4444',
    cancelled_by_provider: '#dc2626',
  },

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#f3f4f6',
    dark: '#111827',
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
    link: '#9333ea',
  },

  // Border Colors
  border: {
    light: '#f3f4f6',
    default: '#e5e7eb',
    dark: '#d1d5db',
  },
};

// Shadow Configurations
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  colored: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  }),
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  }),
};

// Border Radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Typography
export const typography = {
  sizes: {
    xs: 12,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Animation Durations
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export default {
  colors,
  shadows,
  borderRadius,
  spacing,
  typography,
  animations,
};
