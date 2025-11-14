/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2c2420',      // Dark Brown (hoh108.com)
        accent: '#b8956f',       // Warm Tan (hoh108.com)
        support: '#f5f1ed',      // Light Beige (hoh108.com)
        dark: '#3a3230',         // Medium Dark Brown
        darker: '#4a3f38',       // Darker Brown
      },
      fontFamily: {
        heading: ['The Season', 'serif'],
        subheading: ['Nexa Bold', 'sans-serif'],
        body: ['Nexa Light', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
