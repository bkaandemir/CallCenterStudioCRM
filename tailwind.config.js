/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'ccs-orange': '#F47A00',
        'ccs-yellow': '#F8BB32',
        'ccs-dark': '#1c1c1c',
        'ccs-blue': '#4e86fd',
        'ccs-purple': '#b36cc4',
        'ccs-green': '#39b171',
        'ccs-gray': '#f9f9f9',
        'ccs-soft-blue': '#f4f7fc',
      },
    },
  },
  plugins: [],
};