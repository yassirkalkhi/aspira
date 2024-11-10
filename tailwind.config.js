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
        'dark-primary':'#31363F' ,
        'dark-secondary': '#222831',
        'theme-primary': '#76ABAE',
        'theme-secondary': '#EEEEEE',
      },
    },
  },
  plugins: [],
}
