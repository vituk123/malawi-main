/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-background': 'var(--color-dark-background)',
        'dark-text': 'var(--color-dark-text)',
        'dark-accent': 'var(--color-dark-accent)',
        'light-background': 'var(--color-light-background)',
        'light-text': 'var(--color-light-text)',
        'light-accent': 'var(--color-light-accent)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif'],
      },
    },
  },
  plugins: [],
}