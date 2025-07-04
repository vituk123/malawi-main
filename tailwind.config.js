/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Professional and lighter color palette for a job portal
      colors: {
        primary: {
          500: '#4A90E2', // A professional blue
        },
        accent: {
          500: '#F5A623', // An inviting orange/yellow
        },
      },
      fontFamily: {'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],},
    },
  },
  plugins: [],
}