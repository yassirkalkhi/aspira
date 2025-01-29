import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",      
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
} satisfies Config;
