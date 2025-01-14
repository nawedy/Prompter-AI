/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#fff602', // Yellow
          DEFAULT: '#ffd700', // Golden
          dark: '#001d4f', // Navy
        },
        secondary: {
          light: '#081e2c', // Dark Teal
          DEFAULT: '#081e2c', // Dark Teal
          dark: '#f5f5f5', // Light Gray
        }
      },
    },
  },
  plugins: [],
};