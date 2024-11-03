/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'dark-primary': '#1f2937',
        'dark-secondary': '#18181A',
      },
    },
  },
  plugins: [],
}
