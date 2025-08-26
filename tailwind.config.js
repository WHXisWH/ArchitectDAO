/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'toda-blue': '#4A90E2',
        'toda-red': '#FF6B4A',
        'toda-grey': '#9CA3AF'
      },
      fontFamily: {
        'sans': ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}