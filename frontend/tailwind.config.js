/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0F0C29',
        cardBg: '#161329',
        primary: '#E91E63',
        secondary: '#9C27B0'
      }
    },
  },
  plugins: [],
}
